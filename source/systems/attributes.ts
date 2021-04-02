import attemptRequiring from "../auxils/attemptRequiring"
import attemptRequiringScript from "../auxils/attemptRequringScript"
import expansions from "../expansions"
import { Attribute, AttributeInfo } from "./Attribute"
import auxils from "./auxils"
import { tryReadCommands } from "../commands/commandReader"
import { RoleCommand } from "../commands/CommandType"

let attributes: string[] = []
let rules: string[] = []

// Add expansions

for (let i = 0; i < expansions.length; i++) {
	attributes = attributes.concat(expansions[i].additions.attributes.map((x) => expansions[i].identifier + "/" + x))
	rules = rules.concat(expansions[i].expansion.overrides?.attributes || [])
}

attributes = auxils.ruleFilter(attributes, rules)

const ret: Record<string, Attribute> = {}

for (let i = 0; i < attributes.length; i++) {
	const attribute_info = attributes[i].split("/")

	const expansion_identifier = attribute_info[0]
	const attribute = attribute_info[1]

	const expansion = expansions.find((x) => x.identifier === expansion_identifier)
	if (!expansion) {
		throw new Error(`No expansion found with identifier ${expansion_identifier}`)
	}
	const directory = expansion.expansion_directory + "/attributes/" + attribute

	const info = attemptRequiring<AttributeInfo>(directory + "/attribute.json")
	if (!info) {
		throw new Error(`No 'attribute.json' found at attribute directory ${directory}`)
	}

	const commands = tryReadCommands<"role", RoleCommand>(directory + "/game_commands", "role")
	for (const { command } of commands) {
		if (!command.attribute) {
			command.attribute = attribute
		}
	}

	ret[attribute] = {
		directory,
		attribute: info,
		start: attemptRequiringScript(directory + "/general/", "start"),
		routines: attemptRequiringScript(directory + "/general/", "routines"),
		commands,
	}
}
console.log("Attributes: ", Object.keys(ret))
export = ret
