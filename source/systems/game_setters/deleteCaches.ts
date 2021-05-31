// Unlinks the ENTIRE cache file

import fs from "fs"
import dirs from "../../BotDirectories"
import getLogger from "../../getLogger"

const data_directory = dirs.data

export default (): void => {
	const logger = getLogger()
	/* The cache is actually not "deleted", but renamed.*/
	const current_time = new Date()

	if (!fs.existsSync(data_directory)) {
		logger.log(2, "[Routine] Made Data directory because it didn't exist.")
		fs.mkdirSync(data_directory)
	}

	const archive = data_directory + "/archive/"

	if (!fs.existsSync(archive)) {
		logger.log(2, "[Routine] Made Archive directory because it didn't exist.")
		fs.mkdirSync(archive)
	}

	if (fs.existsSync(data_directory + "/game_cache")) {
		fs.renameSync(data_directory + "/game_cache", `${archive}/game_cache_${current_time.getTime()}`)
		logger.log(2, "Archived all caches.")
	}
}
