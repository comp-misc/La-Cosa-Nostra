import resetNicks from "./resetNicks"
import deleteTimer from "./deleteTimer"
import deleteCaches from "../game_setters/deleteCaches"
import { Client } from "discord.js"
import { LcnConfig } from "../../LcnConfig"
import removeRoles from "./removeRoles"
import { setStatus } from "../../MafiaBot"

const reset = async (client: Client, config: LcnConfig): Promise<void> => {
	await deleteTimer()
	await resetNicks(client)
	await removeRoles(client, config)

	deleteCaches()

	await setStatus(client)
}

export default reset
