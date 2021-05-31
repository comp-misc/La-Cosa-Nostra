import { createNameCommand } from "../createCommands"

export default createNameCommand("triggered", "When you get triggered", [
	":face_with_symbols_over_mouth: %sender% just got triggered by %name%!",
])
