//新建 router 文件夹，用来存放所有的路由模块
// 路由模块中，只存放客户端的请求与处理函数之间的映射关系
 
// 3.初始化路由模块
const express = require('express')
// 3.1创建路由对象
const router = express.Router()

// 4.2导入用户路由处理函数模块
const user_Handler = require('../router_handler/user')

// 12.@escook/express-joi
// 12.1 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 12.2 导入需要验证的规则对象
const {reg_login_schema} = require('../schema/user')

/*12.3在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
 数据验证通过后，会把这次请求流转给后面的路由处理函数
数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
*/
// 3.3注册新用户
router.post('/reguser',expressJoi(reg_login_schema),user_Handler.regUser)//4.3引入处理函数

// 3.3登录
// 13检测登录表单的数据是否合法
router.post('/login',expressJoi(reg_login_schema),user_Handler.login)//4.3引入处理函数
// 3.2将路由对象共享出去
module.exports = router