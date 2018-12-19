const NODE_ENV = process.env.NODE_ENV

const baseConfig = {
  'name': 'CloudDriveLink',
  'script': './main.js',
  'merge_logs': true,
  'log_date_format': 'YYYY-MM-DD HH:mm:ss',
  watch: [
    'server',
    'config',
  ],
}
switch (NODE_ENV) {
  case 'production':
    // 集群模式下log4配置
    mergeConfig = {
      'instances': 3,
      'instance_var': 'INSTANCE_ID',
      'exec_mode': 'cluster',
    }
    break
  case 'development':
    mergeConfig = {}
    break
}

let config = Object.assign({}, baseConfig, mergeConfig)

module.exports = config