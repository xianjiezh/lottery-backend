const axios = require('axios')


axios.defaults.baseURL = 'http://localhost:5234'

function fn1(params) {
  axios.get('/lottery').then(res => {
    console.log(res.data.prizeLevel)
  })
}



function fn2(params) {
  axios.post('/info', {
    prizeLevel: 1,
    name: '韩',
    phone: '13222222222',
    address: 'fanjkfanklfakl',
  })
}

let phone = 13000000000
async function fn3() {
  // 测试抽奖算法是否符合
  const { data: { prizeLevel } } = await axios.get('/lottery')
  phone = phone - 0 + 1
  await axios.post('/info', {
    prizeLevel,
    name: '韩',
    phone: phone,
    address: 'fanjkfanklfakl',
  })
}
let times = 0
let timer = setInterval(() => {
  fn3()
  times += 1
  console.log('times', times)
  if (times > 30000) {
    clearInterval(timer)
  }
}, 20)
