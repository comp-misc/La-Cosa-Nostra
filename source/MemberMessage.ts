import { Guild, GuildMember, Message } from "discord.js"

export default interface MemberMessage extends Message {
	readonly member: GuildMember
	readonly guild: Guild
}
