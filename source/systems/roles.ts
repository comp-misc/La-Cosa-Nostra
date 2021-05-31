// Enumerate roles
import fs from "fs"
import attemptRequiring from "../auxils/attemptRequiring"
import attemptRequiringScript from "../auxils/attemptRequiringScript"
import ruleFilter from "../auxils/ruleFilter"
import { tryReadCommands } from "../commands/commandReader"
import { CommandProperties, RoleCommand } from "../commands/CommandType"
import { Expansion } from "../Expansion"
import expansions from "../expansions"
import lazyGet from "../lazyGet"
import Player from "./game_templates/Player"
import {
	ProgrammableRole,
	Role,
	RoleInfo,
	RoleMetadata,
	RoleConstructor,
	RoleProperties,
	RoleRoutine,
	RoleStart,
	RoutineProperties,
} from "./Role"

const attemptRead = (directory: string): string | null => {
	const exists = fs.existsSync(directory)

	if (exists) {
		return fs.readFileSync(directory, "utf8")
	} else {
		return null
	}
}

const loadRole = (expansion: Expansion, roleId: string): RoleMetadata<ProgrammableRole<unknown>, unknown> => {
	const directory = expansion.expansion_directory + "/roles/" + roleId
	if (!fs.existsSync(directory)) {
		throw new Error(`Unable to find role directory '${directory}'`)
	}
	if (!fs.lstatSync(directory).isDirectory()) {
		throw new Error(`Role path '${directory}' must be a directory`)
	}
	const roleClass = attemptRequiringScript<RoleConstructor<ProgrammableRole<unknown>, unknown>>(directory, "index")
	if (roleClass) {
		return {
			expansion: expansion.identifier,
			identifier: roleId,
			directory,
			roleClass,
			isLegacy: false,
		}
	}
	return loadLegacyRole(expansion, roleId, directory) as RoleMetadata<ProgrammableRole<unknown>, unknown>
}

const loadLegacyRole = (
	expansion: Expansion,
	roleId: string,
	directory: string
): RoleMetadata<ProgrammableRole<null>, null> => {
	const info = attemptRequiring<RoleInfo>(directory + "/info.json")
	const description = attemptRead(directory + "/description.txt")
	const roleJson = attemptRequiring<RoleProperties>(directory + "/role.json")

	const getRoutine = lazyGet(() => attemptRequiringScript<RoleRoutine>(directory + "/general/", "routines"))
	const getStart = lazyGet(() => attemptRequiringScript<RoleStart>(directory + "/general/", "start"))

	if (!roleJson) {
		throw new Error(`${roleId}'s role.json does not exist!`)
	}
	if (!info) {
		throw new Error(`${roleId}'s info.json does not exist`)
	}
	if (!roleJson["win-condition"]) {
		throw new Error(`No win condition for ${roleId}`)
	}

	if (roleJson["has-actions"] === undefined) {
		console.log(`No has-actions for ${roleId}`)
	}

	const commands = tryReadCommands<"role", RoleCommand>(directory + "/game_commands", "role")

	const properties: RoleProperties = {
		...roleJson,
		...info,
	}

	let roleCardPromise: Promise<Buffer> | undefined = undefined
	if (fs.existsSync(directory + "/card.png")) {
		roleCardPromise = new Promise((resolve, reject) =>
			fs.readFile(directory + "/card.png", (err, data) => {
				if (err) reject(err)
				else resolve(Buffer.from(data))
			})
		)
	}

	class LegacyRoleImpl implements ProgrammableRole<null> {
		config = null
		properties: RoleProperties = properties
		commands: CommandProperties<RoleCommand>[] = commands

		get routineProperties(): RoutineProperties {
			const routine = getRoutine()
			return (
				routine || {
					ALLOW_DAY: false,
					ALLOW_DEAD: false,
					ALLOW_NIGHT: false,
				}
			)
		}

		displayName: string = properties["role-name"]

		constructor() {
			this.properties = properties
		}

		getDescription(): string {
			return description || ""
		}

		async getRoleCard(): Promise<Buffer | undefined> {
			if (roleCardPromise) {
				return roleCardPromise
			}
			return undefined
		}

		onStart(player: Player): void | Promise<void> {
			const start = getStart()
			if (start) {
				return start(player)
			}
		}

		onRoutines(player: Player): void | Promise<void> {
			const routine = getRoutine()
			if (routine) {
				return routine(player)
			}
		}
	}

	return {
		expansion: expansion.identifier,
		identifier: roleId,
		directory,
		roleClass: LegacyRoleImpl,
		isLegacy: true,
	}
}

let roleList: Record<string, RoleMetadata<ProgrammableRole<unknown>, unknown>> | undefined = undefined

const getRoles = (): Record<string, RoleMetadata<ProgrammableRole<unknown>, unknown>> => {
	if (roleList) {
		return roleList
	}
	roleList = {}
	// Read files [role]/[actions]/<name>
	// Enumerate as [role]-<name>

	let rules: string[] = []
	let roles: string[] = []

	// Add expansions

	expansions.forEach((expansion) => {
		roles = roles.concat(expansion.additions.roles.map((x) => expansion.identifier + "/" + x))
		rules = rules.concat(expansion.expansion.overrides?.roles || [])
	})

	roles = ruleFilter(roles, rules)

	for (const roleDescriptor of roles) {
		const role_info = roleDescriptor.split("/")

		const expansionId = role_info[0]
		const roleId = role_info[1]

		const expansion = expansions.find((x) => x.identifier === expansionId)
		if (!expansion) {
			throw new Error(`Unable to find expansion with identifier ${expansionId}`)
		}
		roleList[roleId] = loadRole(expansion, roleId)
	}
	return roleList
}

export interface InstantiateRole {
	<T extends ProgrammableRole<S>, S>(role: RoleConstructor<T, S>, config: S): Role<T, S>

	<T extends ProgrammableRole<null>>(role: RoleConstructor<T, null>): Role<T, null>
}

export const instantiateRole: InstantiateRole = <T extends ProgrammableRole<S>, S = null>(
	role: RoleConstructor<T, S>,
	config?: S
): Role<T, S> => {
	const roleData = Object.values(getRoles()).find((x) => x.roleClass === role) as RoleMetadata<T, S> | undefined
	if (!roleData) {
		throw new Error(`Unknown role ${role.toString()}`)
	}
	return {
		...roleData,
		role: new role((config || null) as S),
	}
}

export interface InstantiateRoleFromId {
	<T extends ProgrammableRole<S>, S>(id: string, config: S): Role<T, S>

	<T extends ProgrammableRole<null>>(id: string): Role<T, null>
}

export const instantiateRoleFromId: InstantiateRoleFromId = <T extends ProgrammableRole<S>, S = null>(
	roleId: string,
	config?: S
): Role<T, S> => {
	const roleData = getRoles()[roleId] as RoleMetadata<T, S> | undefined
	if (!roleData) {
		throw new Error(`Unknown role ${roleId}`)
	}
	if (roleData.isLegacy) {
		throw new Error(`Role ${roleId} must be instantiated`)
	}
	const role = new roleData.roleClass((config || null) as S)
	return {
		...roleData,
		role,
	}
}

export default getRoles
