import { readAllCommandTypes, tryReadCommands } from "../commands/commandReader"
import { Command, RoleCommand } from "../commands/CommandType"
import attributes from "./attributes"
import expansions from "./expansions"
import roles from "./roles"

const regularCommands = readAllCommandTypes(__dirname + "/../commands")
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
const attributeRoleCommands = Object.values(attributes).flatMap((attribute) =>
	tryReadCommands<"role", RoleCommand>(attribute.directory + "/game_commands", "role")
)

const allCommands: Command[] = [...regularCommands, ...expansionCommands, ...roleCommands, ...attributeRoleCommands]

export = allCommands
