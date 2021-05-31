import cryptoRandom from "./cryptoRandom"

export default <T>(array: T[]): T => {
	const indices = array.length
	const index = Math.floor(cryptoRandom(indices * 3, indices) * indices)
	return array[index]
}
