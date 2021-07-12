import { WinCondition } from "../systems/win_conditions"

export enum BasicDescriptionCategory {
	ROLE_ABILITIES = "Role Abilities",
	FACTIONAL_ABILITIES = "Factional Abilities",
}

export type RoleDescriptionCategory = BasicDescriptionCategory | string

export interface RoleDescriptorEntry {
	name: string
	description: string
	notes?: string[]
}

export class RoleDescriptor {
	name?: string
	readonly descriptions: Record<RoleDescriptionCategory, RoleDescriptorEntry[]> = {}
	flavorText?: string

	additionalInformation: string[] = []

	constructor(name?: string) {
		this.name = name
	}

	addDescription(category: RoleDescriptionCategory, ...entries: RoleDescriptorEntry[]): this {
		const descriptions = this.descriptions[category] || []
		descriptions.push(...entries)
		this.descriptions[category] = descriptions
		return this
	}

	formatToMarkdown(gameName: string, winCondition: WinCondition, overrideName?: string): string {
		const lines = ["```yml"]
		const name = overrideName || this.name

		let introMessage = `Welcome to ${gameName}!`
		if (name) {
			const grammar = ["a", "e", "i", "o", "u"].some((v) => name.toLowerCase().startsWith(v)) ? "an" : "a"
			introMessage += ` You are ${grammar} ${name}`
		}
		lines.push(introMessage)

		if (this.flavorText) {
			lines.push("")
			lines.push(this.flavorText)
		}

		for (const [category, entries] of Object.entries(this.descriptions)) {
			lines.push("")
			lines.push(category + ":")
			for (const entry of entries) {
				lines.push(`- ${entry.name}:`)
				lines.push(`  ${entry.description}`)

				for (const note of entry.notes || []) {
					lines.push(`   - ${note}`)
				}
			}
		}
		lines.push("")
		lines.push("Win Condition:")
		lines.push(`- ${winCondition.DESCRIPTION}`)

		lines.push("```")
		return lines.join("\n")
	}

	mergeWith(other: RoleDescriptor): RoleDescriptor {
		const flavourTexts: string[] = []
		if (this.flavorText) flavourTexts.push(this.flavorText)
		if (other.flavorText) flavourTexts.push(other.flavorText)

		const newDescriptor = new RoleDescriptor(this.name || other.name)
		if (flavourTexts.length > 0) {
			newDescriptor.flavorText = flavourTexts.join("\n\n")
		}

		const addDescriptions = (descriptions: Record<RoleDescriptionCategory, RoleDescriptorEntry[]>) => {
			for (const [category, entries] of Object.entries(descriptions)) {
				for (const entry of entries) {
					newDescriptor.addDescription(category, entry)
				}
			}
		}
		addDescriptions(this.descriptions)
		addDescriptions(other.descriptions)

		newDescriptor.additionalInformation = [...this.additionalInformation, ...other.additionalInformation]
		return newDescriptor
	}

	static CATEGORY = BasicDescriptionCategory
}
