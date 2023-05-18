import jwt from 'jsonwebtoken'

export const verifyUser = (req,res)=>{
    const token = req.cookies.access_token
    if (!token) return res.status(401).json("用户未登录！")
    const secretKey = 'secret-111'
    jwt.verify(token, secretKey, (err, userInfo) => {
        if (err) return res.status(403).json('用户校验令牌无效！')
        return res.status(200).json('用户校验成功，已登录')
    })
}