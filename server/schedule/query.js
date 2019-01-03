require('babel-register')

const request = require('request')
const mongoose = require('mongoose')
const configDefault = require('../../config/config.default').default

const app = {}
const config = configDefault.mongoose
const adminName = '虽梦无想'
const groupListUrl = 'https://pan.baidu.com/mbox/group/list' // 获取群组
const groupListUser = 'https://pan.baidu.com/mbox/group/listuser' // 获取群组成员
const groupInvite = 'https://pan.baidu.com/mbox/group/invite' // 获取邀请链接
const createGroupUrl = 'https://pan.baidu.com/mbox/group/specialcreate' // 创建群组

// https://pan.baidu.com/mbox/relation/getfollowlist 好友列表
// https://pan.baidu.com/mbox/msg/historysession 历史消息列表
// https://pan.baidu.com/mbox/group/setinfo // 修改群组名称
// Cookie不能换行，否则会出现编码问题
const Cookie = 'PSTM=1543926436; BIDUPSID=2278F8AB3E39006F6B493CF41C5E2074; BDSFRCVID=42-OJeC627gT7PJ93AlnUqAdKBEEvz3TH6aoulRMYU_MAuqDkrlsEG0PjU8g0KubbbIiogKK0mOTHv-F_2uxOjjg8UtVJeC6EG0P3J; H_BDCLCKID_SF=tJPfoK8XJK83fP36q46tMKCShUFstTDLB2Q-5KL-Jb3xMUJ_ejbNh-CAKtQbBMj436cEoMbdJJjofJR-XqrlBUuF5qQRabjQ-2TxoUJ_QCnJhhvG-45DytFebPRiJPr9QgbqslQ7tt5W8ncFbT7l5hKpbt-q0x-jLn7ZVJO-KKCKMDK4DMK; PANWEB=1; BAIDUID=2E52A18DA65353563C38F1BBDF288453:FG=1; Hm_lvt_7a3960b6f067eb0085b7f96ff5e660b0=1545200623,1546285656,1546285905,1546359707; H_PS_PSSID=1420_21111_28206_28132_28140_27508; BDUSS=0yUHNIRjh2RWlMRkJGQlZUMTVoZEdOa2szU0RmdkRJdXlmQ2phUjUxeEtTVlJjQVFBQUFBJCQAAAAAAAAAAAEAAAAOf4M~y-TDzs7ez-sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEq8LFxKvCxcSm; pan_login_way=1; STOKEN=481f1bb494abc4da4fc6fd117fdf41e2087b4aa7ad6ea6c6df9d36e1374f453c; SCRC=5f5df3852718d2a53231f4864ea1cb54; Hm_lpvt_7a3960b6f067eb0085b7f96ff5e660b0=1546445782; delPer=0; PSINO=1; PANPSC=11655166649491958421%3A%2B81kGQfJNqXqMiWBsG4D0SOAoXNFwReXTw3oScwlIJCCdpPoY78V5b1DTur%2BOjgbfmTzsKPDskPo7luKrDcIFcH2QfqZNAKQKP9j4PLgK4VUMSLhYBPCxRose%2F5XgyZWOy6S0zDqC6X99sx6EOtRkKgSejgrTXE6a19YJPdh2KmiuJ8uaLAXNq1b2FM%2FSv6FW%2Bc%2FO5D6YMc2Bl8lhjGFq6K4ny5osBc2rVvYUz9K%2FoVb5z87kPpgx54sgJofQPv6'

app.mongoose = mongoose
mongoose.Promise = global.Promise

const groupInfoModel = require('../model/group_info')(app)

const self = {
  t: new Date() * 1000,
  bdstoken: '75cd56a7351c1ca7a343a960d4b6b4ac',
  channel: 'chunlei',
  web: 1,
  app_id: 250528,
  logid: 'MTU0NjQ0ODQ5NzcxMTAuMjIyMzg0OTYyODMzOTExMTg=',
  clienttype: 0,
  check: 20160325,
}
const headers = {
  'Host': 'pan.baidu.com',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.8',
  'Cache-Control': 'max-age=0',
  'Referer': 'https://pan.baidu.com/mbox/homepage',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80 Safari/537.36',
  'Cookie': Cookie,
}

