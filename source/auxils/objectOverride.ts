const objectOverride = <T, S>(j1: T, j2: S): T & S => {
	// Scan through j1, replace
	const ret: Record<string, any> = Object.assign({}, j1)

	Object.entries(j2).forEach(([key, item]) => {
		// Addition
		if (!(j1 as Record<string, any>)[key]) {
			ret[key] = item
			return
		}

		// Substitution
		if (typeof item === "object" && !(Symbol.iterator in Object(item))) {
			ret[key] = objectOverride((j1 as Record<string, any>)[key], item)
			return
		} else {
			ret[key] = item
		}
	})

	return (ret as any) as T & S
}

export default objectOverride
