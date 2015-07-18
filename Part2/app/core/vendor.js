module.exports = function () {
  /* Styles */
  require('../index.scss');
  require('../../node_modules/mdi/css/materialdesignicons.min.css');

  /* JS */
  global.$ = global.jQuery = require('jquery');
  require('velocity-animate');
  require('angular');
  global.moment = require('moment');
  require('node-lumx');
};