import express from 'express'
import { getPosts,getPost,addPost,deletePost,updatePost,getCat } from '../controllers/post.js'

const router = express.Router()

router.get('/',getPosts)
router.get('/blog',getCat)
router.get("/:id",getPost)
router.post("/",addPost)
router.delete("/:id",deletePost)
router.put("/:id",updatePost)


export default router