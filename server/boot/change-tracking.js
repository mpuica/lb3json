
'use strict';

module.exports = function(server) {
  var Note = server.models.Note;
  server.model(Note.getChangeModel());
};
