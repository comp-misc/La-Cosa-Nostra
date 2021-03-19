export = <T>(key: string, value: string | T): T | Date => {
	const date_format = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/g

	if (typeof value === "string" && date_format.test(value)) {
		return new Date(value)
	}

	return value as T
}
