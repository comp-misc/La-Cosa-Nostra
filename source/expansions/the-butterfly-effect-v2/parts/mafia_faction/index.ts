import { CommandProperties, RoleCommand } from "../../../../commands/CommandType"
import {
	BasicCompleteRole,
	CompleteRoleProperties,
	MergedRole,
	RoleDescriptor,
	RoutineProperties,
} from "../../../../role"
import FactionCommunication from "../../../roles/parts/faction_communication"
import MafiaFactionKill from "../../../roles/parts/mafia_faction_kill"
import Recruiter from "../recruiter"

export interface Config {
	faction: 1 | 2
}

export default abstract class MafiaFaction extends BasicCompleteRole<Config, null> {
	readonly commands: CommandProperties<RoleCommand>[] = []

	readonly properties: CompleteRoleProperties = {
		alignment: {
			id: `mafia-team-${this.faction}`,
			representation: `Mafia Team ${this.faction}`,
		},
	}

	routineProperties: RoutineProperties = {
		ALLOW_DAY: false,
		ALLOW_DEAD: false,
		ALLOW_NIGHT: false,
	}

	constructor(config: Config) {
		super(config, null)
	}

	override async onRoleStart(role: MergedRole): Promise<void> {
		await role.addPart(
			new FactionCommunication({
				channelName: `mafia-team-${this.faction}`,
				phase: "night",
			})
		)
		await role.addPart(
			new MafiaFactionKill({
				singleAction: true,
				actionName: `Faction-Kill-Team-${this.faction}`,
				faction: `mafia-team-${this.faction}`,
			})
		)
		await role.addPart(
			new Recruiter({
				team: this.config.faction,
				singleAction: true,
			})
		)
	}

	get faction(): number {
		return this.config.faction
	}

	formatDescriptor(descriptor: RoleDescriptor): void {
		descriptor.additionalInformation.push("You are limited to at most one action each night.")
	}
}
