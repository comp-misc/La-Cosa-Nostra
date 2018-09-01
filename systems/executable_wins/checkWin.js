var conditions = require("../win_conditions.js");

module.exports = function (game) {

  var players = game.players;

  var win_conditions = new Array();

  for (var i = 0; i < game.players.length; i++) {

    if (win_conditions.includes(game.players[i].role["win-condition"])) {
      continue;
    };

    if (!game.players[i].role["win-condition"]) {
      var err = new Error("Every role should have a win condition!");
      throw err;
    };

    win_conditions.push(game.players[i].role["win-condition"]);

  };

  // Sort by alphabetical order
  win_conditions.sort();

  // Boolean that is changed if game is to be ended
  var end_game = false;

  // Execute the win conditions
  for (var i = 0; i < win_conditions.length; i++) {
    var condition = conditions[win_conditions[i]];

    if (typeof condition !== "function") {
      var err = new Error(win_conditions[i] + " is not a valid win condition!");
      throw err;
    };

    // Check all the nitty gritty configurations of the condition

    var eliminated = true;
    for (var j = 0; j < (condition.ELIMINATED || new Array()).length; j++) {
      // Check if all dead
      var query = condition.ELIMINATED[j];

      var out = roleCheck(query);

      if (out) {
        eliminated = false;
        break;
      };

    };

    var surviving = false;
    for (var j = 0; j < (condition.SURVIVING || new Array()).length; j++) {
      // Check if all dead
      var query = condition.SURVIVING[j];

      var out = roleCheck(query);

      if (out) {
        surviving = true;
        break;
      };

    };

    if (eliminated && surviving) {
      // Run the condition
      var response = condition(game);

      // Winners would already have been declared
      // by condition function

      if (response && condition.STOP_GAME) {
        // Game has ended
        end_game = true;
      };

      if (response && condition.STOP_CHECKS) {
        // Equivalent to sole winner
        // However can be used otherwise
        break;
      };

    };

  };

  if (end_game) {
    // Kill the game
    game.endGame();
  };

  function roleCheck (condition) {

    if (typeof condition === "function") {
      // Check
      return game.exists(condition);
    } else if (typeof condition === "string") {

      condition = condition.toLowerCase();

      // Check separately
      var cond1 = game.exists(x => x.isAlive() && x.role_identifier === condition);
      var cond2 = game.exists(x => x.isAlive() && x.role.alignment === condition);
      var cond3 = game.exists(x => x.isAlive() && x.role.class === condition);

      var cond4 = false;

      if (condition.includes("-")) {
        condition = condition.split("-");
        var cond4 = game.exists(x => x.isAlive() && x.role.alignment === condition[0] && x.role.class === condition[1]);
      };

      return cond1 || cond2 || cond3 || cond4;

    } else {
      return null;
    };

  };

};