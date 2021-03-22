import { GameAssignScript } from "../../../Expansion"

const gameAssign: GameAssignScript = (playing) => ({
	...playing,
	roles: ["mafia", "villager", "villager"],
})

export = gameAssign
