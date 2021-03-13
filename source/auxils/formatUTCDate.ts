export = (date: Date): string => {
	date = new Date(date)

	const day = date.getUTCDate()
	const month = date.toLocaleString("en-gb", { month: "long" })
	const year = date.getUTCFullYear()

	const hours = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours()
	const minutes = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes()

	const formatted = day + " " + month + " " + year + " UTC " + hours + ":" + minutes

	return formatted
}
