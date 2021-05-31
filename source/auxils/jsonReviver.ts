import jsonInfinityReviver from "./jsonInfinityReviver"
import jsonDateTimeReviver from "./jsonDateTimeReviver"

export default (key: string, value: "__Infinity" | number): number | Date => {
	const dateValue = jsonInfinityReviver(key, value)
	return jsonDateTimeReviver(key, dateValue)
}
