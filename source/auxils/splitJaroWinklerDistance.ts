import jaroWinklerDistance from "./jaroWinklerDistance"

export default (a: string, b: string): number => {
	a = a.toLowerCase()
	b = b.toLowerCase()

	// Split Jaro-Winkler
	const a_split = a.split(" ")
	const b_split = b.split(" ")

	let ret = 0

	for (let i = 0; i < a_split.length; i++) {
		for (let j = 0; j < b_split.length; j++) {
			const distance = jaroWinklerDistance(a_split[i], b_split[j])
			ret = Math.max(ret, distance)
		}
	}

	return ret
}
