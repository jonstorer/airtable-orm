const request = require('request-promise');
const URL = require('url');
const querystring = require('querystring');
const i = require('inflection');

const BASE_ENDPOINT = 'https://api.airtable.com/v0'

class Airtable {
  constructor (config) {
    this.apiKey = config.apiKey;
    this.base = config.base;
    this.verbose = !!config.verbose;
    this.vverbose = !!config.vverbose;
    this.cache = config.cache;
  }

  collection (klass) {
    return new Collection(i.pluralize(i.camelize(klass.name, true)), this);
  }
}

class Collection {
  constructor (tableName, config) {
    this.tableName = tableName
    this.config = config;
  }

  logRequest(id, params) {
    this.vlog(id, "==>", params.method, params.url, JSON.stringify(params));
  }

  logResponse(id, params, data) {
    this.vlog(id, "<==", params.method, params.url, JSON.stringify(data));
  }

  vlog (...items) {
    if (this.config.vverbose) { console.log(...items); }
  }

  log (...items) {
    if (this.config.verbose) { process.stdout.write(...items); }
  }

  async list (params = {}) {
    const page = async (records, offset) => {
      if (offset) { params.offset = offset; }

      let data = await this._get(this.tableName, params);

      if (!data || !data.records) { return data; }

      records = records.concat(data.records);

      if (!data.offset) { return records; }

      return page(records, data.offset);
    }

    let records;
    if (records = this.config.cache.get(this.tableName)) {
      // records are set
    } else {
      records = await page([], params.offset);
      records = records.map((record) => { return { ...record.fields, id: record.id } });
      this.config.cache.set(this.tableName, records);
    }

    return records;
  }

  async create(doc) {
    let record = await this._post(this.tableName, { fields: doc });
    this.config.cache.reset();
    record = { id: record.id, ...record.fields }
    return record;
  }

  async update(doc) {
    let { id } = doc;
    delete doc.id;
    let record = await this._patch(this.tableName + '/' + id, { fields: doc });
    this.config.cache.reset();
    record = { id: record.id, ...record.fields }
    return record;
  }

  async delete(id) {
    let record = await this._delete(this.tableName + '/' + id);
    this.config.cache.reset();
    return true;
  }

  _get (path, query) {
    return this._request('get', path, { qs: query });
  }

  _post(path, body) {
    return this._request('post', path, { body: body });
  }

  _patch(path, body) {
    return this._request('patch', path, { body: body });
  }

  _delete(path) {
    return this._request('delete', path);
  }

  async _request(action, path, params) {
    const { base, apiKey } = this.config;
    let url = URL.parse(BASE_ENDPOINT);
    url.pathname = [ url.pathname, base, path ].join('/');
    params = {
      ...params,
      method: action,
      url: URL.format(url),
      json: true,
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    }

    let requestId = Math.ceil(Math.random() * 100000) + 1000000;
    this.logRequest(requestId, params);

    let data = await request(params)

    this.logResponse(requestId, params, data);

    return data;
  }
}

module.exports = Airtable;
