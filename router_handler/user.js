// 抽离用户路由模块中的处理函数
/*目的：为了保证 路由模块 的纯粹性，所有的 路由处理函数，必须抽离到对应的 路由处理函数模块 中
在 /router_handler/user.js 中，使用 exports 对象，分别向外共享如下两个 路由处理函数 */


// 16.3导入Token字符串的包
const jwt = require('jsonwebtoken')
// 16.5导入config.js配置的文件
const config = require('./config')

// 7.检测用户名是否被占用
// 7.1导入数据库模块
const db = require('../db/index')

// 8.对密码进行加密处理
/*在当前项目中，使用 bcryptjs 对用户密码进行加密，优点：

加密之后的密码，无法被逆向破解
同一明文密码多次加密，得到的加密结果各不相同，保证了安全性*/

// 8.1 安装并且导入bcryptjs
const bcrypt = require('bcryptjs')

// 4.抽离用户路由模块的处理函数

// 4.1 注册新用户的处理函数
exports.regUser = function(req,res){

    // 6判断用户名和密码是否为空
    // 6.1获取客户端提交到数据库的用户信息
    const userinfo = req.body

// 6.2 因为 12 导入的数据验证对象而删除
    // 6.2对表单中的数据，进行合法性的验证
    // if(!userinfo.username || !userinfo.password){
    //     return res.send({
    //         status:1,
    //         message:'用户名或密码不能为空！'
    //     })
    // }

    // 10.4优化res.send()
    // if(!userinfo.username || !userinfo.password){
    //      return res.cc('用户名或密码不能为空！')
    // }

// // 7.2 定义SQL语句
//   // 定义 SQL 语句，查询用户名是否被占用
const sqlStr = 'select * from ev_users where username=?'
// // 7.3 执行SQL语句并根据结果判断用户名是否被占用
db.query(sqlStr, userinfo.username, function(err, results){
    // 执行SQL语句失败
    if (err){
        // return res.send({
        //     status:1,
        //     message:err.message
        // })
    // 10.4优化res.send()
         return res.cc(err)
    }
    // 7.4 用户名被占用
    if (results.length > 0){
        // return res.send({
        //     status:1,
        //     message:'用户名被占用，请重新输入其他用户名'
        // })
     // 10.4优化res.send()
     return res.cc('用户名被占用，请重新输入其他用户名')
    }
    // TODO: 用户名可用，继续后续流程...(bug)


// 8.2调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理
userinfo.password = bcrypt.hashSync(userinfo.password, 10)

//  9.数据库插入新用户
// 9.1定义插入用户的SQL语句
const sql = 'insert into ev_users set ?'

// 9.2调用db.query()执行SQL语句,插入新用户
db.query(sql, { username:userinfo.username, password: userinfo.password},function(err,results){
// 9.3执行SQL的语句失败
if (err)
//     return res.send({
//     status:1,
//     message:err.message
// })
 // 10.4优化res.send()
 return res.cc(err)
// 9.4 SQL语句执行成功,但影响行数不为1
if (results.affectedRows !== 1)
// return res.send({
//     status:1,
//     message:'注册用户失败,请稍后再试!'
// })
 // 10.4优化res.send()
 return res.cc('注册用户失败,请稍后再试!')

//  9.5 注册成功
// res.send({
//     status:0,
//     message:'注册成功!'
// })
// 10.4优化res.send()
res.cc('注册成功', 0)
})
})
}

// 4.1登录的处理函数
exports.login = function(req,res){
    // 14.根据用户名查询用户的数据
    // 14.1 接收表单的数据
    const userinfo = req.body

    // 14.2定义SQL语句
    const sql = 'select * from ev_users where username = ?'

    // 14.3 执行SQL语句 查询用户的数据
    db.query(sql,userinfo.username,function(err,results){
        // 14.4 执行SQL语句失败
        if (err) return res.cc(err)
        // 14.4 执行SQL语句成功，但是查询到数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！')


        // 15.判断用户输入的密码是否正确
        // 核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致// 返回值是布尔值（true 一致、false 不一致）
        // 15.1 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 15.2 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult){
          return res.cc('登录失败')
        }

        // TODO：登录成功，生成 Token 字符串
        // 16.生成 JWT 的 Token 字符串
        // 核心注意点：在生成 Token 字符串的时候，一定要剔除 密码 和 头像 的值
        /*1. 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值：
         剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
         const user = { ...results[0], password: '', user_pic: '' }
         */
      //  16.1 通过 ES6 的高级语法，快速剔除 密码 和 头像 的值：
        const user = {...results[0], password: '', user_pic: ''}
       // 16.2 安装生成 Token 字符串的包

       //16.6生成 Token 字符串
       const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})

      // 16.7 将生成的 Token 字符串响应给客户端：
      res.send({
        status : 0,
        message : '登录成功！',
        token:'Bearer '+tokenStr,  // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀，记得后面加个空格
       })


       

    })
}