const Model = require('./Model');

class WidgetPart extends Model { }

WidgetPart.belongsTo('Widget');
WidgetPart.belongsTo('Part');
WidgetPart.delegates('name', 'part');
WidgetPart.delegates('code', 'part');
WidgetPart.delegates('description', 'part');

module.exports = Model.register(WidgetPart);
