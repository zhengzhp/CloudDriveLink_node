'use strict';

function getDate(ctx, next) {
  console.log(ctx.body===ctx.response.body)
  ctx.body = {
    code: 200,
    data: {
      name: 'test',
      date: new Date()
    }
  }
}

export default {
  getDate
}