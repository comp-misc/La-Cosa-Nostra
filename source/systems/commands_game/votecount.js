var texts = require("../executable_misc/text/texts.js");
var format = require("../executable_misc/__formatter.js");
var alphabets = require("../alpha_table.js");

var auxils = require("./../auxils.js");

module.exports = async function (game, message, params) {

  var roles = game.players;
  var client = game.client;
  var config = game.config;

  if (!game.isDay()) {
    await message.channel.send(":x:  There is no trial during the night!");
    return null;
  };

  var no_lynch_option = game.config["game"]["lynch"]["no-lynch-option"];

  var guild = client.guilds.get(config["server-id"]);

  var sendable = texts.public_votecount;

  sendable = sendable.replace("{;day}", game.getPeriod()/2);
  sendable = sendable.replace("{;public_votes}", getVoteList());

  await message.channel.send(format(game, sendable));

  function getVoteList () {

    var displays = new Array();
    var players_voting = new Array();

    var players_alive = 0;

    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        players_alive++;
      };
    };

    if (players_alive % 2 == 1) {
      var lynch_votes = (players_alive + 1)/2;
    } else {
      var lynch_votes = (players_alive + 2)/2;
    };

    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {

        // Get display role

        // Get people voting against
        var voting_against = roles[i].votes;
        var concat = new Array();

        if (voting_against.length < 1) {
          continue;
        };

        // Get their display names
        for (var j = 0; j < voting_against.length; j++) {

          // Mapped by IDs
          var player = game.getPlayerByIdentifier(voting_against[j].identifier);
          
          players_voting.push(voting_against[j].identifier);

          concat.push(player.getDisplayName());


        };

        var names = auxils.pettyFormat(concat);

        names = voting_against.length > 0 ? ": " + names : "";

        displays.push("**" + roles[i].getDisplayName() + "** (" + roles[i].countVotes() + "/" + lynch_votes + ")" + names);
      };
    };

    if (no_lynch_option) {

      if (players_alive % 2 == 1) {
        var nolynch_votes = (players_alive + 1)/2;
      } else {
        var nolynch_votes = players_alive/2;
      };

      var voters = game.getNoLynchVoters();
      var vote_count = game.getNoLynchVoteCount();

      for (var j = 0; j < voters.length; j++) {
        players_voting.push(voters[j]);
      };

      var concat = voters.map(x => game.getPlayerByIdentifier(x).getDisplayName());

      var names = auxils.pettyFormat(concat);

      names = voters.length > 0 ? ": " + names : "";

      displays.push("**No-lynch** (" + vote_count + "/" + nolynch_votes + ")" + names);

    };

    var special_vote_types = game.getPeriodLog().special_vote_types;

    for (var i = 0; i < special_vote_types.length; i++) {

      var voters = special_vote_types[i].voters;
      var vote_count = game.getSpecialVoteCount(special_vote_types[i].identifier);

      for (var j = 0; j < voters.length; j++) {
        players_voting.push(voters[j]);
      };

      var names = auxils.pettyFormat(voters.map(x => game.getPlayerByIdentifier(x.identifier).getDisplayName()));

      names = voters.length > 0 ? ": " + names : "";

      displays.push("**" + special_vote_types[i].name + "** (" + vote_count + ")" + names);

    };

    var voters = [];

    for (var i = 0; i < roles.length; i++) {
      if (roles[i].status.alive) {
        if (!players_voting.includes(roles[i].identifier)) {
          voters.push(roles[i].identifier);
        };
      };
    };

    displays.push("\nNot voting (" + voters.length + "/" + players_alive + ")");

    return displays.join("\n");

  };

};

module.exports.ALLOW_PREGAME = false;
module.exports.ALLOW_GAME = true;
module.exports.ALLOW_POSTGAME = false;
