interface BotDirectories {
	log: string
	data: string
}

const directories: BotDirectories = {
	log: __dirname + "/../",
	data: __dirname + "/../data/",
}

export = directories
