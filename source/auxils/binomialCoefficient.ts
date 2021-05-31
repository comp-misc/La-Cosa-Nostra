import factorial from "./factorial"
import permutations from "./permutations"

export default (n: number, r: number): number =>
	// n choose r
	permutations(n, r) / factorial(r)
