import { createOtherCommand } from "../createCommands"

export default createOtherCommand("highfive", "Give someone a high five!", [
	":open_hands: %sender% has given %other% a high five!",
])
