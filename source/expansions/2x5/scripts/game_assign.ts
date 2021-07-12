import { GameAssignScript } from "../../../Expansion"
import { MergedRole } from "../../../role"
import { vanillaTownie } from "./roles"
import { mafiaRoleTable, townRoleTable } from "./roleTable"

const gameAssign: GameAssignScript = (config) => {
	const column = randomInteger(0, 1)
	const row = randomInteger(0, 4)

	const powerRoles = [...mafiaRoleTable[column], ...townRoleTable[column][row]]
	const setup = [...powerRoles, ...Array.from({ length: 17 - powerRoles.length }, () => vanillaTownie)]

	console.log("2x5 power roles: " + powerRoles.map((r) => new MergedRole(r).getName(false)).join(", "))
	console.log(`2x5 setup: c=${column},r=${row}`)

	return {
		...config,
		roles: setup,
		flavour: "2x5",
	}
}

const randomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

export default gameAssign
