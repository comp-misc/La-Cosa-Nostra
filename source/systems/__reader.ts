import fs from "fs"

const __reader = (
	prefix: string,
	directory = __dirname,
	extensions = [".js", ".ts"]
): Record<string, Record<string, string>> | null => {
	if (!fs.existsSync(directory)) {
		return null
	}

	if (!fs.lstatSync(directory).isDirectory()) {
		return null
	}

	const folders = fs.readdirSync(directory)
	const ret: Record<string, Record<string, string>> = {}

	// Get parent systems directory
	for (let i = 0; i < folders.length; i++) {
		const entry = directory + "/" + folders[i]
		const folder_name_length = folders[i].length

		if (fs.lstatSync(entry).isDirectory() && folders[i].startsWith(prefix)) {
			const parent: Record<string, string> = {}

			const files = fs.readdirSync(entry)

			for (let j = 0; j < files.length; j++) {
				for (const extension of extensions) {
					if (files[j].endsWith(extension)) {
						// Append to parent object
						const file_name_length = files[j].length
						parent[files[j].substring(0, file_name_length - extension.length)] = require(entry + "/" + files[j])
					}
				}
			}

			ret[folders[i].substring(prefix.length, folder_name_length)] = parent
		}
	}

	return ret
}

export = __reader
