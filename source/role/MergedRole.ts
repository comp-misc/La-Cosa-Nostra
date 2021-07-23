import { loadImage } from "canvas"
import { RoleInfo } from "."
import getAsset from "../auxils/getAsset"
import { CommandProperties, RoleCommand } from "../commands/CommandType"
import generateRoleCard from "../systems/executable/roles/generateRoleCard"
import { FlavourData, FlavourRoleData } from "../systems/flavours"
import { PlayerStats } from "../systems/game_templates/Player"
import { WinCondition } from "../systems/win_conditions"
import { CompleteRole } from "./CompleteRole"
import { findRoleMetadata } from "./loadRoles"
import { RoleConstructor } from "./RoleConstructor"
import { RoleDescriptor } from "./RoleDescriptor"
import { RoleMetadata } from "./RoleMetadata"
import { Alignment, formatAlignment, RolePart } from "./RolePart"

export interface RoleProperties {
	alignment: Alignment
	investigation: string[]
	alignmentInvestigation: string[]
	credits: string[]
	stats: PlayerStats
}

export class MergedRole {
	private _mainRoleMetadata: RoleMetadata<CompleteRole<unknown, unknown>>
	readonly partsMetadata: RoleMetadata<RolePart<unknown, unknown>>[]

	private flavour?: FlavourData

	customDisplayName: string | null = null

	constructor(roleInfo: RoleInfo, flavour?: FlavourData) {
		this._mainRoleMetadata = roleInfo.mainRole
		this.partsMetadata = [...roleInfo.parts]
		this.flavour = flavour
	}

	get mainRoleMetadata(): RoleMetadata<CompleteRole<unknown, unknown>> {
		return this._mainRoleMetadata
	}

	get mainRole(): CompleteRole<unknown, unknown> {
		return this.mainRoleMetadata.role
	}

	private get parts(): RolePart<unknown, unknown>[] {
		return this.partsMetadata.map((part) => part.role)
	}

	get allParts(): RolePart<unknown, unknown>[] {
		return [this.mainRole, ...this.parts]
	}

	get allPartsMetadata(): RoleMetadata<RolePart<unknown, unknown>>[] {
		return [this.mainRoleMetadata, ...this.partsMetadata]
	}

	get commands(): CommandProperties<RoleCommand>[] {
		return this.allParts.flatMap((part) => part.commands)
	}

	get winCondition(): WinCondition {
		return this.mainRole.winCondition
	}

	get properties(): RoleProperties {
		const properties = this.allParts
			.map((part) => part.properties)
			.map((prop) => ({
				alignment: prop.alignment,
				credits: prop.credits || [],
				investigation: prop.investigation ? [prop.investigation] : [],
				alignmentInvestigation: prop.alignmentInvestigation ? [prop.alignmentInvestigation] : [],
				stats: prop.stats || {},
			}))
		const intermediate = properties.reduce((p1, p2) => ({
			...p1,
			...p2,
			investigation: [...p1.investigation, ...p2.investigation],
			credits: [...p1.credits, ...p2.credits],
			stats: {
				...p2.stats,
				...p1.stats,
			},
		}))
		const is = intermediate.stats
		const mergedStats: PlayerStats = {
			"basic-defense": is["basic-defense"] || 0,
			"control-immunity": is["control-immunity"] || 0,
			"detection-immunity": is["detection-immunity"] || 0,
			"kidnap-immunity": is["kidnap-immunity"] || 0,
			"redirection-immunity": is["redirection-immunity"] || 0,
			"roleblock-immunity": is["roleblock-immunity"] || 0,
			"vote-magnitude": is["vote-magnitude"] || 1,
			"vote-offset": is["vote-offset"] || 0,
		}

		return {
			...intermediate,
			alignment: intermediate.alignment || this.mainRole.properties.alignment,
			stats: mergedStats,
		}
	}

	clearCustomDisplayName(): void {
		this.customDisplayName = null
	}

	getDisplayName(appendTrueRole = false): string {
		if (this.customDisplayName) {
			return this.customDisplayName
		}
		return this.getName(appendTrueRole)
	}

	getDeathName(): string {
		if (this.properties.alignment.representation === null) {
			return this.getDisplayName(true)
		}
		return (formatAlignment(this.properties.alignment) + " " + this.getDisplayName(true)).trim()
	}

	getName(appendTrueRole = false): string {
		const flavourRole = this.flavourRole
		const regularName = this.allParts
			.map((part) => {
				const descriptor = new RoleDescriptor()
				part.formatDescriptor(descriptor)
				return descriptor.name
			})
			.reduce((a, b) => a || b)
		if (flavourRole) {
			if (appendTrueRole && regularName && flavourRole.name !== regularName) {
				return `${flavourRole.name} (${regularName})`
			}
			return flavourRole.name
		}
		return regularName || "??"
	}

	hasPart<R extends RolePart<T, S>, T, S>(roleType: RoleConstructor<R, T, S>): boolean {
		return !!this.getPart(roleType)
	}

	getPart<R extends RolePart<T, S>, T, S>(roleType: RoleConstructor<R, T, S>): R | null {
		for (const part of this.allParts) {
			if (part instanceof roleType) {
				return part
			}
		}
		return null
	}

	getPartOrThrow<R extends RolePart<T, S>, T, S>(roleType: RoleConstructor<R, T, S>): R {
		const part = this.getPart(roleType)
		if (!part) {
			throw new Error("Role part '" + roleType.toString() + "' is missing")
		}
		return part
	}

	async addPart(part: RolePart<unknown, unknown>): Promise<void> {
		const metadata = findRoleMetadata(part)
		this.partsMetadata.push(metadata)
		await part.onRoleStart(this)
	}

	async changeMainRole(role: CompleteRole<unknown, unknown>): Promise<void> {
		this._mainRoleMetadata = findRoleMetadata(role)
		await role.onRoleStart(this)
	}

	getDescription(gameName: string): string {
		return this.roleDescriptor.formatToMarkdown(gameName, this.mainRole.winCondition, this.getDeathName())
	}

	async createRoleCard(): Promise<Buffer> {
		const flavour = this.flavour
		const flavourRole = this.flavourRole
		if (flavour && flavourRole?.banner) {
			const asset = flavour.assets[flavourRole.banner]
			if (asset) {
				return Promise.resolve(asset)
			}
		}
		for (const part of this.allParts) {
			const getRC = part.getRoleCard
			if (getRC) {
				const card = await getRC()
				if (card) {
					return card
				}
			}
		}

		//Generate role card
		const alignmentImage = await loadImage(getAsset(this.properties.alignment.id + ".png").data)
		return generateRoleCard(this.getDeathName(), alignmentImage)
	}

	get roleDescriptor(): RoleDescriptor {
		const descriptors = this.allParts.map((part) => {
			const descriptor = new RoleDescriptor()
			part.formatDescriptor(descriptor)
			return descriptor
		})
		if (descriptors.length < 2) {
			return descriptors[0]
		}
		return descriptors.reduce((d1, d2) => d1.mergeWith(d2))
	}

	get flavourRole(): FlavourRoleData | null {
		const flavour = this.flavour
		if (!flavour) {
			return null
		}
		const flavourRoles = [this.mainRoleMetadata, ...this.partsMetadata]
			.map((p) => flavour.roles[p.identifier])
			.filter((roles) => roles && roles.length > 0)
			.reduce((a, b) => [...a, ...b], [])

		if (flavourRoles.length === 0) {
			return null
		}
		if (flavourRoles.length === 1) {
			return flavourRoles[0]
		}
		return flavourRoles.reduce((a, b) => ({
			...b,
			...a,
		}))
	}
}
