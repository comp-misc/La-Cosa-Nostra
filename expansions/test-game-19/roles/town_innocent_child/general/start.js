module.exports = function (player) {

  var game = player.game;

  var main = game.getMainChannel();
  //var logbook = game.getLogbookChannel();

  //game.addIntroMessage(logbook.id, ":exclamation: **" + player.getDisplayName() + "** has been revealed to be a __Innocent Child__!");
  game.addIntroMessage(main.id, ":exclamation: **" + player.getDisplayName() + "** is an __Innocent Child__!");

  innocent_children = game.findAll(x => x.role_identifier === "town_innocent_child");

  for (var i = 0; i < innocent_children.length - 1; i++) {
    innocent_children[i].misc.intro_messages = true;
  };

  if (player.misc.intro_messages === true) {
    return true
  };

  president = game.findAll(x => x.role_identifier === "town_president");
  prime_minister = game.findAll(x => x.role_identifier === "town_prime_minister");
    
  for (var i = 0; i < president.length; i++) {
    game.addIntroMessage(main.id, ":exclamation: There is a President alive!");
  };

  for (var i = 0; i < prime_minister.length; i++) {
    game.addIntroMessage(main.id, ":exclamation: There is a Prime Minister alive!");
  };

};
