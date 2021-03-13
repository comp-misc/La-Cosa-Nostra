interface BotDirectories {
	log: string
	data: string
	expansions: string[]
}

const directories: BotDirectories = {
	log: __dirname + "/../",
	data: __dirname + "/../data/",
	expansions: [`${__dirname}/../expansions/`],
}

export = directories
