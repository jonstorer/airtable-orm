const i = require('inflection');

const ApiClient = require('./ApiClient');
const Repository = require('./Repository');
const compile = require('./compile');

class Airtable {
  #apiClient;

  constructor(config={}) {
    this.#apiClient = new ApiClient(config);
  }

  model (name, schema) {
    const resourceName = i.pluralize(i.camelize(name, true));
    const repository = new Repository(resourceName, this.#apiClient);

    const className = i.camelize(name)
    return compile(className, schema, repository);
  }
}

module.exports = Airtable;
module.exports.Schema = require('./Schema');
