// 25 初始化路由模块---获取文章分类列表

//25.1 导入 express
const express = require('express')
//25.2 创建路由对象
const router = express.Router()

// 25.8 导入文章分类的路由处理函数模块
const artcate_handler = require('../router_handler/artcate')

//26.6 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
//26.7 导入文章分类的验证模块
const { add_cate_schema } = require('../schema/artcate')
// 27.5导入删除分类的验证规则对象
const { delete_cate_schema } = require('../schema/artcate')
// 28.4导入根据 Id 获取分类的验证规则对象
const { get_cate_schema } = require('../schema/artcate')
// 29.4 导入更新文章分类的验证规则对象
const { update_cate_schema } = require('../schema/artcate')

// 25.4 获取文章分类的列表数据
router.get('/cates', expressJoi(add_cate_schema),artcate_handler.getArticleCates)//26.8 新增文章分类的路由

// 26.新增文章分类
//26.1 新增文章分类的路由
router.post('/addcates', artcate_handler.addArticleCates)

// 27.根据 ID 删除文章分类
// 27.1删除文章分类的路由
router.get('/deletecate/:id',expressJoi(delete_cate_schema), artcate_handler.deleteCateById)//27.6 删除文章分类的路由

// 28.根据Id获取文章分类数据
// 28.1 添加根据 Id 获取文章分类的路由：
router.get('/cates/:id', expressJoi(get_cate_schema),artcate_handler.getArtCateById)// 28.5根据 Id 获取文章分类的路由

// 29.根据 Id 更新文章分类数据
// 29.1 更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema),artcate_handler.updateCateById)// 更新文章分类的路由


// 25.3 向外共享路由对象
module.exports = router
