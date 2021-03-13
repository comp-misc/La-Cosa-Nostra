import splitJaroWinklerDistance from "./splitJaroWinklerDistance"
import levenshteinDistance from "./levenshteinDistance"

export = (a: string, b: string, beta_1 = 0.8, beta_2 = 0.2, alpha = 1.0): number => {
	if (beta_1 + beta_2 !== 1) {
		throw new Error("Beta1 + beta2 should equal 1")
	}

	// Split Jaro-Winkler
	const jw_dist = splitJaroWinklerDistance(a, b)

	// Hybrid of Jaro Winkler and modified Levenshtein
	a = a.toLowerCase()
	b = b.toLowerCase()

	const lev_dist = levenshteinDistance(a, b)

	let lev_metric = lev_dist / b.length
	lev_metric = Math.max(0, -Math.abs(lev_metric) + 1)

	return (jw_dist * beta_1 + lev_metric * beta_2) * alpha
}
