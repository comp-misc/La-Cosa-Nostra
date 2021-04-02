import rt from "./role_table.json"
import { GameAssignScript } from "../../../Expansion"
import getLogger from "../../../getLogger"
import { RoleSetup, SetupAttributeData, SetupRoleData } from "../../../LcnConfig"
import cryptographicChoice from "../../../auxils/cryptographicChoice"
import getUniqueArray from "../../../auxils/getUniqueArray"
import pettyFormat from "../../../auxils/pettyFormat"
import cryptoRandom from "../../../auxils/cryptoRandom"

interface RoleTableBlock {
	"role-identifier": string
	ability: string
}
type RoleTableStructure = RoleTableBlock[][]
// Transpose

const basicRoleTable = rt as RoleTableStructure
const role_table = basicRoleTable[0].map((col, i) => basicRoleTable.map((row) => row[i]))

const gameAssign: GameAssignScript = (playing_config) => {
	const logger = getLogger()
	if (playing_config.roles && playing_config.roles.length > 0) {
		logger.log(2, "[Knight-Errant] Not running setup randomiser as roles have been defined.")

		return {
			...playing_config,
			flavour: "knight-errant",
		}
	}

	// Default setup
	let setup: RoleSetup = ["town_neighbour", "town_neighbour", "mafia_goon", "mafia_goon"]

	// Choose from role table using knight move
	const possibilities = knightMatrix([4, 4], [2, 1])

	const choice = cryptographicChoice(possibilities)

	const concatenable = []

	for (let i = 0; i < choice.positions.length; i++) {
		const position = choice.positions[i]
		concatenable.push(role_table[position[0]][position[1]])
	}

	const roles = concatenable.map((x) => x["role-identifier"])
	const abilities = concatenable.map((x) => x.ability)

	setup = setup.concat(roles)

	const unique = getUniqueArray(abilities)

	const attributes: SetupAttributeData[] = unique.map((identifier) => ({
		identifier,
		tags: { uses: abilities.filter((x) => x === identifier).length },
	}))

	const serial_killer: SetupRoleData = { identifier: "serial_killer", attributes: attributes }

	setup.push(serial_killer)

	const townies = new Array(18 - setup.length).fill("town_vanilla_townie")
	setup = setup.concat(townies)

	for (let c = setup.length - 1; c > 0; c--) {
		const b = Math.floor(Math.random() * (c + 1))
		const a = setup[c]
		setup[c] = setup[b]
		setup[b] = a
	}

	logger.log(2, "[Knight-Errant] Running setup: %s [%s]", choice.name, pettyFormat(roles))

	return {
		...playing_config,
		roles: setup,
		flavour: "knight-errant",
	}
}

// Code by Kroppeb, modified by ChocoParrot
const knightMatrix = (dimensions = [4, 4], move_directions = [2, 1]) => {
	// Enumerate axes
	const arx = [
		[
			{ letter: "R", axis: 0, direction: 1 },
			{ letter: "L", axis: 0, direction: -1 },
		],
		[
			{ letter: "D", axis: 1, direction: 1 },
			{ letter: "U", axis: 1, direction: -1 },
		],
	]

	const start_pos = dimensions.map((i) => Math.floor(i * cryptoRandom(60, 60)))

	const moves: { name: string; positions: number[][] }[] = []

	const isValidLocation = (pos: number[]): boolean => {
		return pos.every((val, i) => 0 <= val && val < dimensions[i])
	}

	const doStep = (axis: number, pos: number[], step = 0, name = "", combination_indices: number[][] = []) => {
		if (step >= move_directions.length) {
			combination_indices.push(pos)
			moves.push({ name: name, positions: combination_indices })
			return null
		}

		arx[axis].forEach((move) => {
			const new_pos = Array.from(pos)
			new_pos[axis] += move.direction * move_directions[step]

			if (isValidLocation(new_pos)) {
				const combination_pos = [pos]

				for (let i = 1; i < move_directions[step]; i++) {
					const intermediate_pos = Array.from(pos)

					intermediate_pos[axis] += move.direction * i

					combination_pos.push(intermediate_pos)
				}

				const new_indices = combination_indices.concat(combination_pos)

				doStep(1 - axis, new_pos, step + 1, name + move.letter, new_indices)
			}
		})
	}

	for (let i = 0; i < arx.length; i++) {
		doStep(i, start_pos)
	}

	return moves.map((steps) => ({
		name: String.fromCharCode(start_pos[0] + 65) + (start_pos[1] + 1) + "-" + steps.name,
		positions: steps.positions,
	}))
}

export default gameAssign