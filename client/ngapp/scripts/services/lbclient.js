'use strict';

// load lbclient via browserify's require
var client = (function() {
  /*global require:true*/
  return require('lbclient');
})();

/**
 * @ngdoc service
 * @name loopbackExampleFullStackApp.lbclient
 * @description
 * # lbclient
 * Value in the loopbackExampleFullStackApp.
 */
angular.module('loopbackExampleFullStackApp')
  .value('Note', client.models.LocalNote)
  .value('RemoteNote', client.models.RemoteNote)
  .value('sync', client.sync);
