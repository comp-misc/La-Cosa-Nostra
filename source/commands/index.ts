import { readAllCommandTypes } from "./commandReader"
import attributes from "../systems/attributes"
import expansions from "../expansions"
import lazyGet from "../lazyGet"

const getCommands = lazyGet(() => {
	const regularCommands = readAllCommandTypes(__dirname)
	const expansionCommands = expansions.flatMap((expansion) => expansion.commands)
	const attributeRoleCommands = Object.values(attributes).flatMap((attribute) => attribute.commands)

	return [...regularCommands, ...expansionCommands, ...attributeRoleCommands]
})

export default getCommands
