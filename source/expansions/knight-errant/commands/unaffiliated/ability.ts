import { UnaffiliatedCommand } from "../../../../commands/CommandType"
import { Attribute, AttributeInfo, DisplayField, ModularDetails } from "../../../../systems/Attribute"
import makeCommand from "../../../../commands/makeCommand"

interface FieldedModularDetails extends ModularDetails {
	"display-field": DisplayField[]
}
interface ModularAttribute extends AttributeInfo {
	modular: true
	"modular-details": FieldedModularDetails
}

const ability: UnaffiliatedCommand = async (message, params, config) => {
	//Delay import to avoid circular references
	const attributes: Record<string, Attribute> = require("../../../../systems/attributes")
	const powers = Object.values(attributes)
		.map((attribute) => attribute.attribute)
		.filter(
			(attribute) =>
				attribute.modular &&
				attribute["modular-details"] &&
				attribute["modular-details"].cluster === "ability" &&
				attribute["modular-details"]["display-field"]
		) as ModularAttribute[]

	if (params.length < 1) {
		await message.channel.send(
			"**List of available abilities:**\n```fix\n" + powers.map((x) => x.name).join(", ") + "```"
		)
		return
	}

	const check = params.join(" ")

	// Find
	const modular = powers.find((x) => x.name.toLowerCase() === check.toLowerCase())

	if (!modular) {
		await message.reply(":x: I cannot find that module!")
		return
	}

	let sendable = "Modular Ability: **" + modular.name + "**"

	const concat = []
	const field = modular["modular-details"]["display-field"]
	for (let i = 0; i < field.length; i++) {
		let description = field[i].description

		if (field[i].name.toLowerCase() === "command") {
			description = config["command-prefix"] + field[i].description
		}

		concat.push(field[i].name + ": " + description)
	}

	sendable += "\n```fix\n" + concat.join("\n") + "```"

	await message.channel.send(sendable)
}

export default makeCommand(ability, {
	name: "ability",
	description: "Lists abilities, or shows information about an ability",
	usage: "ability [ability name]",
})
