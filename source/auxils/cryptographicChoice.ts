import cryptoRandom from "./cryptoRandom"

export = <T>(array: T[]): T => {
	const indices = array.length
	const index = Math.floor(cryptoRandom(indices * 3, indices * 1) * indices)
	return array[index]
}
