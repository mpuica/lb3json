'use strict';

/**
 * @ngdoc function
 * @name loopbackExampleFullStackApp.controller:NoteCtrl
 * @description
 * # NoteCtrl
 * Controller of the loopbackExampleFullStackApp
 */
angular.module('loopbackExampleFullStackApp')
  .controller('NoteCtrl', function NoteCtrl($scope, $routeParams, $filter, Note,
                                            $location, sync) {
  $scope.note = {};

  $scope.newNote = '';
  $scope.editedNote = null;

  // sync the initial data
  sync(onChange);

  // the location service
  $scope.loc = $location;

  function onChange() {
    console.log('change trigger')
    Note.findById('3e4444f0-9130-11e9-862c-89e21e3a3b8b', function(err, note) {
      console.log('notes fetch')
      console.log(note)
      $scope.note = note;
      $scope.$apply();
    });
  }

  function error(err) {
    //TODO error handling
    throw err;
  }

  function errorCallback(err) {
    if(err) error(err);
  }

  Note.observe('after save', function(ctx, next) {
    next();
    onChange();
  });
  Note.observe('after delete', function(ctx, next) {
    next();
    onChange();
  });

  $scope.addNote = function () {
    Note.create({payload: $scope.newNote})
      .then(function() {
        $scope.newNote = '';
        $scope.$apply();
      });
  };

  $scope.editNote = function (note) {
    $scope.editedNote = note;
  };

  $scope.doneEditing = function (note) {
    $scope.editedNote = null;

    if (!note.payload) {
      $scope.removeNote(note);
    } else {
      note.save();
    }
  };

  $scope.removeNote = function (note) {
    note.remove(errorCallback);
  };

  $scope.sync = function() {
    sync();
  };

  Note.on('conflicts', function(conflicts) {
    $scope.localConflicts = conflicts;

    conflicts.forEach(function(conflict) {
      conflict.type(function(err, type) {
        conflict.type = type;
        conflict.models(function(err, source, target) {
          conflict.source = source;
          conflict.target = target;
          conflict.manual = new conflict.SourceModel(source || target);
          $scope.$apply();
        });
        conflict.changes(function(err, source, target) {
          conflict.sourceChange = source;
          conflict.targetChange = target;
          $scope.$apply();
        });
      });
    });
  });

  $scope.resolveUsingSource = function(conflict) {
    conflict.resolveUsingSource(refreshConflicts);
  };

  $scope.resolveUsingTarget = function(conflict) {
    conflict.resolveUsingTarget(refreshConflicts);
  };

  $scope.resolveManually = function(conflict) {
    conflict.resolveManually(conflict.manual, refreshConflicts);
  };

  function refreshConflicts() {
    $scope.localConflicts = [];
    $scope.$apply();
    sync();
  }
});

