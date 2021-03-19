// I know I probably should have these
// stored as methods to the class;
// but I want to keep them separate
// because partial classes in JS suck

var auxils = require("../auxils.js")
var format = require("./__formatter.js")
var texts = require("./text/texts.js")

var pinMessage = require("./pinMessage.js")

var Discord = require("discord.js")

module.exports = async function (game) {
	var config = game.config

	var guild = game.client.guilds.get(config["server-id"])

	var log = guild.channels.find((x) => x.name === config["channels"]["log"])
	var main = guild.channels.find((x) => x.name === config["channels"]["main"])
	var post = guild.channels.find((x) => x.name === config["channels"]["whisper-log"])

	// Send the start message
	var attachment = auxils.getAssetAttachment("game-start.jpg")

	var intro = await main.send(format(game, config["messages"]["game-start"]))
	var banner = await main.send(undefined, attachment)

	var whisper_intro = await post.send(format(game, config["messages"]["whisper-log"]))

	var message = texts.opening
	message = message.replace("{;opening_quote}", getOpeningQuoteItalic(message))
	message = message.replace("{;day_or_night}", getDayOrNight())

	await log.send(format(game, message))

	var main_pinnable = await main.send(
		"**" +
			game.getFormattedDay() +
			"**    ~~                                                                                            ~~"
	)
	var post_pinnable = await post.send(
		"**" +
			game.getFormattedDay() +
			"**    ~~                                                                                            ~~"
	)

	if (game.period % 2 === 0) {
		await main.send(format(game, config["messages"]["daytime-quote"]))
	} else {
		await main.send(format(game, config["messages"]["nighttime-quote"]))
	}

	await pinMessage(intro)
	await pinMessage(whisper_intro)

	await pinMessage(main_pinnable)
	await pinMessage(post_pinnable)

	if (game.channels.mafia !== undefined) {
		var mafia_channel = game.getChannel("mafia")

		var mafia = game.exists((x) => x.role["see-mafia-chat"] === true && x.isAlive())

		if (mafia) {
			var mafia_pinnable = await mafia_channel.send(config["messages"]["mafia"])
			await pinMessage(mafia_pinnable)
		}
	}

	await game.postIntroMessages()

	function getOpeningQuoteItalic(message) {
		return message

		if (message[0] !== "*") {
			message = "*" + message
		}
		if (message[message.length - 1] !== "*") {
			message = message + "*"
		}

		for (var i = 0; i < 10; i++) {
			message = message.replace("\n\n", "*ÆØÅÆØÅ*")
		}

		for (var i = 0; i < 10; i++) {
			message = message.replace("\n", "*\n*")
		}

		for (var i = 0; i < 10; i++) {
			message = message.replace("ÆØÅ", "\n")
		}

		return message
	}

	function getDayOrNight() {
		if (game.getPeriod() % 2 == 0) {
			return "__daytime__.\n** **"
		} else {
			return "__night-time__."
		}
	}
}
