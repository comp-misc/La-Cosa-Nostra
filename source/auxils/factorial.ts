const factorial = (value: number): number => (value <= 1 ? 1 : factorial(value - 1) * value)

export = factorial
