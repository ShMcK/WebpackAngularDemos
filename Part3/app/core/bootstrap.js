/*jshint browser:true */
'use strict';

require('./vendor.js')();
var appModule = require('../index');

angular.element(document).ready(function () {
  angular.bootstrap(document, [appModule.name], {
    //strictDi: true
  });
});