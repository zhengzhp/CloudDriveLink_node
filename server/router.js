import Router from 'koa-router'
import test from './controllers/test'

const router = new Router()

router.get('/test', test.getDate)

export default router
// module.exports = router
