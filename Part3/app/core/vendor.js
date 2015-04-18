module.exports = function () {
  /* Styles */
  require('../index.scss');
  require('../../node_modules/mdi/scss/materialdesignicons.scss');

  /* JS */
  global.$ = global.jQuery = require('jquery');
  require('velocity-animate');
  require('angular');
  global.moment = require('moment');
  require('imports?angular!../bower_components/lumx/dist/lumx.js');
};