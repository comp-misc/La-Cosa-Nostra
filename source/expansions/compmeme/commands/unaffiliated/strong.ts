import { createSelfCommand } from "../createCommands"

export default createSelfCommand("strong", "When you think it's strong", [
	"%sender% thinks that's **strong and stable**",
])
