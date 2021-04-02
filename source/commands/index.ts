import { readAllCommandTypes } from "./commandReader"
import { Command } from "./CommandType"
import attributes from "../systems/attributes"
import expansions from "../expansions"
import roles from "../systems/roles"

const regularCommands = readAllCommandTypes(__dirname)
const roleCommands = Object.values(roles).flatMap((role) => role.commands)
const expansionCommands = expansions.flatMap((expansion) => expansion.commands)
const attributeRoleCommands = Object.values(attributes).flatMap((attribute) => attribute.commands)

const allCommands: Command[] = [...regularCommands, ...expansionCommands, ...roleCommands, ...attributeRoleCommands]

export = allCommands
