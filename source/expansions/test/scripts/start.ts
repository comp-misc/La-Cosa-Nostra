import { StartScript } from "../../../Expansion"

const start: StartScript = (config) => {
	return {
		...config,
		playing: {
			...config.playing,
			players: "abcd",
		},
		game: {
			...config.game,
			playersNeeded: 4,
		},
	}
}

export default start
