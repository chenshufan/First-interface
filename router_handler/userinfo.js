// 18初始化路由处理函数模块
// 18.1 获取用户基本信息的处理函数

// 19 获取用户的基本信息 
// 19.1  导入数据库操作模块
const db = require('../db/index')

//23.1 域导入 bcryptjs
const bcrypt = require('bcryptjs')


 exports.getUserInfo = function(req,res){

    // 19.2 定义 SQL 语句：
/*根据用户的 id，查询用户的基本信息
 注意：为了防止用户的密码泄露，需要排除 password 字段
 */

 const sql = `select id ,username , nickname , email , user_pic from ev_users where id=?`

//  19.3 调用 db.query() 执行 SQL 语句：
// (注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的)
db.query(sql,req.user.id,function(err,results){
    // 19.4  执行 SQL 语句失败
    if(err) return res.cc(err)
    // 19.4  执行 SQL 语句成功，但是查询到的数据条数不等于 1
    if(results.length !== 1) return res.cc('获取用户信息失败!')
    // 19.4  将用户信息响应给客户端
    res.send({
        status : 0,
        message : '获取用户基本信息成功！',
        data : results[0]
    })
})


}
  //  21 实现更新用户基本信息的功能
exports.updateUserInfo = function(req,res){
//  21.1 定义待执行的 SQL 语句：
const sql = `update ev_users set ? where id = ?`
// 21.2 调用 db.query() 执行 SQL 语句并传参：
db.query(sql,[req.body, req.body.id],function(err,results){
    // 21.3 执行 SQL 语句失败
    if(err) return res.cc(err)
    // 21.3 执行 SQL 语句成功，但影响行数不为 1
    if(results.affectedRows !== 1) return res.cc('修改用户基本信息失败!')
    // 21.3 修改用户信息成功
    return res.cc('修改用户基本信息成功！' , 0)
})
}


//22.2 重置密码的处理函数
exports.updatePassword = function(req,res){
    // 22.5 定义根据 id 查询用户数据的 SQL 语句
    const sql = `select * from ev_users where id=?`
    // 22.6 执行 SQL 语句查询用户是否存在
    db.query(sql,req.user.id,function(err,results){
    // 22.6 执行 SQL 语句失败
    if(err) return res.cc(err)
    // 22.6 检查指定 id 的用户是否存在
    if(results.length !==1) return res.cc('用户不存在!')

    // TODO：23 判断提交的旧密码是否正确
    // 23.2 判断提交的 旧密码 是否正确：
    const compareResult = bcrypt.compareSync(req.body.oldPwd,results[0].password)
    if(!compareResult) return res.cc('原密码错误!')

    // 23.3 对新密码进行 bcrypt 加密之后，更新到数据库中：
    // 定义更新用户密码的 SQL 语句
    const sql = `update ev_users set password = ? where id = ?`
    // 23.4 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd,10)
    // 23.5 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sql,[newPwd,req.user.id],function(err,results){
    // 23.6 SQL 语句执行失败
    if(err) return res.cc(err)
    // 23.6 SQL 语句执行成功，但是影响行数不等于 1
    if(results.affectedRows !==1) return res.cc('更新密码错误!')
    // 23.6 更新密码成功
    res.cc('更新密码成功!',0)
  })
})
}

//24.2 更新用户头像的处理函数
exports.updateAvatar = function(req,res){
    // 26 实现更新用户头像的功能
    // 26.1 定义更新用户头像的 SQL 语句：
    const sql =`update ev_users set user_pic = ? where id = ?`
    // 26.2. 调用 db.query() 执行 SQL 语句，更新对应用户的头像：
    db.query(sql,[req.body.avatar , req.user.id],function(err,results){
        // 26.3 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 26.3 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
        // 26.3 更新用户头像成功
        return res.cc('更新头像成功！', 0)
    })



}