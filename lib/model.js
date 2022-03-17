const _ = require('lodash');
const i = require('inflection');
const {
  Schema,
  SchemaTypes,
  SchemaSingleElementArray
} = require('./schema');

class Model {
  constructor(doc = {}) {
    this._doc = {};
    this.assign(doc);
  }

  assign(doc) {
    let { schema } = this.constructor;

    for (let attr of schema.attributeNames) {
      if (doc.hasOwnProperty(attr)) {
        this[attr] = doc[attr] || schema.attributes[attr]();
      }
    }

    return this;
  }

  get _object() { return this.constructor.name; }

  // instance: serialization

  toJSON() {
    return this
      .constructor
      .schema
      .propertyNames
      .sort()
      .reduce((m, k) => ({ ...m, [k]: this[k] }), {});
  }

  toPayload() {
    let schema = this.constructor.schema
    let attributes = schema.attributeNames
    let readOnlyFields = schema.readonlyNames
    let keys = attributes.filter(e => !readOnlyFields.includes(e));

    return keys.reduce((m, k) => ({ ...m, [k]: this._doc[k] }), {});
  }

  // end instance: serialization

  // public static: build instances

  static create(attributes) {
    return (new this(attributes)).save();
  }

  // public static: query

  static async find(query) {
    let records = await this.collection.list(query || {});
    return records.map((record) => { return new this(record); });
  }

  static async where(query) {
    let records = await this.find({});
    return _(records).filter(query).value();
  }

  static async findOne(query = {}) {
    return (await this.where(query))[0];
  }

  static findById(id) {
    return this.findOne({ id: id });
  }

  static first() {
    return this.findOne({});
  }

  static all() {
    return this.find({});
  }

  // end public static: query

  // public instance: persistance

  async save() {
    let collection = this.constructor.collection;
    let doc = this.id
      ? await collection.update(this.toPayload())
      : await collection.create(this.toPayload());
    return this.assign(doc);
  }

  update(doc) {
    this.assign(doc);
    return this.save();
  }

  async delete() {
    let collection = this.constructor.collection;
    return await collection.delete(this.id);
  }

  // end public instance: persistance

  // public static: repository

  static get collection() {
    return this.adapter.collection(this);
  }

  // end public static: repository

  // private static: repository

  static set adapter(adapter) {
    this._adapter = adapter;
  }

  static get adapter() {
    return this._adapter;
  }

  // end private static: repository

  // private subclass registration

  static register(klass) {
    this.subclass = this.subclass || {};
    return this.subclass[klass.name] = klass;
  }

  // end private subclass registration

  // methods to set and get schemas of models

  static get schema() {
    return this._schema = this._schema || new Schema().addProperty('_object');
  }

  // end schema

  // macros: model definition

  static property(propertyName) {
    this.schema.addProperty(propertyName);
  }

  static field(property, typeOrOptions) {
    let options = (typeof typeOrOptions === 'object')
      ? Object.assign({ type: String }, typeOrOptions)
      : { type: (typeOrOptions || String) };

    this.schema.addProperty(property);
    this.schema.addAttribute(property, options.defaultValue);
    if (options.readonly) { this.schema.addReadOnly(property); }

    let Type = SchemaTypes[options.type.name];

    Object.defineProperty(this.prototype, property, {
      get: function () {
        return new Type(this._doc[property]).out;
      },
      set: function (v) {
        this._doc[property] = new Type(v).in;
      }
    });
  }

  static delegates(property, target, options = {}) {
    options.prefix = (typeof options.prefix === 'undefined') ? true : options.prefix;
    options.allowNull = !!options.allowNull;

    let fieldName = i.camelize(target, true);

    let propertyName = options.as || options.prefix
      ? [fieldName, i.camelize(property)].join('')
      : i.camelize(property, true)

    this.schema.addProperty(propertyName);
    this.schema.addReadOnly(propertyName);

    //console.log(this.name, 'delegates', property, 'to', fieldName, 'as', propertyName);

    Object.defineProperty(this.prototype, propertyName, {
      get: function () {
        return (async () => {
          let model = await this[fieldName];
          if (options.allowNull) { model = model || {} }
          return model[property] || null;
        })();
      }
    });
  }

  // end macros: model definition

  // macros: relationships

  static belongsTo(klass, options = {}) {
    let foreignKlass = i.classify(klass);
    let propertyName = i.camelize(options.as || foreignKlass, true)
    let foreignKey = i.camelize(i.foreign_key(propertyName), true)

    //console.log(this.name, 'belongsTo', propertyName, 'owning', foreignKey, 'to find', foreignKlass);

    this.field(foreignKey, { type: SchemaSingleElementArray })
    if (options.property) {
      this.schema.addProperty(propertyName);
    }

    Object.defineProperty(this.prototype, propertyName, {
      get: function () {
        if (!this[foreignKey]) { return null; }

        return this.constructor
          .subclass[foreignKlass]
          .findOne({ id: this[foreignKey] });
      }
    });
  }

  static hasMany(klass, options = {}) {
    let foreignKlass = i.classify(klass);
    let foreignKey = i.pluralize(i.camelize(i.foreign_key(i.singularize(options.as || foreignKlass)), true));
    let propertyName = i.pluralize(i.camelize(options.as || foreignKlass, true));

    //console.log(this.name, 'hasMany', propertyName, 'owning', foreignKey, 'to find', foreignKlass);

    this.field(foreignKey, { type: Array });
    if (options.property) {
      this.schema.addProperty(propertyName);
    }

    Object.defineProperty(this.prototype, propertyName, {
      get: function () {
        let ids = this[foreignKey];
        if (!ids) { return []; }
        let klass = this.constructor.subclass[foreignKlass];
        return klass.where((record) => { return !!~ids.indexOf(record.id); });
      }
    });
  }

  static referencesMany(klass, options) {
    let foreignKlass = i.classify(klass);
    let foreignKey = i.camelize(i.foreign_key(options.inverseOf || foreignKlass), true);
    let propertyName = i.pluralize(i.camelize(options.as || klass, true));

    //console.log(this.name, 'referencesMany', propertyName, 'by looking for', foreignKey, 'on', foreignKlass);

    if (options.property) {
      this.schema.addProperty(propertyName);
    }

    Object.defineProperty(this.prototype, propertyName, {
      get: function () {
        return (async () => {
          let klass = this.constructor.subclass[foreignKlass];
          return await klass.where({ [foreignKey]: this.id });
        })();
      }
    });
  }

  // end macros: relationships
}

Model.SchemaTypes = SchemaTypes;

module.exports = Model;
