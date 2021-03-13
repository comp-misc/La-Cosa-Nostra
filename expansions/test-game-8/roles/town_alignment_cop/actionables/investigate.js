var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

var responses = {
  neutral: ":mag: Your target is __guilty__.",
  cult: ":mag: Your target is __guilty__.",
  mafia: ":mag: Your target is __guilty__.",
  town: ":mag: Your target is __not guilty__.",

  role: ":mag: Your target's role is **{;role}**."
}

module.exports = function (actionable, game, params) {

  game.execute("visit", {visitor: actionable.from,
    target: actionable.to,
    priority: actionable.priority,
    reason: "Cop-investigation"});

  var from = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  // Check roles
  var immunity = target.getStat("detection-immunity", Math.max);

  // Not immune
  if (immunity < 1) {

    if (target.role["reveal-role-on-interrogation"] === true) {
      var response = responses["role"].replace(new RegExp("{;role}", "g"), target.role["role-name"]);;
      game.addMessage(from, response);
    } else if (target.role_identifier === "miller") {
      var response = responses["mafia"];
      game.addMessage(from, response);
    } else {
      var response = responses[target.role.alignment];
      game.addMessage(from, response ? response : responses["town"]);
    };

  } else {
    // Show Town
    game.addMessage(from, responses["town"]);
  };

};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
