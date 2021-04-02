import { EmojiData } from "../LcnConfig"

const formatEmoji = (emoji: EmojiData): string => `<:${emoji.name}:${emoji.id}>`

export default formatEmoji
