import Logger from "./systems/game_templates/Logger"
import directories from "./BotDirectories"
import lcn from "./lcn"
import { InitScript } from "./Expansion"
import version from "./Version"

export = (): [Logger, typeof lcn] => {
	// Create logger
	const log_directory = directories.log

	const logger = new Logger(log_directory + "/log.txt")
	;(process as any).logger = logger

	process.on("unhandledRejection", function (error) {
		logger.log(4, "Unhandled promise rejection.")
		logger.logError(error)
	})

	process.on("uncaughtException", function (error) {
		logger.log(4, "Uncaught fatal exception, terminating to prevent corruption.")
		logger.logError(error)

		process.exit()
	})

	const { config, expansions } = lcn

	logger.setLogLevel(config["console-log-level"], config["file-log-level"])

	expansions
		.map((expansion) => expansion.scripts.init)
		.filter((initScript) => initScript && typeof initScript === "function")
		.forEach((init) => (init as InitScript)(lcn, version))

	return [logger, lcn]
}
