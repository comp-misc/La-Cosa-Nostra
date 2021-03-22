import fs from "fs"
import requireScript from "./requireScript"

const attemptRequiringScript = <T>(
	directory: string,
	scriptName: string,
	fileExtensions = ["js", "ts"],
	allowDefaultImport = true
): T | undefined => {
	for (const extension of fileExtensions) {
		const fileName = `${directory}/${scriptName}.${extension}`
		if (fs.existsSync(fileName)) {
			return requireScript(fileName, allowDefaultImport)
		}
	}
	return undefined
}

export = attemptRequiringScript
