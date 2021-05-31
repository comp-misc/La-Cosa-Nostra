import fs from "fs"
import crypto from "crypto"
import { AdminCommand } from "../CommandType"
import recursiveFileFind from "../../auxils/recursiveFileFind"

const main_dir = __dirname + "/../../../"

let ignore = ["configuration/", ".git"]

if (fs.existsSync(main_dir + ".gitignore")) {
	const gitignore_options = fs
		.readFileSync(main_dir + ".gitignore", "utf8")
		.split("\n")
		.filter((x) => !x.startsWith("#") && x !== "")

	ignore = ignore.concat(gitignore_options)
}

const cycle = (directory: string) => (fs.existsSync(directory) ? recursiveFileFind(directory, ["js", "ts"]) : [])

const escapeRegExp = (string: string) => string.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace("*", "(.*?)") // $& means the whole matched string

const hash_type = "sha256"

const hashcheck: AdminCommand = async (message, params) => {
	const hash = crypto.createHash(hash_type)

	let addendum = String()
	if (params.length > 0) {
		const additional_directory = params.join(" ")
		addendum =
			additional_directory
				.replace("\\", "/")
				.substring(
					additional_directory.startsWith("/") ? 1 : 0,
					additional_directory.length - (additional_directory.endsWith("/") ? 1 : 0)
				) + "/"
	}

	let directories = cycle(main_dir + addendum).map((x) => x.substring(x.indexOf("//") + 1))
	ignore.forEach((toIgnore) => {
		const regex = new RegExp(escapeRegExp(toIgnore), "g")
		directories = directories.filter((x) => !regex.test(x))
	})

	directories.forEach((directory) => {
		const file = fs.readFileSync(main_dir + addendum + directory)
		hash.update(addendum + directory)
		hash.update(file)
	})

	const output = hash.digest("hex")

	await message.channel.send(
		":hash: The code's output `" +
			hash_type +
			"` hash (excluding `.gitignore`'d options and `configuration/`) is:\n```fix\n" +
			hash_type +
			"-" +
			output +
			"```"
	)
}

export default hashcheck
