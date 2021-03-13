var lcn = require("../../../../../source/lcn.js");

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  game.execute("visit", {
    name: "Town-Jailkeeper-visit",
    from: actionable.from,
    target: actionable.to,
    priority: actionable.priority
  });

  game.addAction("town_odd_night_jailkeeper/roleblock", ["cycle"], {
    name: "Roleblocker-roleblock",
    expiry: 1,
    from: actionable.from,
    to: actionable.to
  });

  game.addAction("town_odd_night_jailkeeper/protect", ["cycle"], {
    name: "Doc-protect",
    expiry: 1,
    from: actionable.from,
    to: actionable.to
  });



};

module.exports.TAGS = ["drivable", "roleblockable", "visit"];
