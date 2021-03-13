import crypto from "crypto"

export = (bytes = 24, extend = 6): number => {
	if (extend > bytes) {
		throw new Error("Extend cannot be more than bytes!")
	}

	if (bytes % extend !== 0) {
		throw new Error("The bytes should be integer-wise divisible by the extend to prevent bias!")
	}

	// Byte possibilities = 256 * extend
	const buffer = crypto.randomBytes(bytes)

	let numeral = 0
	for (let i = 0; i < buffer.length; i++) {
		numeral += buffer[i]
	}

	const limit = 256 / extend
	return (numeral % limit) / limit
}
