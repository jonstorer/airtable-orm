const Model = require('./Model');

class Widget extends Model { }

Widget.field('id');
Widget.field('code');

Widget.hasMany('Parts', { through: 'WidgetPart' });

module.exports = Model.register(Widget);
