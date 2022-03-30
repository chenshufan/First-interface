// 在项目根目录中新建 /db/index.js 文件，在此自定义模块中创建数据库的连接对象：

// 5.安装并配置 mysql 模块
// 5.1安装mysql
// 5.2导入mysql模块
const mysql = require('mysql')

//5.3 创建数据库连接对象
const db = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'admin123',
    database:'my_db_01',
    
})


// 测试 mysql 模块能否正常工作

db.query('select 1', (err, results) => {

    // mysql 模块工作期间报错了
  
    if(err) return console.log(err.message)
  
    // 能够成功的执行 SQL 语句
  
    console.log(results)
  
    //只能打印出[RowDataPacket {'1','1'}]的结果，就证明数据库连接成功
  
  }) 
// 5.4 向外共享db数据库连接对象
module.exports = db