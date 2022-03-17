const Airtable = require('../../../lib/airtable');
const Model = require('../../../lib/model');

Model.adapter = new Airtable({ /* airtable config */ })

module.exports = Model;
