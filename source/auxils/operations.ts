type NumberOp = (...numbers: number[]) => number

interface Operations {
	addition: NumberOp
	subtraction: NumberOp
	multiplication: NumberOp
	division: NumberOp
	modulo: NumberOp
	max: NumberOp
	min: NumberOp
}

const operations: Operations = {
	addition: (...numbers: number[]): number => numbers.reduce((a, b) => a + b, 0),
	subtraction: (...numbers: number[]): number => numbers.reduce((a, b) => a - b),
	multiplication: (...numbers: number[]): number => numbers.reduce((a, b) => a * b, 1),
	division: (...numbers: number[]): number => numbers.reduce((a, b) => a / b),
	modulo: (...numbers: number[]): number => numbers.reduce((a, b) => a % b),
	max: Math.max,
	min: Math.min,
}

export default operations
