export default (object: Record<string, string>): Record<string, string> => {
	const entries = Object.entries(object)
	const ret: Record<string, string> = {}

	for (let i = 0; i < entries.length; i++) {
		ret[entries[i][1]] = entries[i][0]
	}
	return ret
}
