//1. 创建项目
//1.1 导入 express 模块
const express = require('express')
//1.2 创建 express 的服务器实例
const app = express()


// 2.配置cors跨域
// 2.1 导入cors的中间件
const cors = require('cors')
// 2.2 将cors注册为全局中间件
app.use(cors())

//12.4 导入joi
const joi = require('joi')

// 17.配置解析 Token 的中间件
//17.1安装解析 Token 的中间件：
//17.2 导入config.js配置文件
const config = require('./router_handler/config')

// 2.3 配置解析表单数据的中间件，application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))


// 10. 优化res.send()代码
// 处理函数中，需要多次调用 res.send() 向客户端响应 处理失败 的结果，为了简化代码，可以手动封装一个 res.cc() 函数
// 在 app.js 中，所有路由之前，声明一个全局中间件，为 res 对象挂载一个 res.cc() 函数 ：

// 10.1 响应数据的中间件
app.use(function(req,res,next){
    // status = 0 为成功; status = 1 为失败; 默认status的值设置为1
res.cc = function(err,status=1){
    res.send({
        // 10.2状态
        status,
        // 10.2状态描述:判断err是错误对象还是字符串
        // message : err instanceof Error ? err.message : err,
        message: err instanceof Error ? err.message : err,
    })
}
    next()
})

//17.3 解析 token 的中间件
const expressJWE = require('express-jwt')
//17.4 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWE({secret : config.jwtSecretKey }).unless({ path : [/^\/api\//] }))


// 3.4在app.js中导入user.js的用户路由模块
const userRouter = require('./router/user')
// app.use('/api',userRouter)
app.use('/api', userRouter)


// 17.5 导入并使用用户信息路由模块
const userinfoRoute = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my',userinfoRoute)


//25.5 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
// 25.6 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)




// 12.5配置数据验证错误的中间件
app.use(function(err,req,res,next){
    // 12.6 数据验证失败
    // if(err instanceof joi.ValidationError) return res.cc(err)
    if (err instanceof joi.ValidationError) return res.cc(err)

    // 17.5  错误级别中间件 里面，捕获并处理 Token 认证失败后的错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证错误！')

    // 12.6未知错误
    res.cc(err)
})



//1.3 调用 app.listen 方法，指定端口号并且启动服务器
app.listen(8088,function(){
    console.log('api server running at http://127.0.0.1:8088')
})
