export default (type: string, amount: number): string => {
	switch (type) {
		case "s":
			if (amount === 1) {
				return ""
			} else {
				return "s"
			}

		case "!s":
			if (amount === 1) {
				return "s"
			} else {
				return ""
			}

		case "es":
			if (amount === 1) {
				return ""
			} else {
				return "es"
			}

		case "is":
			if (amount === 1) {
				return "is"
			} else {
				return "are"
			}

		case "was":
			if (amount === 1) {
				return "was"
			} else {
				return "were"
			}

		case "has":
			if (amount === 1) {
				return "has"
			} else {
				return "have"
			}

		default:
			return ""
	}
}
