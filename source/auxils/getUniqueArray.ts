export = <T>(array: T[]): T[] => {
	const ret: T[] = []

	for (let i = 0; i < array.length; i++) {
		if (!ret.includes(array[i])) {
			ret.push(array[i])
		}
	}
	return ret
}
