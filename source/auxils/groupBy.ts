const groupBy = <T>(items: T[], keySelector: (item: T) => string): Record<string, T[]> => {
	const result: Record<string, T[]> = {}
	for (const item of items) {
		const key = keySelector(item)
		if (key in result) {
			result[key].push(item)
		} else {
			result[key] = [item]
		}
	}
	return result
}

export default groupBy
