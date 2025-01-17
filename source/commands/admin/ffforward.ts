import { getTimer, hasTimer } from "../../getTimer"
import { AdminCommand } from "../CommandType"
import makeCommand from "../makeCommand"

const forceFastForward: AdminCommand = async (message) => {
	if (!hasTimer() || !["playing"].includes(getTimer().game.state)) {
		await message.channel.send(":x: No game in progress.")
		return
	}

	const game = getTimer().game

	await message.channel.send("Force fastforwarding...")
	await game.fastforward()
	await message.channel.send(":ok: Force fastforwarding completed")
}

export default makeCommand(forceFastForward, {
	name: "forcefastforward",
	description: "Forces a fast forward of the night",
	aliases: ["ffforward"],
})
