module.exports = function () {
  /* Styles */
  require('../index.scss');
  require('../../node_modules/node-mdi/materialdesignicons.css');

  /* JS */
  global.$ = global.jQuery = require('jquery');
  require('velocity-animate');
  require('angular');
  global.moment = require('moment');
  require('node-lumx');
};