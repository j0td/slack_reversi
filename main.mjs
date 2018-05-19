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

// Help

controller.hears('ヘルプ', ['direct_mention', 'mention'], (bot,　message) => {
  bot.reply(message, `スタート : ゲーム開始\n着席 : ゲームに参加\n アルファベット+数字(ex : a1) : コマを置く`)
})


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

        // first turn
        bot.reply(message, `${game.p1.name}さん VS ${name}さん、試合開始！\n${game.p1.name}さん（黒）の番です`)
        game.state = 'playing'
        game.p2 = new Player(message.user, name)
        game.board = new Board()
        game.board.checkCanPut(game.turn)
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


// Put piece

controller.hears('^[a-h]{1}[1-8]{1}$', ['direct_mention', 'mention'], (bot,　message) => {
  // Validation
  if (game.state !== 'playing') {
    bot.reply(message, 'ゲームを開始してから駒を置きましょうね。')
    return
  } else if ((game.turn === 1 && game.p2.id === message.user) || (game.turn === 2 && game.p1.id === message.user)) {
    bot.reply(message, 'あなたの番じゃありません！')
    return 
  } else if (game.p1.id !== message.user && game.p2.id !== message.user) {
    bot.reply(message, 'あなたは誰ですか！？')
    return
  }

  // Put
  if (game.board.put(game.turn, message.text) === false) {
    bot.reply(message, 'そこには置けません！')
  } else {
    game.progress(bot, message)
  }
})