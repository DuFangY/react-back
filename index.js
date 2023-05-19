import express from "express"
import jwt from 'jsonwebtoken'
import authRoutes from './routers/auth.js'
import userRoutes from './routers/users.js'
import postRoutes from './routers/posts.js'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from "cookie-parser"
import multer from "multer" //上传文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()

// app.use(express.static('public'))

//中间件 转json
app.use(express.json({ limit: '50mb' }))

app.use(cookieParser())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '../client/public/upload')
        cb(null, '../react-front/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    const token = req.cookies.access_token
    if (!token) {
        cb(null, true)
        return cb(new Error('未登录!'))
    }
    const secretKey = 'secret-111'
    jwt.verify(token, secretKey, (err, userInfo) => {
        if (err) {
            cb(null, false)
            return cb(new Error('token错误'))
        }

        cb(null, true)

    })

}
const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file')
app.post('/api/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // 发生错误
            return res.status(403).json(err)
        } else if (err) {
            // 发生错误
            return res.status(403).json(err)
        }
        const file = req.file
        if (file !== undefined)
            return res.status(200).json(file.filename)
        else {
            return res.status(200).json('logo.png')
        }
    })
})

// upload.single('file'), function (req, res) {
//     // req.file 是 `file` 文件的信息
//     // req.body 将具有文本域数据，如果存在的话
//     const file = req.file
//     if (file !== undefined)
//         res.status(200).json(file.filename)
//     else {
//         res.status(404).json('未上传图片！')
//     }
// })

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/analyse", postRoutes)

app.get('*', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'index.html'));
    res.send('test')
  });

app.listen(8800, () => {
    console.log("Connected 8800...")
})