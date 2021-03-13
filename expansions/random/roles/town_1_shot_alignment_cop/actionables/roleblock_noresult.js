var lcn = require("../../../../../source/lcn.js");

module.exports = function (actionable, game, params) {

  var player = game.getPlayerByIdentifier(actionable.from);

  // Check if exists
  var investigating = game.actions.exists(x => x.from === player.identifier && x.identifier === "town_1_shot_alignment_cop/investigate");
  var previously_roleblocked = player.getStatus("roleblocked");

  if (investigating && !previously_roleblocked) {
    game.addMessage(player, ":no_entry_sign:  Your action was blocked and you got no result. Your action was not consumed.");
  };

};
