import fs from "fs"
import attemptRequiring from "../auxils/attemptRequiring"
import attemptRequiringScript from "../auxils/attemptRequringScript"
import { Attribute, AttributeInfo } from "./Attribute"
import auxils from "./auxils"
import expansions from "./expansions"

const attributes_dir = __dirname + "/../attributes"
let attributes = fs.readdirSync(attributes_dir).map((x) => "lcn/" + x)

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

	let directory: string
	if (expansion_identifier === "lcn") {
		directory = attributes_dir + "/" + attribute
	} else {
		const expansion = expansions.find((x) => x.identifier === expansion_identifier)
		if (!expansion) {
			throw new Error(`No expansion found with identifier ${expansion_identifier}`)
		}
		directory = expansion.expansion_directory + "/attributes/" + attribute
	}

	const info = attemptRequiring<AttributeInfo>(directory + "/attribute.json")
	if (!info) {
		throw new Error(`No 'attribute.json' found at attribute directory ${directory}`)
	}

	ret[attribute] = {
		directory,
		attribute: info,
		start: attemptRequiringScript(directory + "/general/", "start"),
		routines: attemptRequiringScript(directory + "/general/", "routines"),
	}
}

export = ret
