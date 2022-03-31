// TODO: these don't need to be classes

class AirtableBaseType {
  constructor(value) { this.value = value; }
  get in() { return this.value || null; }
  get out() { return this.value || null; }
}

class AirtableDate extends AirtableBaseType {
  get in() {
    return new Date(this.value).toJSON();
  }
  get out() {
    return this.value
      ? new Date(this.value)
      : null;
  }
}

class AirtableSingleElementArray extends AirtableBaseType {
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

class AirtableArray extends AirtableBaseType {
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

class AirtableBoolean extends AirtableBaseType {
  get in() { return !!this.value; }
  get out() { return !!this.value; }
}

class AirtableAttachmentUrl extends AirtableBaseType {
  get out() {
    return (Array.isArray(this.value))
      ? (this.value[0] && this.value[0].url)
      : null;
  }
}

class AirtableAttachment extends AirtableBaseType {
  get out() {
    return (Array.isArray(this.value))
      ? this.value[0]
      : null;
  }
}

module.exports.Date = AirtableDate;
module.exports.Number = AirtableBaseType;
module.exports.String = AirtableBaseType;
module.exports.Boolean = AirtableBoolean;
module.exports.Array = AirtableArray;
module.exports.SingleElementArray = AirtableSingleElementArray;
module.exports.Attachment = AirtableAttachment
module.exports.AttachmentUrl = AirtableAttachmentUrl
