// Format arrays into gramatically correct ones

export default (array: string[]): string => {
	// Clone array
	const cloned = Array.from(array)

	if (cloned.length > 1) {
		cloned[cloned.length - 1] = "or " + cloned[cloned.length - 1]
	}

	return cloned.join(", ")
}
