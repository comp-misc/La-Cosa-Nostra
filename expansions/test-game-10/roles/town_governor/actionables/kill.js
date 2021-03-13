var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var random = Math.random();

  var user = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var private_channel = user.getPrivateChannel();
  var target_channel = target.getPrivateChannel();
  var main_channel = game.getMainChannel();
  //var journal = game.getJournalChannel();

  rs.prototypes.unstoppableAttack.reason = "executed by the __Governor__";

  var outcome = rs.prototypes.unstoppableAttack(...arguments);

  private_channel.send(":exclamation: You executed **" + target.getDisplayName() + "**!");
  target_channel.send(":exclamation: You were executed!");
  main_channel.send(":crossed_swords: **" + target.getDisplayName() + "** was executed by the __Governor__.");
  //journal.send(":crossed_swords: **" + target.getDisplayName() + "** was executed by the _Governor_.")

  user.misc.executions--;

  var tvl = false
  if (game.config.game.lynch["top-voted-lynch"]) {
    var tvl = true;
    game.config.game.lynch["top-voted-lynch"] = false;
  };

  game.fastforward();

  if (tvl) {
    game.config.game.lynch["top-voted-lynch"] = true;
  };

  game.save();
  
  // Always return true for instant triggers to null the action
  return true;

};

module.exports.TAGS = ["visit", "day_action"];
