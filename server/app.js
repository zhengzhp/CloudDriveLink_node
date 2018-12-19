import Koa from 'koa'
import router from './router'
import json from 'koa-json'
import onerror from 'koa-onerror'
import bodyparser from 'koa-bodyparser'
import logger from 'koa-logger'
import logUtil from './utils/logger'
import config from '../config/config.default'

import is from 'is-type-of'
// import co from 'co'

const app = new Koa()

onerror(app)
require('ready-callback')({ timeout: 10000 }).mixin(app);

app.beforeStart = function (scope) {
    if (!is.function(scope)) {
        throw new Error('beforeStart only support function');
    }
    const done = app.readyCallback('app');
    // ensure scope executes after load completed
    process.nextTick(() => {
        new Promise(async function () {
            await scope();
        }).then(() => done(), done);
    });
};

app.config = config
app.baseDir = app.config.baseDir || process.cwd()
app.logger = logUtil.getLogger

require('./utils/model')(app);

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
        //开始进入到下一个中间件
        await next();
        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);
    } catch (error) {
        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});

app.use(router.routes())

app.on('error', (error, ctx) => {
    const start = new Date();
    var ms = new Date() - start;
    logUtil.logError(ctx, error, ms);
    console.error('server error', error, ctx)
});

export default app