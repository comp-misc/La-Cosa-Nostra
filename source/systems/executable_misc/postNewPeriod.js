var texts = require("./text/texts.js");
var format = require("./__formatter.js");

var pinMessage = require("./pinMessage.js");

module.exports = async function (game, broadcast) {
  // Post periodic log

  var config = game.config;
  var guild = game.client.guilds.get(config["server-id"]);

  var log = guild.channels.find(x => x.name === config["channels"]["log"]);
  var main = guild.channels.find(x => x.name === config["channels"]["main"]);
  var post = guild.channels.find(x => x.name === config["channels"]["whisper-log"]);

  if (broadcast === undefined) {
    if ((game.getPeriod() - 1) % 2 == 1) {
      broadcast = "> {#no-summary}";
    } else {
      broadcast = "> {#no-summary-day}";
    }
  };

  var sendable = texts.new_period;
  
  sendable = sendable.replace("{;game_chronos}", getDayNightTime());
  sendable = sendable.replace("{;short_quote}", getDayNightQuote());
  sendable = sendable.replace(new RegExp("{;summary}", "g"), broadcast);
  sendable = sendable.replace("{;alive_tag}", getAliveTag());

  log.send(format(game, sendable));

  var main_pinnable = await main.send("**" + game.getFormattedDay() + "**    ~~                                                                                            ~~");
  var post_pinnable = await post.send("**" + game.getFormattedDay() + "**    ~~                                                                                            ~~");

  await pinMessage(main_pinnable);
  await pinMessage(post_pinnable);

  if (game.getPeriod() % 2 === 0) {
    await main.send(format(game, game.config["messages"]["daytime-quote"]));
  } else {
    await main.send(format(game, game.config["messages"]["nighttime-quote"]));
  };

  function getDayNightTime() {
    if ((game.period - 1) % 2 === 0) {
      return "Day " + ((game.getPeriod() - 1) / 2);
    } else {
      return "Night " + (game.getPeriod() / 2);
    };
  };

  //Day 0 conclusion: 1
  //Night 1 conclusion: 2
  //Day 1 conclusion: 3
  //Night 2 conclusion: 4
  //Day 2 conclusion: 5
  //Night 3 conclusion: 6
  //Day 3 conclusion: 7

  function getDayNightQuote() {
    if (game.getPeriod() % 2 === 0) {
      return "*As the sun is rising over the horizon the town uncovers the events of the night.*"
    } else {
      return "*After an eventful day and some consideration, the town finally comes to a conclusion.*"
    };
  };

  function getAliveTag () {

    if (game.getPeriod() % 2 === 1) {
      return "\nIt is now __night-time__.\n\n{@alive}";
    } else {
      return "** **";
    }
  };

};
