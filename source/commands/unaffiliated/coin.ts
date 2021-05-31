import { UnaffiliatedCommand } from "../CommandType"

const coin: UnaffiliatedCommand = async (message) => {
	const output = Math.round(Math.random() * 100)

	if (output < 49) {
		await message.channel.send(":money_with_wings: The coin landed on tails!")
	} else if (output >= 51) {
		await message.channel.send(":money_with_wings: The coin landed on heads!")
	} else if (output === 49) {
		await message.channel.send(":star: The coin landed vertically!")
	} else {
		const dudes = message.guild.members.cache.array()

		const random_dude = dudes[Math.floor(Math.random() * dudes.length)]

		await message.channel.send(":star: The coin landed on " + random_dude.user.username + "'s head!")
	}
}

export default coin
