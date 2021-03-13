import { UnaffiliatedCommand } from "../CommandType"
import version from "../../Version"

const versionCmd: UnaffiliatedCommand = async (message) => {
	await message.channel.send(
		`:sunflower: This bot is running on **${version.updateName} Saviet Union Mafia ${version.version}**. The bot repository is located at <${version.homepage}>.`
	)
}

export = versionCmd
