import { createNameCommand } from "../createCommands"

export default createNameCommand("thanks", "Show something or someone appreciation for helping!", [
	"%sender% thanks %name%!",
])
