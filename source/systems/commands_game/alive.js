var Discord = require("discord.js");

var lcn = require("../../../source/lcn.js");

var auxils = lcn.auxils;

module.exports = async function (game, message, params) {

    var roles = game.players;

    var players_alive = 0;
    var display_message = "";

    for (var i = 0; i < roles.length; i++) {
        if (roles[i].status.alive) {

            players_alive++;
            display_message = display_message + roles[i].getDisplayName() + ", ";
        };
    };

    if (players_alive < 1) {

        message.channel.send("There are __0__ players alive!");

    } else {
        if (players_alive==1) {
            var grammar = "is"
        } else {
            var grammar = "are"
        };
        message.channel.send( "There " + grammar + " __" + players_alive + "__ player" + auxils.vocab("s", players_alive) + " alive:\n```" + display_message.substring(0, display_message.length - 2) + "```");
    };
};

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;