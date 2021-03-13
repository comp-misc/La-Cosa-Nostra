var mafia = require("../../../../../source/lcn.js")

var rs = mafia.rolesystem;

module.exports = function (actionable, game, params) {

  var poisoned = game.getPlayerByIdentifier(actionable.to);
  var poisoner = game.getPlayerByIdentifier(actionable.from);

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Apothecarist-poison"});

  game.addAction("town_poisoner/poison_kill", ["cycle"], {
    name: "Poison-kill",
    expiry: 3,
    execution: 3,
    from: actionable.from,
    to: actionable.to,
    attack: actionable.target,
    priority: 4,
    tags: ["poison"]
  });

  game.addMessage(poisoned, ":exclamation: You were poisoned last night! You will die from the poison if you are not cured before tomorrow.");

  poisoner.misc.apothecarist_poisons_left--;

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
