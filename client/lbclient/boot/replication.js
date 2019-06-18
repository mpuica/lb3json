module.exports = function(client) {
  var LocalNote = client.models.LocalNote;
  var RemoteNote = client.models.RemoteNote;

  var since = { push: -1, pull: -1 };

  function sync(cb) {
    LocalNote.replicate(
      since.push,
      RemoteNote,
      function pushed(err, conflicts, cps) {
        since.push = cps;
        RemoteNote.replicate(
          since.pull,
          LocalNote,
          function pulled(err, conflicts, cps) {
            since.pull = cps;
            if (cb) cb();
          });
      });
  }

  LocalNote.observe('after save', function(ctx, next) {
    next();
    sync(); // in background
  });

  LocalNote.observe('after delete', function(ctx, next) {
    next();
    sync(); // in background
  });

  client.sync = sync;

  function handleConflicts(conflicts) {
    // TODO notify user about the conflicts
  }
};
