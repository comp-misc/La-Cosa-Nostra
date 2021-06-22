import { createCanvas, Image } from "canvas"

type Position = [number, number]

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

	const lines = role.split("\n")
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
