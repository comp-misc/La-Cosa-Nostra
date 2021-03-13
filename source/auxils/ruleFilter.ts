// Rule filter function

const wildcard = (str: string): RegExp => {
	if (str.startsWith("-") || str.startsWith("+")) {
		str = str.substring(1, str.length)
	}

	str = str.replace(/[.+?^${}()|[\]\\]/g, "\\$&")

	const reg = str.replace("*", "(?:)")
	return new RegExp(reg, "gi")
}

export = (sample: string[], rules: string[]): string[] => {
	if (!sample || !rules) {
		return sample
	}

	let final = Array.from(sample)

	/*
  - - exlcusion criteria
  [] - inclusion criteria
  + - exception criteria
  */
	// Run filter
	for (let i = 0; i < rules.length; i++) {
		const rule = rules[i]
		const catchable = wildcard(rule)

		switch (true) {
			case rule.startsWith("-"):
				// Scan through current sample and exclude
				final = final.filter((x) => !x.match(catchable))
				break

			case rule.startsWith("+"):
				// Scan through current sample and except
				final = final.filter((x) => x.match(catchable))
				break

			default: {
				// Scan through first sample and include
				const include = sample.filter((x) => x.match(catchable))
				for (let j = 0; j < include.length; j++) {
					if (final.some((x) => x === include[j])) {
						continue
					}
					final = final.concat(include)
				}
				break
			}
		}
	}

	return final
}
