const _ = require('lodash');
const i = require('inflection');
//const {
  //Schema,
  //SchemaTypes,
  //SchemaSingleElementArray
//} = require('./schema');

class Model {
  constructor(doc = {}) {
    this._doc = {};
    //this.assign(doc);
  }

  //assign(doc) {
    //let { schema } = this.constructor;

    //for (let attr of schema.attributeNames) {
      //if (doc.hasOwnProperty(attr)) {
        //this[attr] = doc[attr] || schema.attributes[attr]();
      //}
    //}

    //return this;
  //}

  // instance: serialization

  //toJSON() {
    //return this
      //.constructor
      //.schema
      //.propertyNames
      //.sort()
      //.reduce((m, k) => ({ ...m, [k]: this[k] }), {});
  //}

  //toPayload() {
    //let schema = this.constructor.schema
    //let attributes = schema.attributeNames
    //let readOnlyFields = schema.readonlyNames
    //let keys = attributes.filter(e => !readOnlyFields.includes(e));

    //return keys.reduce((m, k) => ({ ...m, [k]: this._doc[k] }), {});
  //}

  // end instance: serialization

  // public static: build instances

  static async create(attributes) {
    return (new this(attributes)).save();
  }

  // public static: query

  //static async find(query) {
    //let records = await this.collection.index(query || {});
    //return records.map((record) => { return new this(record); });
  //}

  static async find(query) {
    return await this._repository.index(query || {});
  }

  //static async where(query) {
    //let records = await this.find({});
    //return _(records).filter(query).value();
  //}

  //static async findOne(query = {}) {
    //return (await this.where(query))[0];
  //}

  static findById(id) {
    return this._repository.show(id);
  }

  //static first() {
    //return this.findOne({});
  //}

  //static all() {
    //return this.find({});
  //}

  // end public static: query

  // public instance: persistance

  //async save() {
    //let collection = this.constructor.collection;
    //let doc = this.id
      //? await collection.update(this.toPayload())
      //: await collection.create(this.toPayload());
    //return this.assign(doc);
  //}

  //async update(doc) {
    //this.assign(doc);
    //return this.save();
  //}

  //async del() {
    //let collection = this.constructor.collection;
    //return await collection.delete(this.id);
  //}

  // end public instance: persistance

  // public static: repository

  //static get collection() {
    //return this.adapter.collection(this);
  //}

  // end public static: repository

  // private static: repository

  //static set adapter(adapter) {
    //this._adapter = adapter;
  //}

  //static get adapter() {
    //return this._adapter;
  //}

  // end private static: repository

  // methods to set and get schemas of models

  //static get schema() {
    //return this._schema = this._schema || new Schema().addProperty('_object');
  //}

  // end schema

}

//Model.SchemaTypes = SchemaTypes;

module.exports = Model;
