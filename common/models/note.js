'use strict';

var async = require('async');

module.exports = function(Note) {
  Note.definition.properties.created.default = Date.now;

  Note.handleChangeError = function(err) {
    console.warn('Cannot update change records for Note:', err);
  };
};
