import Player from "../../game_templates/Player"
import texts from "./text/texts"

export = async (player: Player): Promise<void> => {
	let message = texts.win_message

	message = message.replace(new RegExp("{@player}", "g"), "<@" + player.id + ">")

	await player.getPrivateChannel().send(message)
}
