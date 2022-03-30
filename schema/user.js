// 11. 优化表单数据验证
// 11.1 安装npm install joi@17.4.0和npm install @escook/express-joi
// 11.2 导入定义验证规则的包

const joi = require('joi')

// 11.3定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 20. 验证表单数据
// 20.1 定义 id, nickname, emial 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 11.4定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
body:{
    username,
    password,
}
}

//20.2 验证规则对象 - 更新用户基本信息
exports.update_userinfo_schema = {
    body:{
        id,
        nickname,
        email,
    }
}

//22.3 重置密码的处理函数
// 核心验证思路：旧密码与新密码，必须符合密码的验证规则，并且新密码不能与旧密码一致！
exports.update_password_schema = {
    body:{
       oldPwd:password,
       newPwd:joi.not(joi.ref('oldPwd')).concat(password),
    }
}


//24.3 验证规则模块中，定义 avatar 的验证规则
const avatar = joi.string().dataUri().required()

/*
   dataUri() 指的是如下格式的字符串数据：
   data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
*/
// 24.4 并使用 exports 向外共享如下的 验证规则对象 ： 验证规则对象 - 更新头像
exports.update_avatar_schema = {
    body:{
        avatar
    },
}



