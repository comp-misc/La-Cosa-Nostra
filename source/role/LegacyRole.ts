import fs from "fs"
import { RoleRoutine, RoleStart } from "."
import attemptRequiring from "../auxils/attemptRequiring"
import attemptRequiringScript from "../auxils/attemptRequiringScript"
import { tryReadCommands } from "../commands/commandReader"
import { CommandProperties, RoleCommand } from "../commands/CommandType"
import MafiaCommunication from "../expansions/roles/parts/mafia_communication"
import lazyGet from "../lazyGet"
import Player, { PlayerStats } from "../systems/game_templates/Player"
import win_conditions, { WinCondition } from "../systems/win_conditions"
import { BasicCompleteRole } from "./BasicCompleteRole"
import { CompleteRoleProperties } from "./CompleteRole"
import { RoleDescriptor } from "./RoleDescriptor"
import { RoutineProperties } from "./RolePart"

interface LegacyRoleConfig {
	directory: string
	identifier: string
	expansion: string
}

interface LegacyRoleInfo {
	thumbnail?: string
	abilities?: string[]
	attributes?: string[]
	credits?: string[]
}

interface LegacyRoleProperties {
	"role-name": string
	alignment: string
	investigation?: string[]
	stats: PlayerStats

	"see-mafia-chat": boolean
	"reveal-role-on-interrogation": boolean
	"win-condition": string

	credits?: string[]
}

const attemptRead = (directory: string): string | null => {
	const exists = fs.existsSync(directory)

	if (exists) {
		return fs.readFileSync(directory, "utf8")
	} else {
		return null
	}
}

export class LegacyRole extends BasicCompleteRole<LegacyRoleConfig, null> {
	readonly routineProperties: RoutineProperties = {
		ALLOW_DAY: true,
		ALLOW_DEAD: true,
		ALLOW_NIGHT: true,
	}

	readonly commands: CommandProperties<RoleCommand>[]

	readonly properties: CompleteRoleProperties

	private readonly legacyInfo: LegacyRoleInfo
	private readonly legacyProperties: LegacyRoleProperties

	private startScript?: RoleStart
	private routines?: RoleRoutine

	private description?: string

	private loadedStartScript = false
	private loadedRoutines = false

	private mafiaCommunication?: MafiaCommunication

	readonly getRoleCard?: () => Promise<Buffer | undefined>

	constructor(config: LegacyRoleConfig) {
		super(config, null)

		const { directory } = config

		const roleInfo = attemptRequiring<LegacyRoleInfo>(directory + "/info.json")
		const roleProperties = attemptRequiring<LegacyRoleProperties>(directory + "/role.json")
		if (!roleInfo) {
			throw new Error(`Missing info.json file in '${directory}'`)
		}
		if (!roleProperties) {
			throw new Error(`Missing role.json file in '${directory}'`)
		}
		this.legacyInfo = roleInfo
		this.legacyProperties = roleProperties

		this.commands = tryReadCommands<"role", RoleCommand>(directory + "/game_commands", "role")
		this.description = attemptRead(directory + "/description.txt") || undefined
		if (fs.existsSync(directory + "/card.png")) {
			this.getRoleCard = lazyGet(
				() =>
					new Promise((resolve, reject) =>
						fs.readFile(directory + "/card.png", (err, data) => {
							if (err) reject(err)
							else resolve(Buffer.from(data))
						})
					)
			)
		} else {
			this.getRoleCard = undefined
		}

		const { investigation } = this.legacyProperties
		this.properties = {
			alignment: {
				id: roleProperties.alignment,
			},
			credits: roleProperties.credits || this.legacyInfo?.credits,
			stats: roleProperties.stats,
			investigation: investigation && investigation.length > 0 ? investigation[0] : undefined,
		}

		if (roleProperties["see-mafia-chat"] === true) {
			this.mafiaCommunication = new MafiaCommunication()
		}
	}

	override async onStart(player: Player): Promise<void> {
		for (const attribute of this.legacyInfo.attributes || []) {
			await player.addAttribute(attribute)
		}
		if (!this.loadedStartScript) {
			try {
				this.startScript = attemptRequiringScript<RoleStart>(this.config.directory + "/general/", "start")
			} finally {
				this.loadedStartScript = true
			}
		}
		if (this.startScript) {
			await this.startScript(player)
		}
		if (this.mafiaCommunication) {
			await this.mafiaCommunication.onStart(player)
		}
	}

	override async onRoutines(player: Player): Promise<void> {
		this.ensureRoutinesLoaded()
		if (this.routines && this.checkRoutines(player, this.routines)) {
			await this.routines(player)
		}
		if (this.mafiaCommunication && this.checkRoutines(player, this.mafiaCommunication.routineProperties)) {
			await this.mafiaCommunication.onRoutines(player)
		}
	}

	override async onDeath(player: Player): Promise<void> {
		if (this.mafiaCommunication) {
			await this.mafiaCommunication.onDeath(player)
		}
	}

	private checkRoutines(player: Player, routines: RoutineProperties): boolean {
		if (!player.isAlive() && !routines.ALLOW_DEAD) return false
		if (player.getGame().isDay() && !routines.ALLOW_DAY) return false
		if (player.getGame().isNight() && !routines.ALLOW_NIGHT) return false
		return true
	}

	private ensureRoutinesLoaded() {
		if (!this.loadedRoutines) {
			try {
				this.routines = attemptRequiringScript<RoleRoutine>(this.config.directory + "/general/", "routines")
			} finally {
				this.loadedRoutines = true
			}
		}
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.name = this.legacyProperties["role-name"]
		if (this.description) {
			descriptor.flavorText = this.description
		}

		if (this.mafiaCommunication) {
			this.mafiaCommunication.formatDescriptor(descriptor)
		}
	}

	get winCondition(): WinCondition {
		const winCondition = win_conditions()[this.legacyProperties["win-condition"]]
		if (!winCondition) {
			throw new Error(`Unknown win condition '${this.legacyProperties["win-condition"]}'`)
		}
		return winCondition
	}
}
