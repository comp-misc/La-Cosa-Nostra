// Accounts for the flavours API
import fs from "fs"
import expansions from "../expansions"
import auxils from "./auxils"

export interface FlavourRoleData {
	name: string
	/** File location of banner */
	banner?: string
	description: string
}
export interface AssetSwap {
	from: string
	to: string
}
export interface FlavourData {
	info: FlavourInfo
	roles: Record<string, FlavourRoleData[]>
	assets: Record<string, Buffer>
	asset_swaps: AssetSwap[]
	flavours: Record<string, FlavourRoleData>
}
export interface FlavourInfo extends Record<string, any> {
	"default-display-flavour": boolean
	"show-role-equivalent": boolean
	"display-role-equivalent-on-death": boolean
	"display-role-equivalent-in-win-log": boolean
	"investigator-sees-flavour-role": boolean
	"show-role-category": boolean
	"post-role-card-and-description-on-death": boolean
	"step-names": string[] | null
}

const ret: Record<string, FlavourData> = {}

const flavours_dir = __dirname + "/../flavours/"

const attemptRead = (directory: string): Buffer | undefined => {
	const available = fs.existsSync(directory)

	if (available) {
		return fs.readFileSync(directory)
	} else {
		return undefined
	}
}

let flavours: string[]
if (fs.existsSync(flavours_dir)) {
	flavours = fs.readdirSync(flavours_dir).map((x) => "lcn/" + x)
} else {
	flavours = []
}

let rules: string[] = []

// Add expansions
for (let i = 0; i < expansions.length; i++) {
	flavours = flavours.concat(expansions[i].additions.flavours.map((x) => expansions[i].identifier + "/" + x))
	rules = rules.concat(expansions[i].expansion.overrides?.flavours || [])
}

flavours = auxils.ruleFilter(flavours, rules)

for (let i = 0; i < flavours.length; i++) {
	const flavour_info = flavours[i].split("/")

	const expansion_identifier = flavour_info[0]
	const flavour = flavour_info[1]
	let directory: string

	if (expansion_identifier === "lcn") {
		directory = flavours_dir + "/" + flavour
	} else {
		const expansion = expansions.find((x) => x.identifier === expansion_identifier)
		if (!expansion) {
			throw new Error(`Unknown expansion '${expansion_identifier}'`)
		}
		directory = `${expansion.expansion_directory}/flavours/${flavour}`
	}

	if (!fs.lstatSync(directory).isDirectory()) {
		continue
	}

	/* eslint-disable @typescript-eslint/no-var-requires */

	// Scan the system
	const info = require(`${directory}/info.json`) as FlavourInfo
	const roles = require(`${directory}/roles.json`) as Record<string, FlavourRoleData[]>
	const asset_swaps = require(`${directory}/asset-swaps.json`) as AssetSwap[]
	const assets: Record<string, Buffer> = {}

	const assets_dir = directory + "/assets/"

	// List assets
	if (fs.existsSync(assets_dir) && fs.lstatSync(assets_dir).isDirectory()) {
		const listed = fs.readdirSync(assets_dir)
		listed.forEach((item) => {
			const result = attemptRead(assets_dir + item)
			if (result) {
				assets[item] = result
			} else {
				console.log(`Unable to find ${assets_dir}${item}`)
			}
		})
	}

	const all_flavours: Record<string, FlavourRoleData> = {}
	const keys = Object.keys(roles)

	keys.forEach((key) => {
		const available = roles[key]
		available.forEach((role) => (all_flavours[role.name] = role))
	})

	ret[flavour] = {
		info: info,
		roles: roles,
		assets: assets,
		flavours: all_flavours,
		asset_swaps: asset_swaps,
	}
}

export default ret
