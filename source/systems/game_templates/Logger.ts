import fs, { WriteStream } from "fs"

class Logger {
	private console_threshold: number
	private file_threshold: number
	private stream: WriteStream

	constructor(file: string = __dirname + "/log.txt", console_threshold = 0, file_threshold = 0) {
		this.console_threshold = console_threshold
		this.file_threshold = file_threshold

		if (!fs.existsSync(file)) {
			fs.writeFileSync(
				file,
				"█▀▀ █▀▀█ █░█   █▀▀█ █▀▀   ░░▀ █▀▀█ █▀▀█ █▀▀█ ░▀░ █░░█ █▀▄▀█\n█▀▀ █░░█ ▄▀▄   █░░█ █▀▀   ░░█ █░░█ █▄▄█ █░░█ ▀█▀ █░░█ █░▀░█\n▀░░ ▀▀▀▀ ▀░▀   ▀▀▀▀ ▀░░   █▄█ ▀▀▀▀ ▀░░▀ ▀▀▀█ ▀▀▀ ░▀▀▀ ▀░░░▀\n\n[Log entry created " +
					new Date().toUTCString() +
					"]"
			)
		}
		this.stream = fs.createWriteStream(file, {
			encoding: "utf-8",
		})
	}

	log(log_level: number, message: string, ...args: string[]): void {
		if (!message) {
			return
		}

		if (typeof message === "string") {
			args.forEach((arg) => {
				message = message.replace("%s", arg)
			})
		}

		if (log_level >= this.console_threshold) {
			console.log(message)
		}

		if (log_level >= this.file_threshold) {
			if (typeof message === "string") {
				// eslint-disable-next-line no-control-regex
				message = message.replace(/\x1b\[[0-9]+m/g, "")
			}

			this.stream.write(`[${new Date().toUTCString()}; ${log_level}] ${message}\n`, console.error)
		}
	}

	logError(error: Error | string | unknown): void {
		console.error(error)
		if (error instanceof Error) {
			const message = "[Error handled by catcher]\n1. Message: %s\n2. Stack: %s\n[End of error log]"

			this.log(4, message, error.message, error.stack?.toString() || "")
		} else {
			this.log(4, `[Error handled by catcher]: ${error}`)
		}
	}

	setLogLevel(console_log_level: number, file_log_level: number): void {
		this.console_threshold = console_log_level
		this.file_threshold = file_log_level
	}
}

export = Logger
