module.exports = function (message, params, config) {
	var responses = [
		"It is certain.",
		"It is decidedly so.",
		"Without a doubt.",
		"Yes - definitely.",
		"You may rely on it.",
		"As I see it, yes.",
		"Most likely.",
		"Outlook good.",
		"Yes.",
		"Signs point to yes.",
		"Reply hazy, try again.",
		"Ask again later.",
		"Better not tell you now.",
		"Cannot predict now.",
		"Concentrate and ask again.",
		"Don't count on it.",
		"My reply is no.",
		"My sources say no.",
		"Outlook not so good.",
		"Very doubtful.",
	]

	// I don't even care about the question lol
	if (params.length < 1) {
		message.channel.send(":x: Wrong syntax! Please use `" + config["command-prefix"] + "8ball <question>` instead!")
		return null
	}

	message.channel.send(":8ball: " + responses[Math.floor(Math.random() * responses.length)])

	// Get random index
}