function parseParam(param, key) {
  var paramStr = ''
  if (param instanceof String || param instanceof Number || param instanceof Boolean) {
    paramStr += `&${key}=${encodeURIComponent(param)}`
  } else {
    // $.each(param, function (i) {
    //   var k = key == null ? i : key + (param instanceof Array ? `[${i}]` : `.${i}`)
    //   paramStr += `&${parseParam(this, k)}`
    // })
    // primitive https://www.jianshu.com/p/9319e39dae0f
    let t = function () {
      return this
    }
    // 通过call返回参数类型对象内部的原始值 [[PrimitiveValue]]
    Object.keys(param).forEach((i) => {
      var k = key == null ? i : key + (param instanceof Array ? `[${i}]` : `.${i}`)
      paramStr += `&${parseParam(t.call(param[i]), k)}`
    })
  }
  return paramStr.substr(1)
}

function createGroup() {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      url: createGroupUrl,
      json: true,
      headers: headers,
      qs: Object.assign(self, {
        user_list: [],
      }),
    }, (err, response, body) => {
      console.log(err)
      console.log(body)
      err ? reject(err) : resolve(body)
    })
  })
}

// createGroup()

function getGroupList(conditions) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      url: groupListUrl,
      json: true,
      headers: headers,
      qs: Object.assign(self, conditions),
    }, (err, response, body) => {
      err ? reject(err) : resolve(body)
    })
  })
}

async function insertGroupId() {
  console.log('get group list start')
  await groupInfoModel.deleteMany({})
  console.log('remove groupInfoModel')
  let groupList = await getGroupList({
    start: 0,
    limit: 200,
    type: 1,
  })
  if (groupList['errno'] === 0) {
    await Promise.all(groupList.records.map(async (value) => {
      let grouplen = await groupInfoModel.find({
        group_id: value['gid'],
      }).countDocuments()
      if (grouplen === 0) {
        await groupInfoModel.create({
          name: value['name'],
          group_id: value['gid'],
          uname: value['uname'],
        })
        // console.log(`insert group_id:${value['gid']}`)
      } else {
        console.error('group_id is already')
      }
    }))
  } else {
    console.error(groupList)
  }
  console.log('get group list end')
}

async function getGroupInfo(conditions) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      url: groupListUser,
      json: true,
      headers: headers,
      qs: Object.assign(self, conditions),
    }, (err, response, body) => {
      err ? reject(err) : resolve(body)
    })
  })
}

function getGroupInvite(conditions) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      url: groupInvite,
      json: true,
      headers: headers,
      qs: Object.assign(self, conditions),
    }, (err, response, body) => {
      err ? reject(err) : resolve(body)
    })
  })
}

async function insertGroupInfo() {
  console.log('get group info start')
  const group = await groupInfoModel.find({}).lean()
  await Promise.all(group.map(async (value) => {
    let groupInfo = await getGroupInfo({
      gid: value.group_id,
      limit: 50,
    })
    let groupInvite = await getGroupInvite({
      gid: value.group_id,
    })
    let update = {}

    if (groupInfo['errno'] === 0) {
      update.people_count = groupInfo.count
      console.log(groupInfo.records[0].uname)
      console.log(groupInfo.records[0].uname === adminName)
      if (groupInfo.records[0].uname === adminName) {
        update.is_admin = true
      }
    } else {
      console.error(`groupInfo ${groupInfo}`)
    }
    if (groupInvite['errno'] === 0) {
      update.group_link = groupInvite.link
    } else {
      console.error(`groupInvite ${groupInvite}`)
    }

    await groupInfoModel.updateOne({
      group_id: value.group_id,
    }, update)
  }))
  console.log('get group info end')
}

mongoose.connect(config.url, config.options)

function connectionDB(connectedCb) {
  const db = mongoose.connection

  db.on('connected', connectedCb)
}

// const db = mongoose.connection

// db.on('connected', async () => {
// await groupInfoModel.deleteMany({})
// console.log('remove groupInfoModel')
// await insertGroupId()
// await insertGroupInfo()
// })

const getGroup = {
  insertGroupId,
  insertGroupInfo,
  connectionDB,
}

module.exports = getGroup
