const remarks = [
	"What are you even thinking?",
	"Are you joking me?",
	"Like, what?",
	"C'mon dude.",
	"Do you understand stuff bruh.",
	"*Facepalm*.",
	"Eyaaaaah.",
	"Wut.",
	"Really, dude?",
	"Seriously? Are you trying that.",
]

const sarcasm = (prepend_space = false): string => {
	const index = Math.floor(Math.random() * remarks.length)

	return prepend_space ? " " + remarks[index] : remarks[index]
}

export = sarcasm
