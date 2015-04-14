/*jshint browser:true */
'use strict';

require('./vendor.js')();
var appModule = require('../index');

if (MODE.production) { // jshint ignore:line
  require('./config/production')(appModule);
}

angular.element(document).ready(() => {
  angular.bootstrap(document, [appModule.name], {
      //strictDi: true
    }
  );
});