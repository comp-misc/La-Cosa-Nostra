import attemptRequiring from "./attemptRequiring"

const attemptRequiringScript = <T>(
	directory: string,
	scriptName: string,
	fileExtensions = ["js", "ts"]
): T | undefined => {
	for (const extension in fileExtensions) {
		const result = attemptRequiring<T>(`${directory}/${scriptName}.${extension}`)
		if (result !== undefined) {
			return result
		}
	}
	return undefined
}

export = attemptRequiringScript
