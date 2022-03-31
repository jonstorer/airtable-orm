class Repository {
  #resourceName;
  #apiClient;

  constructor (resourceName, apiClient) {
    this.#resourceName = resourceName
    this.#apiClient = apiClient;
  }

  async #nextPage (records, offset) {
    const params = {};

    if (offset) { params.offset = offset; }

    let data = await this.#apiClient.get(this.#resourceName, params);

    if (!data || !data.records) { return data; }

    records = records.concat(data.records);

    if (!data.offset) { return records; }

    return this.#nextPage(records, data.offset);
  }

  async index (params = {}) {
    const records = await this.#nextPage([], params.offset);
    return records.map((record) => {
      return { id: record.id, ...record.fields };
    });
  }

  async show (id) {
    const record = await this.#apiClient.get(this.#resourceName + '/' + id);
    return { id: record.id, ...record.fields };
  }

  async create(doc) {
    const record = await this.#apiClient.post(this.#resourceName, { fields: doc });
    return { id: record.id, ...record.fields };
  }

  async update(doc) {
    const id = doc.id;
    delete doc.id;
    const record = await this.#apiClient.patch(this.#resourceName + '/' + id, { fields: doc });
    return { id: record.id, ...record.fields };
  }

  async delete(id) {
    await this.#apiClient.delete(this.#resourceName + '/' + id);
    return true;
  }
}

module.exports = Repository;
