const schedule = require('node-schedule')
const query = require('./query')

// const rule = new schedule.RecurrenceRule()
// const times = [1, 11, 21, 31, 41, 51]
// rule.minute = times

function scheduleGetId() {
  schedule.scheduleJob('1 1 1-23 * * *', () => {
    query.insertGroupId()
  })
}

// console.log(getGroup.connectionDB)
query.connectionDB(async () => {
  console.log('连接成功')
  scheduleGetId()
})
