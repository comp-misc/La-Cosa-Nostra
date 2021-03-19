import { AdminCommand } from "../CommandType"

const disconnect: AdminCommand = async (message) => {
	await message.channel.send(
		":desktop: Disconnecting client... may attempt reconnection if `auto-reconnect` is set to true."
	)

	message.client.destroy()
}

export = disconnect
