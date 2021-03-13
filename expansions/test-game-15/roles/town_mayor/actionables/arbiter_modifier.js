module.exports = function (actionable, game, params) {

  var from = game.getPlayerByIdentifier(actionable.from);

  if (game.arbiter_god_alive) {
    return null;
  };

  from.setPermanentStat("vote-magnitude", 2, "set");

  return true;

};
