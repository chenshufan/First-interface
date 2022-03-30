
// 25.9 导入数据库操作模块
const db = require('../db/index')


// 25.7 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    // 25.9 定义 SQL 语句：
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为 0 表示没有被 标记为删除 的数据
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'

    db.query(sql, (err, results) => {
        // 25.10 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 25.10. 执行 SQL 语句成功
        res.send({
          status: 0,
          message: '获取文章分类列表成功！',
          data: results,
        })
      })
      
}


//26.2 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    //26.9 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
const sql = `select * from ev_article_cate where name=? or alias=?`

// 26.10执行查重操作
db.query(sql, [req.body.name, req.body.alias], (err, results) => {
    // 26.11 执行 SQL 语句失败
    if (err) return res.cc(err)
  
    //26.11 分类名称 和 分类别名 都被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
    // 26.11 分类名称 或 分类别名 被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
  
    // TODO：新增文章分类
    // 26.12 新增文章分类的 SQL 语句：
    const sql = `insert into ev_article_cate set ?`

    db.query(sql, req.body, (err, results) => {
        // 26.13 SQL 语句执行失败
        if (err) return res.cc(err)
      
        // 26.13 SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')
      
        // 26.13 新增文章分类成功
        res.cc('新增文章分类成功！', 0)
      })
      
  })
  
  }
  
  
  //27.2 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // 27.7 定义删除文章分类的 SQL 语句：
    const sql = `update ev_article_cate set is_delete=1 where id=?`

    db.query(sql, req.params.id, (err, results) => {
        // 27.8 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 27.8 SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
      
        // 27.8 删除文章分类成功
        res.cc('删除文章分类成功！', 0)
      })
      

  }
  

  //28.2 根据 Id 获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    // 28.6 定义根据 Id 获取文章分类的 SQL 语句：
    const sql = `select * from ev_article_cate where id=?`

    db.query(sql, req.params.id, (err, results) => {
        // 28.7 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 28.7  SQL 语句执行成功，但是没有查询到任何数据
        if (results.length !== 1) return res.cc('获取文章分类数据失败！')
      
        // 28.7 把数据响应给客户端
        res.send({
          status: 0,
          message: '获取文章分类数据成功！',
          data: results[0],
        })
      })
      
    
  }
  

  //29.2 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 29.5 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
const sql = `select * from ev_article_cate where Id<>? and (name=? or alias=?)`


// 29.6 执行查重操作
db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
    // 29.7 执行 SQL 语句失败
    if (err) return res.cc(err)
  
    //29.7 分类名称 和 分类别名 都被占用
    if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
    if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
    // 29.7 分类名称 或 分类别名 被占用
    if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')
  
    // TODO：更新文章分类

//  29.8 定义更新文章分类的 SQL 语句：
const sql = `update ev_article_cate set ? where Id=?`

db.query(sql, [req.body, req.body.Id], (err, results) => {
    //29.9 执行 SQL 语句失败
    if (err) return res.cc(err)
  
    // 29.9 SQL 语句执行成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')
  
    // 29.9 更新文章分类成功
    res.cc('更新文章分类成功！', 0)
  })
  
  })
  
  }
  