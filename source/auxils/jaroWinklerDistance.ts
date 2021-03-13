// /* JS implementation of the strcmp95 C function written by
// Bill Winkler, George McLaughlin, Matt Jaro and Maureen Lynch,
// released in 1994 (http://web.archive.org/web/20100227020019/http://www.census.gov/geo/msb/stand/strcmp.c).

// a and b should be strings. Always performs case-insensitive comparisons
// and always adjusts for long strings. */

// const jaroWinklerDistance = (a: string, b: string): number => {
// 	if (!a || !b) {
// 		return 0.0
// 	}

// 	a = a.trim().toUpperCase()
// 	b = b.trim().toUpperCase()
// 	const a_len = a.length
// 	const b_len = b.length
// 	const a_flag = []
// 	const b_flag = []
// 	const search_range = Math.floor(Math.max(a_len, b_len) / 2) - 1
// 	const minv = Math.min(a_len, b_len)

// 	// Looking only within the search range, count and flag the matched pairs.
// 	let Num_com = 0
// 	const yl1 = b_len - 1
// 	for (let i = 0; i < a_len; i++) {
// 		const lowlim = i >= search_range ? i - search_range : 0
// 		const hilim = i + search_range <= yl1 ? i + search_range : yl1
// 		for (let j = lowlim; j <= hilim; j++) {
// 			if (b_flag[j] !== 1 && a[j] === b[i]) {
// 				a_flag[j] = 1
// 				b_flag[i] = 1
// 				Num_com++
// 				break
// 			}
// 		}
// 	}

// 	// Return if no characters in common
// 	if (Num_com === 0) {
// 		return 0.0
// 	}

// 	// Count the number of transpositions
// 	let k = 0
// 	let N_trans = 0
// 	for (let i = 0; i < a_len; i++) {
// 		if (a_flag[i] === 1) {
// 			let j
// 			for (j = k; j < b_len; j++) {
// 				if (b_flag[j] === 1) {
// 					k = j + 1
// 					break
// 				}
// 			}
// 			if (a[i] !== b[j]) {
// 				N_trans++
// 			}
// 		}
// 	}
// 	N_trans = Math.floor(N_trans / 2)

// 	// Adjust for similarities in nonmatched characters
// 	let N_simi = 0
// 	const adjwt = adjustments
// 	if (minv > Num_com) {
// 		for (let i = 0; i < a_len; i++) {
// 			if (!a_flag[i]) {
// 				for (let j = 0; j < b_len; j++) {
// 					if (!b_flag[j]) {
// 						if (adjwt[a[i]] === b[j]) {
// 							N_simi += 3
// 							b_flag[j] = 2
// 							break
// 						}
// 					}
// 				}
// 			}
// 		}
// 	}

// 	const Num_sim = N_simi / 10.0 + Num_com

// 	// Main weight computation
// 	let weight = Num_sim / a_len + Num_sim / b_len + (Num_com - N_trans) / Num_com
// 	weight = weight / 3

// 	// Continue to boost the weight if the strings are similar
// 	if (weight > 0.7) {
// 		// Adjust for having up to the first 4 characters in common
// 		let j = minv >= 4 ? 4 : minv
// 		let i
// 		for (i = 0; i < j && a[i] === b[i]; i++) {}
// 		if (i) {
// 			weight += i * 0.1 * (1.0 - weight)
// 		}

// 		// Adjust for long strings.
// 		// After agreeing beginning chars, at least two more must agree
// 		// and the agreeing characters must be more than half of the
// 		// remaining characters.
// 		if (minv > 4 && Num_com > i + 1 && 2 * Num_com >= minv + i) {
// 			weight += (1 - weight) * ((Num_com - i - 1) / (a_len * b_len - i * 2 + 2))
// 		}
// 	}

// 	return weight
// }

// // The char adjustment table used above
// const adjustments: Record<string, string> = {
// 	A: "E",
// 	A: "I",
// 	A: "O",
// 	A: "U",
// 	B: "V",
// 	E: "I",
// 	E: "O",
// 	E: "U",
// 	I: "O",
// 	I: "U",
// 	O: "U",
// 	I: "Y",
// 	E: "Y",
// 	C: "G",
// 	E: "F",
// 	W: "U",
// 	W: "V",
// 	X: "K",
// 	S: "Z",
// 	X: "S",
// 	Q: "C",
// 	U: "V",
// 	M: "N",
// 	L: "I",
// 	Q: "O",
// 	P: "R",
// 	I: "J",
// 	2: "Z",
// 	5: "S",
// 	8: "B",
// 	1: "I",
// 	1: "L",
// 	0: "O",
// 	0: "Q",
// 	C: "K",
// 	G: "J",
// 	E: " ",
// 	Y: " ",
// 	S: " ",
// }

// export = jaroWinklerDistance

const jaroWinklerDistance = (s1: string, s2: string, caseSensitive = true): number => {
	let m = 0
	let i
	let j

	// Exit early if either are empty.
	if (s1.length === 0 || s2.length === 0) {
		return 0
	}

	// Convert to upper if case-sensitive is false.
	if (!caseSensitive) {
		s1 = s1.toUpperCase()
		s2 = s2.toUpperCase()
	}

	// Exit early if they're an exact match.
	if (s1 === s2) {
		return 1
	}

	const range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1
	const s1Matches = new Array(s1.length)
	const s2Matches = new Array(s2.length)

	for (i = 0; i < s1.length; i++) {
		const low = i >= range ? i - range : 0
		const high = i + range <= s2.length - 1 ? i + range : s2.length - 1

		for (j = low; j <= high; j++) {
			if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
				++m
				s1Matches[i] = s2Matches[j] = true
				break
			}
		}
	}

	// Exit early if no matches were found.
	if (m === 0) {
		return 0
	}

	// Count the transpositions.
	let k = 0
	let numTrans = 0

	for (i = 0; i < s1.length; i++) {
		if (s1Matches[i] === true) {
			for (j = k; j < s2.length; j++) {
				if (s2Matches[j] === true) {
					k = j + 1
					break
				}
			}

			if (s1[i] !== s2[j]) {
				++numTrans
			}
		}
	}

	let weight = (m / s1.length + m / s2.length + (m - numTrans / 2) / m) / 3
	let l = 0
	const p = 0.1

	if (weight > 0.7) {
		while (s1[l] === s2[l] && l < 4) {
			++l
		}

		weight = weight + l * p * (1 - weight)
	}
	return weight
}

export = jaroWinklerDistance
