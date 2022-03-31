const axios = require('axios');
const uuid = require('uuid').v4;
const querystring = require('querystring');
const URL = require('url');

class Client {
  #appBase;
  #apiKey
  #domain
  #apiVersion

  constructor (config={}) {
    this.#appBase = config.appBase;
    this.#apiKey = config.apiKey;
    this.#domain = config.domain || 'https://api.airtable.com';
    this.#apiVersion = config.apiVersion || 'v0';
  }

  async get (path, query) {
    return this.#send('get', path, { params: query });
  }

  async post (path, body) {
    return this.#send('post', path, { body: body });
  }

  async patch (path, body) {
    return this.#send('patch', path, { body: body });
  }

  async delete (path) {
    return this.#send('delete', path, { });
  }

  async #send (method, path, params) {
    const requestId = uuid();

    params = {
      ...params,
      method: method,
      url: this.#buildUrlFromPath(path),
      json: true,
      headers: {
        "X-Request-ID": requestId,
        Authorization: `Bearer ${this.#apiKey}`
      }
    };

    const response = await axios(params)
    return response.data;
  }

  #buildUrlFromPath(path) {
    const url = URL.parse(this.#domain);
    url.pathname = url.pathname + [ this.#apiVersion, this.#appBase, path ].join('/');
    return URL.format(url);
  }
}

module.exports = Client;
