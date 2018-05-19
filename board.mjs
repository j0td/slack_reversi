import Canvas from 'canvas'

export default class Board {
  constructor() {
    this.squares = new Array(8)
    for(var y = 0; y < 8; y ++) {
      this.squares[y] = new Array(8).fill(0)
    }
    this.squares[3][3] = 2
    this.squares[4][4] = 2
    this.squares[3][4] = 1
    this.squares[4][3] = 1

    this.canPut = []

    this.canvas = new Canvas(140, 140)
    this.ctx = this.canvas.getContext('2d')
    this.ctx.font = '10px arial, sans-serif'
  }

  put(player, square) {
    // Divide string to x, y
    let x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].indexOf(square.substr(0, 1))
    let y = parseInt(square.substr(1, 1)) - 1

    // Validation
    if (this.canPut.indexOf(square) === -1) {
      return false
    }

    // Put
    this.squares[x][y] = player

    // Reverse all direction if can
    if (this.check(player, x, y, -1, -1)) {
      this.reverse(player, x, y, -1, -1)
    }
    if (this.check(player, x, y, 0, -1)) {
      this.reverse(player, x, y, 0, -1)
    }
    if (this.check(player, x, y, 1, -1)) {
      this.reverse(player, x, y, 1, -1)
    }
    if (this.check(player, x, y, -1, 0)) {
      this.reverse(player, x, y, -1, 0)
    }
    if (this.check(player, x, y, 1, 0)) {
      this.reverse(player, x, y, 1, 0)
    }
    if (this.check(player, x, y, -1, 1)) {
      this.reverse(player, x, y, -1, 1)
    }
    if (this.check(player, x, y, 0, 1)) {
      this.reverse(player, x, y, 0, 1)
    }
    if (this.check(player, x, y, 1, 1)) {
      this.reverse(player, x, y, 1, 1)
    }
  }

  reverse(player, x, y, vecX, vecY) {
    x += vecX
    y += vecY

    while (this.squares[x][y] !== player) {
      this.squares[x][y] = player

      x += vecX
      y += vecY
    }
  }

  checkCanPut(player) {
    this.canPut = []

    for(var x = 0; x < 8; x ++) {
      for(var y = 0; y < 8; y ++) {
        if (this.squares[x][y] === 0) {
          // Check all direction
          if (this.check(player, x, y, -1, -1)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          } else if (this.check(player, x, y, 0, -1)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          } else if (this.check(player, x, y, 1, -1)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          } else if (this.check(player, x, y, -1, 0)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          } else if (this.check(player, x, y, 1, 0)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          } else if (this.check(player, x, y, -1, 1)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          } else if (this.check(player, x, y, 0, 1)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          } else if (this.check(player, x, y, 1, 1)) {
            this.canPut.push(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x] + (y + 1))
          }
        }
      }
    }
  }

  check(player, x, y, vecX, vecY) {
    // Check around
    x += vecX
    y += vecY

    // Validation
    if (x < 0 || x > 7 || y < 0 || y > 7 || this.squares[x][y] === player || this.squares[x][y] === 0) {
      return false
    }

    // Check next
    x += vecX
    y += vecY

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (this.squares[x][y] === 0) {
        return false
      }
      if (this.squares[x][y] === player) {
        return true
      }
      x += vecX
      y += vecY
    }

    // Overflow
    return false
  }

  render() {
    this.ctx.fillStyle = '#ffffff'
    this.ctx.strokeStyle = '#333333'
    this.ctx.fillRect(0, 0, 140, 140)

    for(var x = 0; x < 8; x ++) {
      for(var y = 0; y < 8; y ++) {
        // Draw squares, numbers & alphabets
        this.ctx.fillStyle = '#333333'
        this.ctx.strokeRect(12 + 16 * x, 12 + 16 * y, 16, 16)
        this.ctx.fillText(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x], 17 + x * 16, 10)
        this.ctx.fillText(['1', '2', '3', '4', '5', '6', '7', '8'][y], 3, 23 + y * 16)

        // Draw pieces
        switch(this.squares[x][y]) {
          case 0:
            break
          case 1:
            this.ctx.beginPath()
            this.ctx.arc(20 + 16 * x, 20 + 16 * y, 6, 0, Math.PI * 2, true)
            this.ctx.fill()
            break
          case 2:
            this.ctx.beginPath()
            this.ctx.arc(20 + 16 * x, 20 + 16 * y, 6, 0, Math.PI * 2, true)
            this.ctx.stroke()
            break
        }
      }
    }

    return this.canvas.toDataURL().split(',')[1]
  }
}