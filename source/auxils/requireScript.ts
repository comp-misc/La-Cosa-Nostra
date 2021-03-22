const requireScript = <T>(path: string, allowDefaultExport = true): T => {
	const value = require(path)
	if (allowDefaultExport && (value as any).default !== undefined) {
		return (value as any).default as T
	}
	return value as T
}

export default requireScript
