import fs, { Stats } from "fs"

interface RecursiveFileFind {
	(directory: string, filter?: (path: string, stats: Stats) => boolean): string[]
	(directory: string, extensions?: string[]): string[]
}

const checkFileExtension = (file: string, extensions: string[]): boolean =>
	extensions.some((extension) => file.toLowerCase().endsWith("." + extension.toLowerCase()))

type OptionParam = ((path: string, stats: Stats) => boolean) | string[]
const recurse = (directory: string, result: string[], option?: OptionParam): void => {
	if (!fs.existsSync(directory)) {
		return
	}
	const stats = fs.lstatSync(directory)
	if (typeof option === "function" && !option(directory, stats)) {
		return
	}
	if (stats.isDirectory()) {
		fs.readdirSync(directory).forEach((child) => recurse(directory + "/" + child, result, option))
		return
	}
	if (option && option instanceof Array && !checkFileExtension(directory, option)) {
		return
	}
	result.push(directory)
}

const recursiveFileFind: RecursiveFileFind = (directory: string, option?: OptionParam) => {
	const result: string[] = []
	recurse(directory, result, option)
	return result
}

export = recursiveFileFind
