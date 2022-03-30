// 17.获取用户的基本信息
// 17.1 初始化 路由 模块
// 导入 express
const express = require('express')

// 17.2 创建路由对象
const router = express.Router()

//24.5 导入更新头像需要的验证规则对象 ：
const {update_avatar_schema} = require('../schema/user')
// 20.3 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
// 20.4 导入需要的验证规则对象
const { update_userinfo_schema } = require('../schema/user')
// 22.4 导入需要的验证规则对象
const { update_password_schema } =require('../schema/user') 

// 18.2 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 17.4 获得用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)//18.3 引入userinfo_handler.getUserInfo


// 18. 更新用户的基本信息
// 定义路由和处理函数
// 18.1 新增 更新用户基本信息 的路由
router.post('/userinfo',expressJoi(update_password_schema),userinfo_handler.updateUserInfo)


// 22.重置密码
//22.1 重置密码的路由
router.post('/updatepwd',expressJoi(update_password_schema),userinfo_handler.updatePassword)


// 24.更新用户头像
// 24.1 更新用户头像的路由
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)


// 17.3 向外共享路由模块
module.exports = router