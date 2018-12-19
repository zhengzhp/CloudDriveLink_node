require('babel-register')

const app = require('./server/app').default
const config = require('./config/config.default').default
const fs = require('fs');
const logConfig = require('./config/log_config');

const port = config.port

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
var confirmPath = function (pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr);
    console.log('createPath: ' + pathStr);
  }
}

/**
 * 初始化log相关目录
 */
var initLogPath = function () {
  //创建log的根目录'logs'
  if (logConfig.baseLogPath) {
    confirmPath(logConfig.baseLogPath)
    //根据不同的logType创建不同的文件目录
    for (const [key, value] of Object.keys(logConfig.appenders).entries()) {
      if (logConfig.appenders[value].path) {
        confirmPath(logConfig.baseLogPath + logConfig.appenders[value].path);
      }
    }
  }
}
initLogPath();

app.listen(port, () => {
  console.log(`server start on port:${port} env:${process.env.NODE_ENV}`)
})
