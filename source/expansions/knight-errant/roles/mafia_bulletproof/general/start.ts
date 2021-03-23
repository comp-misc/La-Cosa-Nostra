import { RoleStart } from "../../../../../systems/Role"

// Executes BEFORE introduction
const start: RoleStart = (player) => player.addAttribute("mafia_factionkill")

export default start
