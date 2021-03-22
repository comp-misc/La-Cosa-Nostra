import fs from "fs"

const texts = fs.readdirSync(__dirname)

const ret: Record<string, string> = {}
texts
	.filter((text) => text.toLowerCase().endsWith(".txt"))
	.forEach((text) => {
		const key = text.substring(0, text.length - 4)
		ret[key] = fs.readFileSync(__dirname + "/" + text, "utf8")
	})

export = ret
