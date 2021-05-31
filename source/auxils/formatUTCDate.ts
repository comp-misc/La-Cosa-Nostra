export default (date: Date): string => {
	date = new Date(date)

	const day = date.getUTCDate().toString()
	const month = date.toLocaleString("en-gb", { month: "long" })
	const year = date.getUTCFullYear().toString()

	const hours = date.getUTCHours() < 10 ? `0${date.getUTCHours()}` : date.getUTCHours().toString()
	const minutes = date.getUTCMinutes() < 10 ? `0${date.getUTCMinutes()}` : date.getUTCMinutes().toString()

	const formatted = day + " " + month + " " + year + " UTC " + hours + ":" + minutes

	return formatted
}
