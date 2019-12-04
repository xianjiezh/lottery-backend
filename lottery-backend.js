/* eslint-disable no-undef */
const express = require('express')

const bodyParser = require('body-parser')

const sql = require('./utils/db')

const PORT = 5234

global.log = console.log.bind(console)


const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// 找到当前数据库中获奖的种类和比例
// let currentFisrtPrize1 = 0
// let currentFisrtPrize2 = 0
// let currentSecondPrize1 = 0
// let currentSecondPrize2 = 0
// let currentThirdPrize1 = 0
// let currentThirdPrize2 = 0

const currentPrizeCount = [0, 0, 0, 0, 0, 0]

for (let i = 0; i < 6; i++) {
  sql('SELECT count(*) FROM lottery WHERE prize_level = ?', [i + 1])
  .then(result => {
    currentPrizeCount[i] = (result[0]['count(*)'])
  })
}



const firstMax1 = 50
const secondMax1 = 250
const thirdMax1 = 1500
const firstMax2 = 50
const secondMax2 = 250
const thirdMax2 = 1500



const totalMaxPrizePeople = firstMax1 + secondMax1 + thirdMax1 + firstMax2 + secondMax2 + thirdMax2

const total = 30000

// 一等奖中奖几率
const firstPrizeChance = firstMax1 / total
// 二等奖中奖几率
const secondPrizeChance = secondMax1 / total
// 三等奖中奖几率
const thirdPrizeChance = thirdMax1 / total

app.get('/lottery', async (req, res) => {

  const random = Math.random()
  let prizeLevel
  // 总的递归次数
  let recusiveTimes = 0
  function findUserPrizeLevel(random) {
    if (recusiveTimes >= 5) {
      // 防止到后面递归次数太多
      // 超过 5 次都中奖了，但是那个奖品都没有了
      // 恭喜你，你的运气不好，不给你发奖了
      prizeLevel = 0
      return 
    }
    recusiveTimes += 1
    // 总的获奖人数
    let totalPrizePeople = currentPrizeCount.reduce((temp, val) => {
      return temp += val
    }, 0)
    if (totalPrizePeople >= totalMaxPrizePeople) {
      // 奖全部都抽完了，就没得奖了
      prizeLevel = 0
      return 
    }
    if (
      random <= firstPrizeChance && 
      currentPrizeCount[0] < firstMax1
    ) {
      // 一等奖
      prizeLevel = 1
      return 
    } else if (
      random > firstPrizeChance && 
      random <= 2 * (firstPrizeChance) && 
      currentPrizeCount[3] < firstMax2
    ) {
      // 另一个一等奖
      prizeLevel = 4
      return 
    } else if (
      random > (2 * firstPrizeChance) &&
      random <= (2 * firstPrizeChance + secondPrizeChance) &&
      currentPrizeCount[1] < secondMax1
    ) {
      // 二等奖
      prizeLevel = 2
      return 
    } else if (
      random > (2 * firstPrizeChance + secondPrizeChance) &&
      random <= (2 * firstPrizeChance + 2 * secondPrizeChance) &&
      currentPrizeCount[4] < secondMax2
    ) {
      // 另一个二等奖
      prizeLevel = 5
      return 
    } else if (
      random > (2 * firstPrizeChance + 2 * secondPrizeChance) && 
      random <= (2 * firstPrizeChance + 2 * secondPrizeChance + thirdPrizeChance) &&
      currentPrizeCount[2] < thirdMax1
    ) {
      prizeLevel = 3
      return 
    } else if (
      random > (2 * firstPrizeChance + 2 * secondPrizeChance + thirdPrizeChance) &&
      random <= (2 * firstPrizeChance + 2 * secondPrizeChance + 2 * thirdPrizeChance) &&
      currentPrizeCount[5] < thirdMax2
    ) {
      prizeLevel = 6
      return 
    } else if (random > (2 * firstPrizeChance + 2 * secondPrizeChance + 2 * thirdPrizeChance)) {
      prizeLevel = 0
      return 
    } else {
      findUserPrizeLevel(random)
    }
    
  }
  findUserPrizeLevel(random)
  res.json({
    success: true,
    prizeLevel
  })

})


app.post('/info', async (req, res) => {
  const {
    prizeLevel,
    name,
    phone,
    address,
  } = req.body
  try {
    const result = await sql('SELECT * FROM lottery WHERE phone = ? limit 1', [phone])
    if (result.length === 0) {
      const p = {
        prize_level: prizeLevel,
        phone,
        name,
        address
      }
      sql('INSERT INTO lottery SET ?', p)
        .then(result => {
          currentPrizeCount[prizeLevel - 1] = currentPrizeCount[prizeLevel - 1] + 1
          res.json({
            success: true,
            message: '保存成功'
          })
        })
    } else {
      res.json({
        success: false,
        message: '您已领取奖品，不可再重复领取'
      })
    }
  } catch (e) {
    console.log(e )
  }
})



app.listen(PORT, () => {
  console.log('成功监听' + PORT + '端口')
})