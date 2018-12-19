let env = process.env.NODE_ENV || 'development'

const config = {
  env,
  port: 8080,
  host: '',
  mongoose: {
    url: 'mongodb://127.0.0.1:27017/baiduyun',
    options: {
      useNewUrlParser: true
    },
  }
}
// module.exports = config
export default config