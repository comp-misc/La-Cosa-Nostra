var format = require("./__formatter.js");
var texts = require("./text/texts.js");
var auxils = require("../auxils.js");

module.exports = async function (game, faction, description) {

  var message = texts.prime;

  var config = game.config;

  message = message.replace("{;setup_name}", SetupName())
  message = message.replace("{;settings}", getSetupSettings())
  message = message.replace(new RegExp("{;current_utc_formatted}", "g"), auxils.formatUTCDate(new Date()))

  var players = game.players;
  var concat = new Array();

  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    var display_name = player.getDisplayName();
    var text = "**" + display_name + "**";

    concat.push(text);
  };

  message = message.replace(new RegExp("{;players}", "g"), concat.join("\n"));

  await game.getLogChannel().send(format(game, message));

  function SetupName () {
    var message = (format(game, config["messages"]["name"]));

    return message;
  }

  function getSetupSettings() {
    var message = "**Game Settings**\nDay lengths: " + game.config["time"]["day"] + " hours\nNight lengths: " + game.config["time"]["night"] + " hours\n\nThe game starts with __"
    
    if (game.config["game"]["day-zero"]) {
      message = message + "daytime__.\n\n"
    } else {
      message = message + "night-time__.\n\n"
    };

    if (game.config["game"]["last-wills"]["allow"] || game.config["game"]["whispers"]["allow"]) {
      if (!game.config["game"]["last-wills"]["allow"]) {
        message = message + "__Last wills__ are on.\n\n**Lynch Settings**\nCondition: \n\n"
      } else {
        if (!game.config["game"]["whispers"]["allow"]) {
          message = message + "__Whispers__ are on.\n\n**Lynch Settings**\nCondition: \n\n"
        } else {
          message = message + "__Last wills__ and __whispers__ are on.\n\n**Lynch Settings**\nCondition: \n\n"
        };
      };
    } else {
      message = message + "**Lynch Settings**\nCondition: "
    }

    if (game.config["game"]["lynch"]["top-voted-lynch"]) {

      message = message + "__top-voted-lynch__"

      if (game.config["game"]["lynch"]["top-voted-lynch-minimum-votes"] > 1) {
        message = message + " (minimum " + game.config["game"]["lynch"]["top-voted-lynch-minimum-votes"] + " votes required)"
      };
    } else {
      message = message + "__majority-vote__"
    };
    
    if (game.config["game"]["lynch"]["allow-hammer"]) {
      message = message + "\nHammer on: true"
    } else {
      message = message + "\nHammer on: false"
    };

    if (game.config["game"]["lynch"]["tied-random"]) {
      message = message + "\nTied vote: randomly determined"
    } else {
      message = message + "\nTied-vote: no-lynch"
    };
 
    return message

  };

};
