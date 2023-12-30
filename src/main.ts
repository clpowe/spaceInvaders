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
			rotation: number = 0

			constructor() {
				this.velocity = {
					x: 0,
					y: 0
				}

				this.rotation = 0

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
					c.save()
					c.translate(
						player.position.x + player.width / 2,
						player.position.y + player.height / 2
					)
					c.rotate(this.rotation)

					c.translate(
						-player.position.x - player.width / 2,
						-player.position.y - player.height / 2
					)
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
				c!.restore()
			}

			update() {
				this.draw()
				this.position.x += this.velocity.x
			}
		}

		class Projectile {
			position: { x: number; y: number } = { x: 0, y: 0 }
			velocity: { x: number; y: number } = { x: 0, y: 0 }
			radius: number = 0

			constructor({
				position,
				velocity
			}: {
				position: { x: number; y: number }
				velocity: { x: number; y: number }
			}) {
				this.position = position
				this.velocity = velocity

				this.radius = 3
			}

			draw() {
				c!.beginPath()
				c!.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
				c!.fillStyle = 'red'
				c!.fill()
				c!.closePath()
			}

			update() {
				this.draw()
				this.position.x += this.velocity.x
				this.position.y += this.velocity.y
			}
		}

		const player = new Player()
		const projectiles: Projectile[] = []
		const keys = {
			a: {
				pressed: false
			},
			d: {
				pressed: false
			},
			space: {
				pressed: false
			}
		}

		function animate() {
			requestAnimationFrame(animate)
			if (c && canvas) {
				c.fillStyle = 'black'
				c.fillRect(0, 0, canvas.width, canvas.height)
			} else {
				console.error('Canvas not loaded')
			}
			player.update()
			projectiles.forEach((projectile, index) => {
				if (projectile.position.y + projectile.radius <= 0) {
					setTimeout(() => {
						projectiles.slice(index, 1)
					}, 0)
				} else {
					projectile.update()
				}
			})

			if (keys.a.pressed && player.position.x >= 0) {
				player.velocity.x = -7
				player.rotation = -0.15
			} else if (
				keys.d.pressed &&
				player.position.x + player.width <= canvas!.width
			) {
				player.velocity.x = 7
				player.rotation = 0.15
			} else {
				player.rotation = 0
				player.velocity.x = 0
			}
		}

		animate()

		addEventListener('keydown', ({ key }) => {
			switch (key) {
				case 'a':
					keys.a.pressed = true
					break
				case 'd':
					keys.d.pressed = true
					break
				case ' ':
					projectiles.push(
						new Projectile({
							position: {
								x: player.position.x + player.width / 2,
								y: player.position.y
							},
							velocity: { x: 0, y: -10 }
						})
					)
					break
			}
		})
		addEventListener('keyup', ({ key }) => {
			switch (key) {
				case 'a':
					keys.a.pressed = false
					break
				case 'd':
					keys.d.pressed = false
					break
				case ' ':
					keys.space.pressed = true
					break
			}
		})
	}
}
