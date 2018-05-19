import fs from 'fs'

export default class game {
  constructor() {
    this.state = 'notplay'
    this.turn = 1
    this.p1 = {}
    this.p2 = {}
    this.board = {}
    this.passed = 0
  }

  progress(bot, message) {
    this.turn = this.turn === 1 ? 2 : 1

    if (this.passed > 0) {
      bot.reply(message, `パス！`)
    }

    if (game.turn === 1) {
      bot.reply(message, `${game.p1.name}さん（黒）の番です`)
    } else {
      bot.reply(message, `${game.p2.name}さん（白）の番です`)
    }

    this.board.checkCanPut(this.turn)

    if (this.board.canPut.length > 0) {
      this.makeImg().then((fileObject) => {
        let messageObj = fileObject
        messageObj.channels = message.channel
    
        bot.api.files.upload(messageObj, (err, res) => {
          if (err) console.log(err)
        })
      })
    } else {
      if (this.passed === 0) { // pass
        this.passed += 1
  
        this.progress(bot, message)
      } else {
        this.end(bot, message)
      }
    }
  }

  end(bot, message) {
    this.makeImg().then((fileObject) => {
      let messageObj = fileObject
      messageObj.channels = message.channel
  
      bot.api.files.upload(messageObj, (err, res) => {
        if (err) console.log(err)
      })
    })

    let allPiece = this.board.squares.reduce((pre,current) => {pre.push(...current); return pre}, [])
    let black = allPiece.filter(piece => piece === 1)
    let white = allPiece.filter(piece => piece === 2)

    bot.reply(message, `黒 : ${black.length}個\n白 : ${white.length}個`)
    if (black.length > white.length) {
      bot.reply(message, `${this.p1.name}さん（黒）の勝利！`)
    } else if (black.length < white.length) {
      bot.reply(message, `${this.p2.name}さん（白）の勝利！`)
    } else {
      bot.reply(message, '引き分けです！')
    }

    this.state = 'notplay'
    this.turn = 1
    this.p1 = {}
    this.p2 = {}
    this.board = {}
    this.passed = 0
  }

  surrender(player) {
    // Unimplemented
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