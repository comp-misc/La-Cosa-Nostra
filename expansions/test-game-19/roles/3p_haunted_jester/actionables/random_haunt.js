var lcn = require("../../../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = function (actionable, game, params) {

  var haunted_jester = game.getPlayerByIdentifier(actionable.from);

  // Lynched player may be dead, so a check is necessary
  var targets = new Array();

  for (var i = 0; i < haunted_jester.misc.haunted_jester_lynchers.length; i++) {
    var lyncher = game.getPlayerByIdentifier(haunted_jester.misc.haunted_jester_lynchers[i].identifier);

    if (lyncher.isAlive()) {
      targets.push(lyncher);
    };
  };

  if (targets.length < 1) {
    game.addMessage(haunted_jester, ":exclamation: Nobody who lynched you could be haunted!");
    return null;
  };

  var target = auxils.choice(targets);

  game.addMessage(haunted_jester, ":exclamation: You did not pick a target! As a result, **" + target.getDisplayName() + "** has been selected at random to be haunted!");

  // Revert back to original haunt
  game.addAction("3p_haunted_jester/haunt", ["cycle"], {
    name: "Jester-haunt",
    expiry: 1,
    from: actionable.from,
    to: target.identifier
  });

  return true;

};
