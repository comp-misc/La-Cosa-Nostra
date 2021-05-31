export default (milliseconds: number): string => {
	const ms = milliseconds % 1000
	const seconds = Math.floor(milliseconds / 1000) % 60
	const minutes = Math.floor(milliseconds / (1000 * 60)) % 60
	const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24
	const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) % 7
	const weeks = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7))

	const items = {
		w: weeks,
		d: days,
		h: hours,
		min: minutes,
		s: seconds,
		ms: ms,
	}
	return Object.entries(items)
		.filter(([, value]) => value >= 1)
		.map(([name, value]) => `${value}${name}`)
		.join(" ")
}
