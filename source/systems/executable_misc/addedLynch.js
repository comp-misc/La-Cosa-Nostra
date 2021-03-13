var texts = require("./text/texts.js");
var format = require("./__formatter.js");

module.exports = async function (game, voter, voted) {

  var message = texts.lynching;

  message = message.replace(new RegExp("{;voter}", "g"), voter.getDisplayName());
  message = message.replace(new RegExp("{;voted}", "g"), voted.getDisplayName());
  message = message.replace(new RegExp("{;votes}", "g"), getVotesOnPlayer(voted));
  message = message.replace(new RegExp("{;hammer_alert}", "g"), hammerAlert(voted));

  await game.getMainChannel().send(message);

  function getVotesOnPlayer (player) {

    var votes = player.countVotes();

    if (votes == 1) {
      return "__1__ vote";
    } else {
      return "__" + votes + "__ votes";
    };
  };

  function hammerAlert (player) {

    var players_alive = 0;

    for (var i = 0; i < game.players.length; i++) {
      if (game.players[i].status.alive) {
  
        players_alive++;
      };
    };

    if (players_alive % 2 == 1) {
      var hammer_votes = (players_alive + 1)/2
    } else {
      var hammer_votes = (players_alive + 2)/2
    };
      
    var votes = player.countVotes();

    if (hammer_votes - votes == 1) {
      return "\n\n:bell:  There is __1__ more vote required for an instant lynch!"
    };
    if ((hammer_votes - votes == 2) && (votes > 5)) {
      return "\n\n:bell:  There are __2__ more votes required for an instant lynch!";
    };
    return "";
  };
}
