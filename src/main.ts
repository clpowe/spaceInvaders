import './style.css'
const canvas = document.querySelector<HTMLCanvasElement>('canvas')
if (!canvas) {
	console.error('Cannot find canvas')
} else {
	const c = canvas.getContext('2d')

	if (c) {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		class Player {
			position: { x: number; y: number } = { x: 0, y: 0 }
			velocity: { x: number; y: number }
			image: HTMLImageElement | undefined
			width: number = 0
			height: number = 0

			constructor() {
				this.velocity = {
					x: 0,
					y: 0
				}

				const image = new Image()
				image.src = './img/spaceship.png'
				image.onload = () => {
					const scale = 0.15
					this.image = image
					this.width = image.width * scale
					this.height = image.height * scale
					this.position = {
						x: canvas!.width / 2 - this.width / 2,
						y: canvas!.height - this.height - 20
					}
				}
			}

			draw() {
				if (c) {
					if (this.image) {
						c.drawImage(
							this.image,
							this.position.x,
							this.position.y,
							this.width,
							this.height
						)
					}
				}
			}
		}

		const player = new Player()

		function animate() {
			requestAnimationFrame(animate)
			if (c && canvas) {
				c.fillStyle = 'black'
				c.fillRect(0, 0, canvas.width, canvas.height)
			} else {
				console.error('Canvas not loaded')
			}
			player.draw()
		}

		animate()
	}
}
