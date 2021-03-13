// To convert Infinity to a string

export = (key: unknown, value: number): number | "__Infinity" => (value === Infinity ? "__Infinity" : value)
