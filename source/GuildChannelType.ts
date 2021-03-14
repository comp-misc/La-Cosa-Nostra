export type GuildChannelType = Exclude<keyof typeof ChannelType, "dm" | "group" | "unknown">
