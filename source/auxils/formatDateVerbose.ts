export = (milliseconds: number): string => {
	const ms = milliseconds % 1000
	const seconds = Math.floor(milliseconds / 1000) % 60
	const minutes = Math.floor(milliseconds / (1000 * 60)) % 60
	const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24
	const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) % 7
	const weeks = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7))

	// Calculate
	let concat = new String()

	if (weeks >= 1) {
		concat += weeks + "w "
	}

	if (days >= 1) {
		concat += days + "d "
	}

	if (hours >= 1) {
		concat += hours + "h "
	}

	if (minutes >= 1) {
		concat += minutes + "min "
	}

	if (seconds >= 1) {
		concat += seconds + "s "
	}

	if (ms >= 1) {
		concat += ms + "ms"
	}

	return concat.trim()
}