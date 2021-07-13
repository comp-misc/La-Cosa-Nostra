import { GameAssignScript } from "../../../Expansion"
import { createRoleInfo, MergedRole, RoleInfo, RolePart } from "../../../role"
import Goon from "../../roles/parts/goon"
import JailKeeper from "../../roles/parts/jailkeeper"
import Neighbour from "../../roles/parts/neighbour"
import Roleblocker from "../../roles/parts/roleblocker"
import RoleCop from "../../roles/parts/role_cop"
import Tracker from "../../roles/parts/tracker"
import VanillaTownie from "../../roles/parts/vanilla_townie"
import BasicMafia from "../../roles/roles/basic_mafia"
import Town from "../../roles/roles/town"
import SerialKiller from "../roles/serial_killer"

const setup = `
V,V,JK,R,N,N,RC,V,T
T,R,RC,V,JK,V,N,N,V
V,N,N,RC,V,T,V,JK,R
N,V,R,JK,V,RC,V,T,N
V,V,T,V,N,R,JK,RC,N
RC,JK,N,V,T,N,V,R,V
JK,RC,V,N,R,V,T,N,V
R,T,V,N,V,JK,N,V,RC
N,N,V,T,RC,V,R,V,JK
`

type CreateRole = (isMafia: boolean) => RolePart<unknown, unknown>

const mapping: Record<string, CreateRole> = {
	V: (isMafia) => (isMafia ? new Goon() : new VanillaTownie()),
	T: () => new Tracker({ singleAction: true }),
	JK: () => new JailKeeper({ singleAction: true }),
	RC: () => new RoleCop({ singleAction: true }),
	R: () => new Roleblocker({ singleAction: true }),
	N: () =>
		new Neighbour({
			channelName: "neighbours-chat",
			phase: "night",
		}),
}

const grid = setup
	.trim()
	.split("\n")
	.map((line) =>
		line
			.split(",")
			.map((ch) => ch.trim())
			.map((ch) => {
				if (!(ch in mapping)) throw new Error(ch)
				return mapping[ch]
			})
	)

const createSetup = (row: number, column: number): RoleInfo[] => {
	const mafia = [grid[row][column], grid[row + 4][column], grid[row][column + 4], grid[row + 4][column + 4]]
	const town = []
	for (let i = 1; i <= 3; i++) {
		town.push(grid[row][column + i])
		town.push(grid[row + i][column])
		town.push(grid[row + 4][column + i])
		town.push(grid[row + i][column + 4])
	}
	const createRole = (isMafia: boolean) => (mapping: CreateRole) =>
		createRoleInfo(isMafia ? new BasicMafia({ singleAction: true }) : new Town(), mapping(isMafia))

	const mafiaRoles = mafia.map(createRole(true))
	const townRoles = town.map(createRole(false))
	const sk = createRoleInfo(new SerialKiller())

	console.log(`Phistomefel Setup: c=${column + 1},r=${row + 1}`)
	console.log("Phistomefel Mafia Roles: " + mafiaRoles.map((r) => new MergedRole(r).getName(false)).join(", "))
	console.log("Phistomefel Town Roles: " + townRoles.map((r) => new MergedRole(r).getName(false)).join(", "))

	return [...mafiaRoles, ...townRoles, sk]
}

const randomInteger = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const gameAssign: GameAssignScript = (config) => {
	const row = randomInteger(0, 4)
	const column = randomInteger(0, 4)

	const setup = createSetup(row, column)

	return {
		...config,
		roles: setup,
		flavour: "phistomefel",
	}
}

export default gameAssign
