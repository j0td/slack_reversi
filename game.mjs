import fs from 'fs'

export default class game {
  constructor() {
    this.state = 'notplay'
    this.p1 = {}
    this.p2 = {}
    this.board = {}
  }

  saveTemp(b64string) {
    return new Promise((resolve, reject) => {
      let buffer = new Buffer(b64string, 'base64')
      fs.writeFile('./temp_board.png', buffer, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  }

  async makeImg() {
    await this.saveTemp(this.board.render())

    const fileObject = {
      file: fs.createReadStream('./temp_board.png'),
      filename: 'board.png',
      title: 'board'
    }
  
    return fileObject
  }
}