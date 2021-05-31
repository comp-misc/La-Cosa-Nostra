import { createSelfCommand } from "../createCommands"

export default createSelfCommand("popcorn", "Time to grab the popcorn!", [
	":popcorn: %sender% just grabbed the popcorn",
])
