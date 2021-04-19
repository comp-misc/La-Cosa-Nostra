import { createCanvas, Image } from "canvas"

type Position = [number, number]

const generateRoleCard = async (
	role: string,
	roleCardTemplate: Image,
	drawPosition: Position = [190, 225]
): Promise<Buffer> => {
	const canvas = createCanvas(roleCardTemplate.width, roleCardTemplate.height)
	const ctx = canvas.getContext("2d")
	ctx.drawImage(roleCardTemplate, 0, 0)
	ctx.font = "bold 54px Arial"
	ctx.fillStyle = "bol"
	ctx.fillStyle = "black"
	ctx.fillText(role, drawPosition[0], drawPosition[1])

	const pngStream = canvas.createPNGStream()
	const chunks: Uint8Array[] = []
	for await (const chunk of pngStream) {
		chunks.push(chunk)
	}
	return Buffer.concat(chunks)
}

export default generateRoleCard
