import fs from "fs"

const attemptRequiring = <T>(filePath: string): T | undefined => {
	if (!fs.existsSync(filePath)) {
		return undefined
	}
	const result = require(filePath) as T

	//Compatability with export default
	if ((result as any).default) {
		return (result as any).default as T
	}
	return result
}
export = attemptRequiring
