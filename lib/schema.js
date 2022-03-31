const _ = require('lodash');
const i = require('inflection');

class Schema {
  #definitions;
  #primaryKeyDefinition;

  constructor(fields = {}) {
    this.#definitions = {};

    for (const field in fields) {
      this.addField(field, fields[field]);
    }
  }

  get definitions() {
    return this.#definitions;
  }

  addDefinition(definition={}) {
    if (definition.primaryKey) {
      if (this.#primaryKeyDefinition) {
        //todo make a better error
        throw 'primary key has already been defined'
      } else {
        this.#primaryKeyDefinition = definition;
      }
    }

    this.#definitions[definition.propertyName] = definition;
  }

  addField(name, properties = {}) {
    const fieldDefinition = this.#buildFieldDefinition(name, properties)
    this.addDefinition(fieldDefinition);
    return fieldDefinition;
  }

  #buildFieldDefinition(name, optionsOrType) {
    let definition = (typeof optionsOrType == 'object')
      ? optionsOrType
      : { type: optionsOrType }

    definition = Object.assign({ type: String }, definition);
    definition.readonly = !!definition.readonly;
    definition.primaryKey = !!definition.primaryKey;
    definition.propertyName = name;

    return definition;
  }

  belongsTo(name) {
    const relationshipClass = i.classify(name)
    const relationshipPropertyName = i.camelize(relationshipClass, true)
    const relationshipKeyPropertyName = i.camelize(i.foreign_key(relationshipPropertyName), true)

    const fieldDefinition = {
      propertyName: relationshipKeyPropertyName,
      type: Number,
      readonly: false
    };

    this.addDefinition(fieldDefinition);

    const relationshipDefinition = {
      propertyName: relationshipPropertyName,
      relationshipClass: relationshipClass,
      relationshipKeyPropertyName: relationshipKeyPropertyName,
      readonly: true,
    };

    this.addDefinition(relationshipDefinition);
  }

  //get attributeNames() {
    //return Object.keys(this._attributes);
  //}

  //get attributes() {
    //return this._attributes;
  //}

  //get propertyNames() {
    //return Array.from(this._properties);
  //}

  //get readonlyNames() {
    //return Array.from(this._readonly);
  //}

  //addAttribute(field, defaultValue) {
    //this._attributes[field] = defaultValue || function noop() { };
    //return this;
  //}

  //addProperty(field) {
    //this._properties.add(field);
    //return this;
  //}

  //addReadOnly(field) {
    //this._readonly.add(field);
    //return this;
  //}
}

module.exports = Schema;
