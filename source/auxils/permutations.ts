import factorial from "./factorial"

export default (n: number, r: number): number => {
	// n choose r
	return factorial(n) / factorial(n - r)
}
