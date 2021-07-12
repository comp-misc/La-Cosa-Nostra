export default <T>(array: T[]): T[] => {
	const ret: T[] = []

	for (let i = 0; i < array.length; i++) {
		if (!ret.includes(array[i])) {
			ret.push(array[i])
		}
	}
	return ret
}

export const getUniqueBy = <T, R>(array: T[], uniqueBy: (item: T) => R): T[] => {
	const unique = new Set<R>()
	const result: T[] = []
	for (const item of array) {
		const key = uniqueBy(item)
		if (!unique.has(key)) {
			unique.add(key)
			result.push(item)
		}
	}
	return result
}
