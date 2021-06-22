import { StartScript } from "../../../Expansion"
import override from "./override.json"

const start: StartScript = (config) => ({
	...config,
	game: override.game,
	messages: override.messages,
	playing: {
		...config.playing,
		flavour: "the_circus",
	},
	time: {
		...config.time,
		day: 30,
		night: 24,
	},
})

export default start
