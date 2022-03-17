const _ = require('lodash');

class Schema {
  constructor() {
    this._attributes = {};
    this._properties = new Set();
    this._readonly = new Set();
  }

  get attributeNames() {
    return Object.keys(this._attributes);
  }

  get attributes() {
    return this._attributes;
  }

  get propertyNames() {
    return Array.from(this._properties);
  }

  get readonlyNames() {
    return Array.from(this._readonly);
  }

  addAttribute(field, defaultValue) {
    this._attributes[field] = defaultValue || function noop() { };
    return this;
  }

  addProperty(field) {
    this._properties.add(field);
    return this;
  }

  addReadOnly(field) {
    this._readonly.add(field);
    return this;
  }
}

class NoOp {
  constructor(value) { this.value = value; }
  get in() { return this.value || null; }
  get out() { return this.value || null; }
}

class SchemaDate extends NoOp {
  get in() {
    return new Date(this.value).toJSON();
  }
  get out() {
    return this.value
      ? new Date(this.value)
      : null;
  }
}

class SchemaSingleElementArray extends NoOp {
  get in() {
    let values = [this.value];
    values = [].concat.call([], ...values);
    return values.filter((v) => !!v);
  }
  get out() {
    return (Array.isArray(this.value)
      ? this.value[0]
      : this.value) || null;
  }
}

class SchemaArray extends NoOp {
  get in() {
    let values = [this.value];
    values = [].concat.call([], ...values);
    return values.filter((v) => !!v);
  }
  get out() {
    let values = [this.value];
    values = [].concat.call([], ...values);
    return values.filter((v) => !!v);
  }
}

class SchemaBoolean extends NoOp {
  get in() { return !!this.value; }
  get out() { return !!this.value; }
}

class AttachmentUrl extends NoOp {
  get out() {
    return (Array.isArray(this.value))
      ? (this.value[0] && this.value[0].url)
      : null;
  }
}

class Attachment extends NoOp {
  get out() {
    return (Array.isArray(this.value))
      ? this.value[0]
      : null;
  }
}

Schema.SchemaTypes = {
  NoOp,
  SchemaArray,
  SchemaDate,
  SchemaBoolean,
  SchemaSingleElementArray,
  AttachmentUrl,
  Attachment
};

Schema.SchemaTypes.Date = Schema.SchemaTypes.SchemaDate;
Schema.SchemaTypes.Number = Schema.SchemaTypes.NoOp;
Schema.SchemaTypes.String = Schema.SchemaTypes.NoOp;
Schema.SchemaTypes.Boolean = Schema.SchemaTypes.SchemaBoolean;
Schema.SchemaTypes.Array = Schema.SchemaTypes.SchemaArray;

module.exports.Schema = Schema;
Object.assign(module.exports, Schema);
Object.assign(module.exports, Schema.SchemaTypes)
