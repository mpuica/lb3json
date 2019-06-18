'use strict';

/**
 * @ngdoc function
 * @name loopbackExampleFullStackApp.controller:ChangeCtrl
 * @description
 * # ChangeCtrl
 * Controller of the loopbackExampleFullStackApp
 */
angular.module('loopbackExampleFullStackApp')
  .controller('ChangeCtrl', function ChangeCtrl($scope, $routeParams, $filter,
                                                Note, RemoteNote) {

    Note.getChangeModel().find(function(err, changes) {
      $scope.changes = changes;
      $scope.$apply();

      RemoteNote.diff(0, changes, function(err, diff) {
        $scope.diff = diff;
        $scope.$apply();
      });
    });

    $scope.clearLocalStorage = function() {
      localStorage.removeItem('note-db');
    };

    Note.findById('3e4444f0-9130-11e9-862c-89e21e3a3b8b', function(err, note) {
      $scope.note = note;
      $scope.$apply();
    });
  });
