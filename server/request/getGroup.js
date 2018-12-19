require('babel-register')

const request = require('request')
const mongoose = require('mongoose')
const configDefault = require('../../config/config.default').default

const app = {}
const config = configDefault.mongoose
const groupListUrl = "https://pan.baidu.com/mbox/msg/historysession"
const groupListUser = "https://pan.baidu.com/mbox/group/listuser"

// Cookie不能换行，否则会出现编码问题
const Cookie = `BAIDUID=BE3B8A12B7775C150691B9C80BA683E3:FG=1;PSTM=1543926436BIDUPSID=2278F8AB3E39006F6B493CF41C5E2074;BDUSS=GZJT0JmRzB3TmRBT3BrRGtCbGpMNEl6QjhIRHlwbFlsQTlLeHV0S2RMRFJBUzVjQVFBQUFBJCQAAAAAAAAAAAEAAAAOf4M~y-TDzs7ez-sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANF0BlzRdAZce;BDSFRCVID=42-OJeC627gT7PJ93AlnUqAdKBEEvz3TH6aoulRMYU_MAuqDkrlsEG0PjU8g0KubbbIiogKK0mOTHv-F_2uxOjjg8UtVJeC6EG0P3J;H_BDCLCKID_SF=tJPfoK8XJK83fP36q46tMKCShUFstTDLB2Q-5KL-Jb3xMUJ_ejbNh-CAKtQbBMj436cEoMbdJJjofJR-XqrlBUuF5qQRabjQ-2TxoUJ_QCnJhhvG-45DytFebPRiJPr9QgbqslQ7tt5W8ncFbT7l5hKpbt-q0x-jLn7ZVJO-KKCKMDK4DMK;H_PS_PSSID=1421_21089_28019_26350_27751_27244_27542;delPer=0;PSINO=1;PANWEB=1;STOKEN=1e1b172b70fd52240bc9379fbde60eaab25c1e950aa5a1c3662f9cff0b7edd04;SCRC=f875829b5a354ee7fff65543853ff5c3;Hm_lvt_7a3960b6f067eb0085b7f96ff5e660b0=1543545524,1544522863;Hm_lpvt_7a3960b6f067eb0085b7f96ff5e660b0=1544522863;PANPSC=13209288732822932551%3AzKsuZfKzYZNDq8nNHZKF6un90oj%2BY%2FIsWNqhd0KbKnJEqM%2F3IgPFBeMBPHhdrtQsSrvFsiwiy%2BHrl7yf4dAZY04sVpe%2BKsgswW3bk5Zv5j7XG9GmBZpeFcwcVuRerGYPP9MHvdN9SJioEno4K01xOgfhBsDHPTy3ePth2nAgN8k7LpLTMOoLpffsbJHGVn%2BX8KSTqGvGNRuNxnsOGT0GjNR4Y0ybk%2FFgsHHN9wux3JA%3D`

app.mongoose = mongoose
mongoose.Promise = global.Promise

const groupInfoModel = require('../model/group_info')(app)

const self = {
  t: new Date() * 1000,
  bdstoken: "235092399cfaa54552fe0b7d46219527",
  channel: "chunlei",
  web: 1,
  app_id: 250528,
  logid: "MTU0NTIwNjk5MDcwMTAuOTQwMjI2OTAzMDIzMjIyNg==",
  clienttype: 0,

}
const headers = {
  'Host': "pan.baidu.com",
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cache-Control': 'max-age=0',
  'Referer': 'https://pan.baidu.com/mbox/homepage',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
  'Cookie': Cookie
}
function getGroupList() {
  return new Promise((resolve, reject) => {
    request({
      method: "GET",
      url: groupListUrl,
      json: true,
      headers: headers
    }, (err, response, body) => {
      err ? reject(err) : resolve(body)
    })
  })
}

async function insertGroupId(db) {
  let groupList = await getGroupList()
  if (groupList['errno'] == 0) {
    for (const [index, value] of groupList.records.entries()) {
      let grouplen = await db.collection('groupinfo').find({ 'group_id': value['gid'] }).count()
      if (grouplen == 0) {
        await db.collection('groupinfo').insert({ "name": value['name'], "group_id": value['gid'] })
        console.log('insert group_id:' + value['gid'])
      } else {
        console.log('group_id is true')
      }
    }
  } else {
    console.error(groupList['request_id'])
  }
}

async function getGroupInfo(conditions) {
  return new Promise((resolve, reject) => {
    request({
      method: "GET",
      url: groupListUser,
      json: true,
      headers: headers,
      qs: Object.assign(self, conditions),
    }, (err, response, body) => {
      err ? reject(err) : resolve(body)
    })
  })
}

mongoose.connect(config.url, config.options);

const db = mongoose.connection

db.on('connected', async () => {
  console.log('连接成功')
  const group = await groupInfoModel.find({}).lean()

  for (const [index, value] of group.entries()) {
    const groupInfo = await getGroupInfo({
      gid: value.group_id,
      limit: 50,
    })
    if (groupInfo['errno'] == 0) {
      console.log(groupInfo.count,groupInfo.records[0].uname,groupInfo.records[0].nick_name)
    } else {
      console.error(groupInfo['request_id'])
    }
  }

  process.exit()
})

