import operations from "./operations"

const weightedRandom = <T>(...items: ({ item: T; weight: number } | [item: T, weight: number])[]): T => {
	if (items.length === 0) {
		throw new Error("No items specified")
	}
	const totalWeight = operations.addition(...items.map((item) => (item instanceof Array ? item[1] : item.weight)))
	let value = Math.random() * totalWeight
	for (const item of items) {
		value -= item instanceof Array ? item[1] : item.weight
		if (value <= 0) {
			return item instanceof Array ? item[0] : item.item
		}
	}
	throw new Error()
}

export default weightedRandom
