const expect = require('chai').expect;

const Schema = require('../../lib/Schema')

describe('Schema', function () {
  let schema, definition;

  describe('defaults', function () {
    it('is an instance of schema', function () {
      schema = new Schema({ });
      expect(schema).to.be.an.instanceof(Schema);
    });

    it.skip('adds fields passed into the constructor', function () {
    });
  });

  describe('addField', function () {
    let schema;

    beforeEach(function () {
      schema = new Schema();
    });

    it('missing, it sets the type to String', function () {
      let definition = schema.addField('_id');
      expect(definition.type).to.eql(String);
    });

    it('that do not define the type, it sets the type to String', function () {
      let definition = schema.addField('_id', {});
      expect(definition.type).to.eql(String);
    });

    it('defaults readonly to false', function () {
      let definition = schema.addField('_id');
      expect(definition.readonly).to.be.false;
    });

    it('returns the name of the property', function () {
      let definition = schema.addField('_id');
      expect(definition.propertyName).to.eql('_id');
    });

    it('returns the type of the property', function () {
      let definition = schema.addField('_id', { type: Number });
      expect(definition.type).to.eql(Number);
    });

    describe('primaryKey', function () {
      it('defaults to primaryKey false', function () {
        let definition = schema.addField('_id');
        expect(definition.primaryKey).to.be.false;
      });

      it('can be identified as the primaryKey', function () {
        let definition = schema.addField('_id', { primaryKey: true });
        expect(definition.primaryKey).to.be.true;
      });

      it('allows one primaryKey', function () {
        schema.addField('_id', { primaryKey: true });
        expect(function () {
          schema.addField('id', { primaryKey: true });
        }).to.throw(/primary key has already been defined/)
      });
    })
  });

  describe('belongsTo', function () {
    let fieldDefinition, relationshipDefinition;

    beforeEach(function () {
      let schema = new Schema();
      schema.belongsTo('Widget');
      fieldDefinition = schema.definitions.widgetId;
      relationshipDefinition = schema.definitions.widget;
    });

    describe('foriegnKey definition', function () {
      it('defines the property name', function () {
        expect(fieldDefinition.propertyName).to.eql('widgetId');
      });

      it('defines the property type as Number', function () {
        expect(fieldDefinition.type).to.eql(Number);
      });

      it('defins the field as writeable', function () {
        expect(fieldDefinition.readonly).to.be.false;
      });
    });

    describe('relationship definition', function () {
      it('defines the property name', function () {
        expect(relationshipDefinition.propertyName).to.eql('widget');
      });

      it('defines the field as writeable', function () {
        expect(relationshipDefinition.readonly).to.be.true;
      });

      it('defines the relationship class', function () {
        expect(relationshipDefinition.relationshipClass).to.eql('Widget')
      });

      it('defines the relationship class', function () {
        expect(relationshipDefinition.relationshipKeyPropertyName).to.eql('widgetId');
      });
    });
  });
});
