var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem;

module.exports = function (actionable, game, params) {

  var target = game.getPlayerByIdentifier(actionable.from);
  target.clearDisplayRole();

};
