import { RoleCommand } from "../../../../../commands/CommandType"
import makeCommand from "../../../../../commands/makeCommand"

const listAbilities: RoleCommand = async (game, message, _params, from) => {
	const abilities = from.attributes.filter(
		(x) =>
			x.attribute.modular &&
			x.attribute["modular-details"] &&
			x.attribute["modular-details"].cluster === "ability"
	)

	abilities.sort((a, b) => a.tags.uses - b.tags.uses)

	if (abilities.length > 0) {
		const abilityNames = abilities.map((x, i) => `${i + 1}. ${x.attribute.name} [x ${x.tags.uses as number}]`)
		await message.reply(":zap: Your current modular abilities:\n```fix\n" + abilityNames.join("\n") + "\n```")
	} else {
		await message.reply(":zap: You currently do not have any modular powers.")
	}
}

listAbilities.PRIVATE_ONLY = true
listAbilities.DEAD_CANNOT_USE = true
listAbilities.ALIVE_CANNOT_USE = false
listAbilities.DISALLOW_DAY = false
listAbilities.DISALLOW_NIGHT = false

export default makeCommand(listAbilities, {
	name: "listabilities",
	description: "List all your current abilities",
})
