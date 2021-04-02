import { CommandUsageError, ConsoleCommand } from "../CommandType"
import makeCommand from "../makeCommand"
import getGuild from "../../getGuild"
import { PermissionsConfig } from "../../LcnConfig"

const ranks: ConsoleCommand = async (client, config, params) => {
	if (params.length != 3) {
		throw new CommandUsageError()
	}
	const guild = getGuild(client)
	const action = params[0].toLowerCase()
	if (action !== "add" && action !== "remove") {
		throw new CommandUsageError("Unknown action '" + params[0] + "'")
	}
	const roleName = config.permissions[params[1] as keyof PermissionsConfig]
	if (!roleName) {
		console.error("Unknown role '" + params[1] + "'")
		return
	}
	const role = guild.roles.cache.find((role) => role.name === roleName)
	if (!role) {
		console.error("No role defined for " + params[1] + " (" + roleName + ")")
		return
	}
	const member = guild.members.cache.get(params[2])
	if (!member) {
		console.error("Unknown user '" + params[2] + "'")
		return
	}
	if (action === "add") {
		await member.roles.add(role)
		console.log("Done!")
	} else if (action === "remove") {
		await member.roles.remove(role)
		console.log("Done!")
	}
}

export default makeCommand(ranks, {
	name: "ranks",
	description: "Set ranks in the server",
	usage: "roles <add | remove> <role> <player id>",
	aliases: ["roles"],
})
