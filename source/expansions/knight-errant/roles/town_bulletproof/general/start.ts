import { RoleStart } from "../../../../../systems/Role"

const start: RoleStart = (player) => player.addAttribute("protection", Infinity, { amount: 1 })

export default start
