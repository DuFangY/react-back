import { db } from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = (req, res) => {
    //检查是否存在的用户名
    const sqlStr = 'SELECT * FROM users WHERE email = ? OR username = ?'
    db.query(sqlStr, [req.body.email, req.body.name], (err, data) => {
        if (err) return res.json(err)
        if (data.length) return res.status(409).json('用户已经存在！')

        //Hash加密
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const sqlStr = 'INSERT INTO users(username,email,password) VALUES (?)'
        const values = [
            req.body.username,
            req.body.email,
            hash
        ]
        db.query(sqlStr, [values], (err, data) => {
            if (err) return res.json(err)
            else return res.status(200).json('用户注册成功！')
        })
    })
}
export const login = (req, res) => {
    const sqlStr = "SELECT * FROM users WHERE username = ?"
    db.query(sqlStr, [req.body.username], (err, data) => {
        if (err) return res.json(err)
        if (data.length === 0) return res.status(404).json("用户名未注册！")


        //校验密码
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)
        if (!isPasswordCorrect) return res.status(400).json('密码和用户名不匹配！')

        //定义 secret 密钥
        const secretKey = 'secret-111'
        //校验成功之后，调用 jwt.sign() 方法生成 JWT 字符串。并通过 token 属性发送给客户端
        // 参数1：用户的信息对象
        // 参数2：加密的秘钥
        // 参数3：配置对象，可以配置当前 token 的有效期
        const token = jwt.sign({ id: data[0].id },secretKey)
        //将除了密码的信息发送给浏览器
        const {password,...others} = data[0]
        res.cookie("access_token",token,{
            //js脚本无法直接访问cookie,增加了安全性
            httpOnly:true
        }).status(200)
        .json(others)
    })
}

export const logout = (req, res) => {
   res.clearCookie("access_token",{
    sameSite:'none',
    secure:true
   }).status(200).json("用户已退出登录！")
}