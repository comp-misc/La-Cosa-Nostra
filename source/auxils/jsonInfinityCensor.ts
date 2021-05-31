// To convert Infinity to a string

export default (key: unknown, value: number): number | "__Infinity" => (value === Infinity ? "__Infinity" : value)
