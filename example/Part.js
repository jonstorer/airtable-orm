const Model = require('./Model');

class Part extends Model { }

Part.field('id');
Part.field('name');
Part.field('description');
Part.field('code', Number);
Part.field('active', Boolean);
Estimate.field('createdAt', { type: Model.SchemaTypes.Date, readonly: true });
Estimate.field('updatedAt', { type: Model.SchemaTypes.Date, readonly: true });

module.exports = Model.register(Part);
