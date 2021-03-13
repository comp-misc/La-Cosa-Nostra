import factorial from "./factorial"

export = (n: number, r: number): number => {
	// n choose r
	return factorial(n) / factorial(n - r)
}
