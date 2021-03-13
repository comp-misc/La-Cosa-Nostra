import fs from "fs"
import getLogger from "../../getLogger"
import botDirectories from "../../BotDirectories"

const data_directory = botDirectories.data

export = (): void => {
	const logger = getLogger()
	const directories = [data_directory, data_directory + "/game_cache", data_directory + "/game_cache/players"]
	directories.forEach((directory) => {
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory)
			logger.log(2, "[Routine] created cache directories.")
		}
	})
}
