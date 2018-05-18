////////////////////////////////////////
//             INITIALIZE             //
////////////////////////////////////////

// Import modules

import Botkit from 'botkit'

import Game from './game'
import Board from './board'
import Player from './player'


// Botkit

if (!process.env.token) {
  console.log('Error: Specify token in environment')
  process.exit(1)
}

const controller = Botkit.slackbot({
  debug: false
})

controller.spawn({
  token: process.env.token
}).startRTM((error) => {
  if (error) {
    throw new Error(error)
  }
})

// Game
const game = new Game()


////////////////////////////////////////
//                GAME                //
////////////////////////////////////////

// Start

controller.hears('スタート', ['direct_mention', 'mention'], (bot,　message) => {
  if (game.state === 'notplay') {
    bot.api.users.info({user: message.user}, (error, response) => { // Get name
      let name = response.user.real_name
      bot.reply(message, `ようこそ、${name}さん！対戦相手が着席するまでお待ち下さい。`)
      game.state = 'waiting'
      game.p1 = new Player(message.user, name)
    })
  } else {
    bot.reply(message, '対戦中に新しいゲームは始められません')
  }
})


// Sit as player2

controller.hears('着席', ['direct_mention', 'mention'], (bot,　message) => {
  if (game.state === 'waiting') {
    if (message.user !== game.p1.id) {
      bot.api.users.info({user: message.user}, (error, response) => { // Get name
        let name = response.user.real_name
        bot.reply(message, `${game.p1.name}さん VS ${name}さん、試合開始！`)
        game.state = 'playing'
        game.p2 = new Player(message.user, name)
        game.board = new Board()
        game.makeImg().then((fileObject) => {
          let messageObj = fileObject
          messageObj.channels = message.channel
      
          bot.api.files.upload(messageObj, (err, res) => {
            if (err) console.log(err)
          })
        })
      })
    } else {
      bot.reply(message, '一人でオセロ？寂しくないんですか？')
    }
  } else {
    bot.reply(message, '待機中の試合はありません')
  }
})

