var texts = require("./text/texts.js");
var format = require("./__formatter.js");
var alphabets = require("../alpha_table.js");

var auxils = require("./../auxils.js");

module.exports = async function (game) {

  if (game.getPeriod() == 1) {
    return null;
  };

  var roles = game.players;
  var client = game.client;
  var config = game.config;

  var no_lynch_option = game.config["game"]["lynch"]["no-lynch-option"];

  var guild = client.guilds.get(config["server-id"]);
  var vote = guild.channels.find(x => x.name === config["channels"]["voting"]);

  var message = texts.public_vote;

  message = message.replace("{;day}", game.getPeriod()/2);
  message = message.replace("{;vote_info}", getVoteInfo());
  message = message.replace("{;public_votes}", getVoteList());

  message = await vote.send(format(game, message));

  var messages = [message];

  game.save();

  return messages;

  function getVoteList () {

    var players_alive = 0;
    var players_voting = new Array();

    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        players_alive++;
      };
    };

    if (players_alive % 2 == 1) {
      var lynch_votes = (players_alive + 1)/2
      var nolynch_votes = (players_alive + 1)/2
    } else {
      var lynch_votes = (players_alive + 2)/2
      var nolynch_votes = players_alive/2
    };

    var displays = new Array();
    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        // Get display role

        if (roles[i].getStatus("lynch-proof")) {
          displays.push("<@" + roles[i].id + "> (\\✖)");
          continue;
        };

        // Get people voting against
        var voting_against = roles[i].votes;
        var concat = new Array();

        // Get their display names
        for (var j = 0; j < voting_against.length; j++) {

          // Mapped by IDs
          var player = game.getPlayerByIdentifier(voting_against[j].identifier);

          players_voting.push(player)

          concat.push(player.getDisplayName());

        };

        var names = auxils.pettyFormat(concat);

        names = voting_against.length > 0 ? ": " + names : "";

        displays.push("<@" + roles[i].id + "> (" + roles[i].countVotes() + "/" + lynch_votes + ")" + names);
      };
    };

    if (no_lynch_option) {

      var voters = game.getNoLynchVoters();
      var vote_count = game.getNoLynchVoteCount();

      players_voting.push(voters.map(x => game.getPlayerByIdentifier(x)))

      var concat = voters.map(x => game.getPlayerByIdentifier(x).getDisplayName());

      var names = auxils.pettyFormat(concat);

      names = voters.length > 0 ? ": " + names : "";

      displays.push("No-lynch (" + vote_count + "/" + nolynch_votes + ")" + names);

    };

    var special_vote_types = game.getPeriodLog().special_vote_types;

    for (var i = 0; i < special_vote_types.length; i++) {

      var voters = special_vote_types[i].voters;
      var vote_count = game.getSpecialVoteCount(special_vote_types[i].identifier);

      players_voting.push(special_vote_types[i].identifier)

      var names = auxils.pettyFormat(voters.map(x => game.getPlayerByIdentifier(x.identifier).getDisplayName()));

      names = voters.length > 0 ? ": " + names : "";

      displays.push("**" + special_vote_types[i].name + "** (" + vote_count + ")" + names);

    };

    var voters = [];

    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        if (!players_voting.includes(roles[i])) {
          voters.push(roles[i].identifier)
        };
      };
    };

    displays.push("\nNot voting (" + voters.length + "/" + players_alive + ")");

    return displays.join("\n");

  };

  function getVoteInfo() {

    var players_alive = 0;

    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        players_alive++;
      };
    };

    if (players_alive % 2 == 1) {
      var lynch_votes = (players_alive + 1)/2
      var nolynch_votes = (players_alive + 1)/2
    } else {
      var lynch_votes = (players_alive + 2)/2
      var nolynch_votes = players_alive/2
    };
    return "There are required **" + lynch_votes + "** votes to lynch, and **" + nolynch_votes + "** votes to no-lynch."
  };
};
