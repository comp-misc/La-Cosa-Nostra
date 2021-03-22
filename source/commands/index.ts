import { readAllCommandTypes, tryReadCommands } from "./commandReader"
import { Command, RoleCommand } from "./CommandType"
import attributes from "../systems/attributes"
import expansions from "../expansions"
import roles from "../systems/roles"

const regularCommands = readAllCommandTypes(__dirname)
const expansionCommands = expansions.flatMap((expansion) => expansion.commands)
const roleCommands = Object.entries(roles).flatMap(([name, role]) => {
	const cmds = tryReadCommands<"role", RoleCommand>(role.directory + "/game_commands", "role")
	cmds.forEach((cmd) => {
		if (!cmd.command.role) {
			cmd.command.role = name
		}
	})
	return cmds
})
const attributeRoleCommands = Object.entries(attributes).flatMap(([name, attribute]) => {
	const cmds = tryReadCommands<"role", RoleCommand>(attribute.directory + "/game_commands", "role")
	cmds.forEach((cmd) => {
		if (!cmd.command.attribute) {
			cmd.command.attribute = name
		}
	})
	return cmds
})

const allCommands: Command[] = [...regularCommands, ...expansionCommands, ...roleCommands, ...attributeRoleCommands]

export = allCommands
