var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;

//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;

var outPath = "/out";
var outFileName = "out";
var outLogPath = baseLogPath + outPath + "/" + outFileName;

module.exports = {
  "appenders": {
    "out": {
      "type": 'console',
    },
    "errorLogger": {
      "type": "dateFile",
      "filename": errorLogPath,
      "encoding": "utf-8",
      "maxLogSize": 2000000,
      "numBackups": 5,
      "pattern": "-yyyy-MM-dd.log",
      "alwaysIncludePattern": true,
      "path": errorPath //自定义属性，错误日志的根目录
    },
    "resLogger": {
      "type": "dateFile",
      "filename": responseLogPath,
      "encoding": "utf-8",
      "maxLogSize": 2000000,
      "numBackups": 5,
      "pattern": "-yyyy-MM-dd.log",
      "alwaysIncludePattern": true,
      "path": responsePath
    }
  },
  "categories": {
    "default": { "appenders": ['out'], "level": 'info' },
    "errorLogger": { "appenders": ['errorLogger'], "level": 'error' },
    "resLogger": { "appenders": ['out', 'resLogger'], "level": 'info' },
  },
  "pm2": true,
  "pm2InstanceVar": "INSTANCE_ID",
  "baseLogPath": baseLogPath //logs根目录
}