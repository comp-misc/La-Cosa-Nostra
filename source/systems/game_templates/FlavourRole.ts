import { loadImage } from "canvas"
import getAsset from "../../auxils/getAsset"
import { CommandProperties, RoleCommand } from "../../commands/CommandType"
import { LcnConfig } from "../../LcnConfig"
import generateRoleCard from "../executable/roles/generateRoleCard"
import { FlavourData, FlavourRoleData } from "../flavours"
import { ProgrammableRole, Role, RoleProperties } from "../Role"
import { PlayerStats } from "./Player"

export default class FlavourRole<T = unknown> {
	private _customDisplayName: string | null = null
	private config: LcnConfig
	private flavour?: FlavourData

	public readonly role: ProgrammableRole<T>

	public readonly identifier: string
	public readonly expansion: string

	constructor(role: Role<ProgrammableRole<T>, T>, config: LcnConfig, flavour?: FlavourData) {
		this.role = role.role
		this.config = config
		this.flavour = flavour

		this.identifier = role.identifier
		this.expansion = role.expansion
		this._customDisplayName
	}

	public hasCustomDisplayName(): boolean {
		return !!this._customDisplayName
	}

	public clearCustomDisplayName(): void {
		this._customDisplayName = null
	}

	get customDisplayName(): string | null {
		return this._customDisplayName
	}
	set customDisplayName(name: string | null) {
		this._customDisplayName = name
	}

	getDisplayName(appendTrueRole = false): string {
		if (this._customDisplayName) {
			return this._customDisplayName
		}
		return this.getName(appendTrueRole)
	}

	getName(appendTrueRole = false): string {
		const flavourRole = this.flavourRole
		const regularName = this.role.displayName || this.properties["role-name"]
		if (flavourRole) {
			if (appendTrueRole && flavourRole.name !== regularName) {
				return `${flavourRole.name} (${regularName})`
			}
			return flavourRole.name
		}
		return regularName
	}

	get description(): string {
		const flavourRole = this.flavourRole
		const description = flavourRole ? flavourRole.description : this.role.getDescription()
		return description.replace("${game.name}", this.config.messages.name)
	}

	async createRoleCard(): Promise<Buffer> {
		const flavour = this.flavour
		const flavourRole = this.flavourRole
		if (flavourRole && flavourRole.banner && flavour && flavour.assets[flavourRole.banner]) {
			return Promise.resolve(flavour.assets[flavourRole.banner])
		}
		const getRoleCard = this.role.getRoleCard
		if (getRoleCard) {
			const card = await getRoleCard()
			if (card) {
				return card
			}
		}

		//Generate role card
		const alignmentImage = await loadImage(getAsset(this.role.properties.alignment + ".png").data)
		return generateRoleCard(this.getDisplayName(), alignmentImage)
	}

	get properties(): RoleProperties {
		return this.role.properties
	}

	get stats(): PlayerStats {
		return this.role.properties.stats
	}

	get commands(): CommandProperties<RoleCommand>[] {
		return this.role.commands
	}

	get flavourRole(): FlavourRoleData | null {
		const flavour = this.flavour
		if (!flavour) {
			return null
		}
		const roleFlavour = flavour.roles[this.identifier]
		if (!roleFlavour) {
			return null
		}
		if (roleFlavour.length === 0) {
			return null
		}
		if (roleFlavour.length > 1) {
			throw new Error(`Multiple flavour role variants no longer supported, please use role configuration`)
		}
		return roleFlavour[0]
	}
}
