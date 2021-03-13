module.exports = function (actionable, game, params) {

  var self = game.getPlayerByIdentifier(actionable.from);

  self.misc.haunted_jester_lynched = true;
  self.misc.haunted_jester_lynchers = params.votes;

  self.getPrivateChannel().send(":black_joker: You successfully got yourself lynched!");

  return true;

};
