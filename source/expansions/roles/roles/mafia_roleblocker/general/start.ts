// Executes BEFORE introduction
import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => player.addAttribute("mafia_factionkill")

export default start
