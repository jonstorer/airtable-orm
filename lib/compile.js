const i = require('inflection');

//const Repository = require('./Repository');
//const ApiClient = require('./ApiClient');
const Model = require('./Model');

module.exports = function (className, schema, repository) {

  const newClass = class extends Model { }

  Object.defineProperty(newClass, 'name', { value: className, writable: false });
  Object.defineProperty(newClass, '_schema', { value: schema, writable: false });
  Object.defineProperty(newClass, '_repository', { value: repository, writable: false });

  Object.defineProperty(newClass.prototype, '_object', { value: className, writable: false })

  const definitions = schema.definitions;

  for (const definitionName in definitions) {
    const definition = definitions[definitionName];

    const descriptor = {};

    switch(definition.propertyType) {
      //case 'meta':
        //descriptor.value = newClass.name;
        //descriptor.writable = false;
        //break;
      default:
        descriptor.get = function () { return this._doc[definitionName]; }
        descriptor.set = function (v) { this._doc[definitionName] = v; }
    }

    Object.defineProperty(newClass.prototype, definition.propertyName, descriptor)
  }

  return newClass;
}





  //static field(property, typeOrOptions) {
    //let options = (typeof typeOrOptions === 'object')
      //? Object.assign({ type: String }, typeOrOptions)
      //: { type: (typeOrOptions || String) };

    //this.schema.addProperty(property);
    //this.schema.addAttribute(property, options.defaultValue);
    //if (options.readonly) { this.schema.addReadOnly(property); }

    //let Type = SchemaTypes[options.type.name];

    //Object.defineProperty(this.prototype, property, {
      //get: function () {
        //return new Type(this._doc[property]).out;
      //},
      //set: function (v) {
        //this._doc[property] = new Type(v).in;
      //}
    //});
  //}

  //console.log(klass);

  // macros: model definition

  //static property(propertyName) {
    //this.schema.addProperty(propertyName);
  //}

  //static field(property, typeOrOptions) {
    //let options = (typeof typeOrOptions === 'object')
      //? Object.assign({ type: String }, typeOrOptions)
      //: { type: (typeOrOptions || String) };

    //this.schema.addProperty(property);
    //this.schema.addAttribute(property, options.defaultValue);
    //if (options.readonly) { this.schema.addReadOnly(property); }

    //let Type = SchemaTypes[options.type.name];

    //Object.defineProperty(this.prototype, property, {
      //get: function () {
        //return new Type(this._doc[property]).out;
      //},
      //set: function (v) {
        //this._doc[property] = new Type(v).in;
      //}
    //});
  //}

  //static delegates(property, target, options = {}) {
    //options.prefix = (typeof options.prefix === 'undefined') ? true : options.prefix;
    //options.allowNull = !!options.allowNull;

    //let fieldName = i.camelize(target, true);

    //let propertyName = options.as || options.prefix
      //? [fieldName, i.camelize(property)].join('')
      //: i.camelize(property, true)

    //this.schema.addProperty(propertyName);
    //this.schema.addReadOnly(propertyName);

    ////console.log(this.name, 'delegates', property, 'to', fieldName, 'as', propertyName);

    //Object.defineProperty(this.prototype, propertyName, {
      //get: function () {
        //return (async () => {
          //let model = await this[fieldName];
          //if (options.allowNull) { model = model || {} }
          //return model[property] || null;
        //})();
      //}
    //});
  //}

  // end macros: model definition

  // macros: relationships

  //static belongsTo(klass, options = {}) {
    //let foreignKlass = i.classify(klass);
    //let propertyName = i.camelize(options.as || foreignKlass, true)
    //let foreignKey = i.camelize(i.foreign_key(propertyName), true)

    ////console.log(this.name, 'belongsTo', propertyName, 'owning', foreignKey, 'to find', foreignKlass);

    //this.field(foreignKey, { type: SchemaSingleElementArray })
    //if (options.property) {
      //this.schema.addProperty(propertyName);
    //}

    //Object.defineProperty(this.prototype, propertyName, {
      //get: function () {
        //if (!this[foreignKey]) { return null; }

        //return this.constructor
          //.subclass[foreignKlass]
          //.findOne({ id: this[foreignKey] });
      //}
    //});
  //}

  //static hasMany(klass, options = {}) {
    //let foreignKlass = i.classify(klass);
    //let foreignKey = i.pluralize(i.camelize(i.foreign_key(i.singularize(options.as || foreignKlass)), true));
    //let propertyName = i.pluralize(i.camelize(options.as || foreignKlass, true));

    ////console.log(this.name, 'hasMany', propertyName, 'owning', foreignKey, 'to find', foreignKlass);

    //this.field(foreignKey, { type: Array });
    //if (options.property) {
      //this.schema.addProperty(propertyName);
    //}

    //Object.defineProperty(this.prototype, propertyName, {
      //get: function () {
        //let ids = this[foreignKey];
        //if (!ids) { return []; }
        //let klass = this.constructor.subclass[foreignKlass];
        //return klass.where((record) => { return !!~ids.indexOf(record.id); });
      //}
    //});
  //}

  //static referencesMany(klass, options) {
    //let foreignKlass = i.classify(klass);
    //let foreignKey = i.camelize(i.foreign_key(options.inverseOf || foreignKlass), true);
    //let propertyName = i.pluralize(i.camelize(options.as || klass, true));

    ////console.log(this.name, 'referencesMany', propertyName, 'by looking for', foreignKey, 'on', foreignKlass);

    //if (options.property) {
      //this.schema.addProperty(propertyName);
    //}

    //Object.defineProperty(this.prototype, propertyName, {
      //get: function () {
        //return (async () => {
          //let klass = this.constructor.subclass[foreignKlass];
          //return await klass.where({ [foreignKey]: this.id });
        //})();
      //}
    //});
  //}

  // end macros: relationships
