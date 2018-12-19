// 群组列表

'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const GroupInfoSchema = new mongoose.Schema({
    name: { type: String }, // 群组名称
    group_id: { type: Number }, // 群组id
    group_link: { type: String, trim: true, default: '' }, // 群组链接
    people_number: { type: Number }, // 群组人数
    is_admin: { type: Boolean, default: false }, // 是否为管理员
  }, {
      timestamps: true,
      collection: 'groupinfo',
    });

  return mongoose.model('GroupInfo', GroupInfoSchema);
};
