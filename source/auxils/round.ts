export = (value: number, decimals = 2, rounder = Math.round): number => {
	const multiple = Math.pow(10, decimals)

	return rounder(value * multiple) / multiple
}
