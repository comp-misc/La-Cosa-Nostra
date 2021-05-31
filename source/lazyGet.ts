const lazyGet = <T>(getValue: () => T): (() => T) => {
	let result: T | undefined = undefined
	let hasLoaded = false

	return () => {
		if (hasLoaded) {
			return result as T
		}
		result = getValue()
		hasLoaded = true
		return result
	}
}

export default lazyGet
