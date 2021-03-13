import factorial from "./factorial"
import permutations from "./permutations"

export = (n: number, r: number): number =>
	// n choose r
	(permutations(n, r) * 1) / factorial(r)
