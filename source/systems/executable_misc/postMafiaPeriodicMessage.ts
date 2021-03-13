import Game from "../game_templates/Game"
import pinMessage from "./pinMessage"

export = async (game: Game): Promise<void> => {
	const mafiaChannel = game.channels["mafia"]
	if (!mafiaChannel) {
		return
	}
	const channel = game.getChannel("mafia")

	const mafia = game.exists((x) => x.see_mafia_chat === true && x.isAlive())

	if (mafia) {
		const message = await channel.send(
			"~~                                              ~~    **" + game.getFormattedDay() + "**"
		)
		await pinMessage(message)
	}
}
