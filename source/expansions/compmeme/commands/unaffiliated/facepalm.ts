import { createSelfCommand } from "../createCommands"

export default createSelfCommand("facepalm", "Take the face to the palm!", [
	":facepalm: %sender% just took the face, to the palm!",
	":facepalm: %sender% just facepalmed!",
])
