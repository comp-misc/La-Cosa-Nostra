var lcn = require("../../../../../source/lcn.js")

var rs = lcn.rolesystem;

module.exports = function (actionable, game, params) {

  var random = Math.random();

  var shooter = game.getPlayerByIdentifier(actionable.from);
  var target = game.getPlayerByIdentifier(actionable.to);

  var private_channel = shooter.getPrivateChannel();
  var target_channel = target.getPrivateChannel();
  var main_channel = game.getMainChannel();

  rs.prototypes.powerfulAttack.reason = "shot by a __Dayshooter__";

  var outcome = rs.prototypes.powerfulAttack(...arguments);

  if (!outcome) {

    private_channel.send(":exclamation: Your target was not killed!");
    main_channel.send(":exclamation: A shot was fired!");

  } else {

    private_channel.send(":exclamation: Your target was killed!");
    target_channel.send(":exclamation: You were shot!");
    main_channel.send(":exclamation: A shot was fired!\n\nThe body of **" + target.getDisplayName() + "** falls on the ground.");

    //target.setDisplayRole("Hidden");

    //game.addAction("town_even_day_dayshooter/reveal_role", ["cycle"], {
    //  name: "Dayshooter-reveal",
    //  expiry: 1,
    //  from: target,
    //  to: target
    //});

  };

  game.save();

  // Always return true for instant triggers to null the action
  return true;

};

module.exports.TAGS = ["visit", "day_action"];
