import Discord from "discord.js"
import getAsset from "./getAsset"

export default (asset_name: string): Discord.MessageAttachment => {
	const data = getAsset(asset_name)
	return new Discord.MessageAttachment(data.data, data.name)
}
