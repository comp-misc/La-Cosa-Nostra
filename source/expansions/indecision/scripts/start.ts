import { StartScript } from "../../../Expansion"
import { createPossibleRoles } from "./createRoles"

const start: StartScript = (config) => ({
	...config,
	game: {
		...config.game,
		playersNeeded: 17,
		lynch: {
			"top-voted-lynch": true,
			"top-voted-lynch-minimum-votes": 0,
			"tied-random": true,
			"allow-hammer": true,
			"no-lynch-option": true,
		},
	},
	messages: {
		...config.messages,
		name: "Indecision",
		"game-start":
			"**Welcome to Indecision**, a game that took several months to create because nobody made another setup",
		"opening-quote": "Lets hope the players aren't as indecisive as the hosts!",
	},
	playing: {
		...config.playing,
		flavour: "indecision",
		possibleRoles: createPossibleRoles(),
	},
	time: {
		...config.time,
		day: 24,
		night: 12,
	},
})

export default start
