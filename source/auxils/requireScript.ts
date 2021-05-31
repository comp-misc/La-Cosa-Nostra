/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

//TODO This should probably be async
const requireScript = <T>(path: string, allowDefaultExport = true): T => {
	const value = require(path)
	if (allowDefaultExport && "default" in value) {
		return (value as Record<string, unknown>).default as T
	}
	return value as T
}

export default requireScript
