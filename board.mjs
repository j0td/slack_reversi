import Canvas from 'canvas'

export default class Board {
  constructor() {
    this.squares = new Array(8)
    for(var y = 0; y < 8; y ++) {
      this.squares[y] = new Array(8).fill(0)
    }
    this.squares[4][4] = 2
    this.squares[5][5] = 2
    this.squares[4][5] = 1
    this.squares[5][4] = 1

    this.canvas = new Canvas(128, 128)
    this.ctx = this.canvas.getContext('2d')
  }

  render() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.strokeStyle = '#333333'
    this.ctx.fillRect(0, 0, 128, 128)

    for(var x = 0; x < 8; x ++) {
      for(var y = 0; y < 8; y ++) {
        switch(this.squares[x][y]) {
          case 0:
            this.ctx.strokeRect(16 * x, 16 * y, 16, 16)
            break
          case 1:
            this.ctx.strokeRect(16 * x, 16 * y, 16, 16)
            this.ctx.fillStyle = '#333333'
            this.ctx.beginPath()
            this.ctx.arc(16 * x - 8, 16 * y - 8, 6, 0, Math.PI*2, true)
            this.ctx.fill()
            break
          case 2:
            this.ctx.strokeRect(16 * x, 16 * y, 16, 16)
            this.ctx.beginPath()
            this.ctx.arc(16 * x - 8, 16 * y - 8, 6, 0, Math.PI*2, true)
            this.ctx.stroke()
            break
        }
      }
    }

    return this.canvas.toDataURL().split(',')[1]
  }
}