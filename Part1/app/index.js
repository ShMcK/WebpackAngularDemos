'use strict';

module.exports = angular.module('app', []);

function printMessage (status='working') {		// default params
  let message = 'ES6';					            	// let
  console.log(`${message} is ${status}`);	    // template string
}
printMessage();