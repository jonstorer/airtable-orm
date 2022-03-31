const expect = require('chai').expect;

const Schema = require('../../lib/Schema')
const Model = require('../../lib/Model')
const compile = require('../../lib/compile')

describe('compile', function () {
  describe('defines a new class', function () {
    let Resource, schema;

    beforeEach(function () {
      schema = new Schema({});
      Resource = compile('MyNewKlass', schema, 'i am a repository');
    });

    it('creates a class that is a subclass of Model', function () {
      expect(Resource.prototype).to.be.an.instanceOf(Model)
    });

    it('names the new class correctly', function () {
      expect(Resource.name).to.eql('MyNewKlass');
      expect(Object.getOwnPropertyDescriptor(Resource, 'name').writable).to.be.false;
    });

    it('links the schema to the new class', function () {
      expect(Resource._schema).to.eql(schema);
      expect(Object.getOwnPropertyDescriptor(Resource, '_schema').writable).to.be.false;
    });

    it('sets up the repsotiory', function () {
      console.log(Resource._repository);
    });
  });

  describe('_object property', function () {
    let Resource, descriptor;

    beforeEach(function () {
      let schema = new Schema({ _id: String, name: String });
      Resource = compile('Resource', schema);
      descriptor = Object.getOwnPropertyDescriptor(Resource.prototype, '_object');
    });

    it('creates a property for _object', function () {
      expect(descriptor).to.exist;
    });

    it('has the value defined correctly', function () {
      expect(descriptor.value).to.eql('Resource');
    });

    it('returns the correct object type', function () {

      expect(new Resource()._object).to.eql('Resource');
    });

    it('is not writable', function () {
      expect(descriptor.writable).to.be.false;
    });
  });

  describe('field definitions in the schema', function () {
    let descriptor;

    beforeEach(function () {
      let Resource = compile('Resource', new Schema({ field: String }));
      descriptor = Object.getOwnPropertyDescriptor(Resource.prototype, 'field');
    });

    it('creates a property for field', function () {
      expect(descriptor).to.exist;
    });

    it('defines a getter', function () {
      let instance = { _doc: { field: 'test' } };
      expect(descriptor.get).to.be.an.instanceof(Function)
      expect(descriptor.get.call(instance)).to.eql('test');
    });

    it('defines a setter', function () {
      let instance = { _doc: { field: 'test' } };
      expect(descriptor.set).to.be.an.instanceof(Function)
      descriptor.set.call(instance, 'new')
      expect(instance._doc.field).to.eql('new');
    });
  });
});
