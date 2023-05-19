// import { JSONCookies } from 'cookie-parser'
import { db } from '../db.js'
import jwt from 'jsonwebtoken'
export const getPosts = (req, res) => {

    const sqlStr = req.query.cat ?
        "SELECT * FROM posts WHERE cat=?" :
        "SELECT * FROM posts"
    db.query(sqlStr, [req.query.cat], (err, data) => {
        if (err) return res.status(500).send(err)
        return res.status(200).json(data)
    })
}
export const getPost = (req, res) => {
    const sqlStr = "SELECT p.id,`username`,`email`,`title`,`desc`,p.img,u.img AS userImg,`cat`,`date`,`watch` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id=?"
    db.query(sqlStr, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err)
        //增加访问量
        const postId = req.params.id
        const newWatch = data[0].watch + 1
        const sqlStr = "UPDATE posts SET `watch`=? WHERE `id`=?"
        db.query(sqlStr,[newWatch,postId],(err,data)=>{
            if (err){
            }
        })
        //
        return res.status(200).json(data[0])

    })
}
export const addPost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("用户未登录！")
    const secretKey = 'secret-111'
    jwt.verify(token, secretKey, (err, userInfo) => {
        if (err) return res.status(403).json('用户校验令牌无效！')

        const sqlStr = "INSERT INTO posts(`title`,`desc`,`img`,`cat`,`date`,`uid`) VALUES (?)"
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ]
        db.query(sqlStr, [values], (err, data) => {
            if (err) return res.status(500).json('服务器异常，请稍后重试')
            return res.status(200).json('文章发布成功！')
        })

    })
}
export const deletePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("用户未登录！")
    const secretKey = 'secret-111'
    jwt.verify(token, secretKey, (err, userInfo) => {
        if (err) return res.status(403).json('用户校验令牌无效！')

        const postId = req.params.id
        const sqlStr = 'DELETE FROM posts WHERE `id`=? AND `uid`=?'
        db.query(sqlStr, [postId, userInfo.id], (err, data) => {
            if (err) return res.status(500).json("博客删除失败，请稍后重试")
            if (data.affectedRows != 1) return res.status(403).json("未授权的删除行为！")
            return res.status(200).json('博客已删除！')
        })
    })
}
export const updatePost = (req, res) => {
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("用户未登录！")
    const secretKey = 'secret-111'
    jwt.verify(token, secretKey, (err, userInfo) => {
        if (err) return res.status(403).json('用户校验令牌无效！')

        const postId = req.params.id
        const sqlStr = "UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id`=? AND `uid` = ?"
        const values = [
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ]
        db.query(sqlStr, [...values,postId,userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json('文章更新成功！')
        })

    })
}

export const getCat = (req,res)=>{
    const sqlStr = 'SELECT cat, COUNT(*) as count FROM posts GROUP BY cat'
    db.query(sqlStr,(err,data)=>{
        if (err) return res.status(500).json(err)
        return res.status(200).json(data)
    })
}