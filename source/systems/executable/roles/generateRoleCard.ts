import { createCanvas, Image } from "canvas"

type Position = [number, number]

const splitIntoLines = (text: string, maxLength: number): string[] => {
	const result: string[][] = []
	let currentArr: string[] = []
	for (const word of text.split(" ").reverse()) {
		if (currentArr.length > 0 && [...currentArr, word].join(" ").length > maxLength) {
			result.push(currentArr)
			currentArr = []
		}
		currentArr.push(word)
	}
	if (currentArr.length > 0) {
		result.push(currentArr)
	}
	return result.map((arr) => arr.reverse().join(" ")).reverse()
}

const generateRoleCard = async (
	role: string,
	roleCardTemplate: Image,
	drawPosition: Position = [180, 225]
): Promise<Buffer> => {
	const canvas = createCanvas(roleCardTemplate.width, roleCardTemplate.height)
	const ctx = canvas.getContext("2d")
	ctx.drawImage(roleCardTemplate, 0, 0)
	ctx.font = "bold 54px Arial"
	ctx.fillStyle = "bol"
	ctx.fillStyle = "black"
	const lines = splitIntoLines(role, 15)
	for (let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i].trim(), drawPosition[0], drawPosition[1] - (lines.length - 1 - i) * 54)
	}

	const pngStream = canvas.createPNGStream()
	const chunks: Uint8Array[] = []
	for await (const chunk of pngStream) {
		chunks.push(chunk)
	}
	return Buffer.concat(chunks)
}

export default generateRoleCard
