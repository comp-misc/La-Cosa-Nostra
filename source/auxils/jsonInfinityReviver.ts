// To revive

export default (key: string, value: "__Infinity" | number): number => (value === "__Infinity" ? Infinity : value)
