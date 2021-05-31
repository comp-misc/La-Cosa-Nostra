/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs"

const attemptRequiring = <T>(filePath: string): T | undefined => {
	if (!fs.existsSync(filePath)) {
		return undefined
	}
	const result = require(filePath) as T

	//Compatability with export default
	if ("default" in result) {
		return (result as Record<string, unknown>).default as T
	}
	return result
}
export default attemptRequiring
