const expect = require('chai').expect;
const uuid = require('uuid').v4;
const nock = require('nock')

nock.disableNetConnect()

const Airtable = require('../../lib')
const Schema = Airtable.Schema;

describe('when loading the first record', function () {
  let Widget, scope;

  beforeEach(function () {
    let airtable = new Airtable({ appBase: 'base', apiKey: 'key' });

    Widget = airtable.model('Widget', new Schema({ id: String }));

    scope = nock('https://api.airtable.com')
  });

  afterEach(function () {
    nock.cleanAll();
  });

  it('make a rest call to list records', async function () {
    scope
      .get('/v0/base/widgets')
      .reply(200, {
        offset: 2,
        records: [ { id: uuid() }, { id: uuid() } ]
      });

    scope
      .get('/v0/base/widgets')
      .query({ offset: 2 })
      .reply(200, { records: [ { id: uuid() }, { id: uuid() } ] });

    let widgets = await Widget.find();
    expect(widgets.length).to.eql(4)
  });

  it('fetch a single record by id', async function () {
    const id = uuid();
    scope
      .get('/v0/base/widgets/' + id)
      .reply(200, { id: id });

    let widget = await Widget.findById(id);
    expect(widget.id).to.eql(id);
  });
});
