import express from 'express'
import { getPosts,getPost,addPost,deletePost,updatePost,getCat,getTimeRank } from '../controllers/post.js'

const router = express.Router()

router.get('/',getPosts)
router.get('/blog',getCat)
router.get('/rank',getTimeRank)
router.get("/:id",getPost)
router.post("/",addPost)
router.delete("/:id",deletePost)
router.put("/:id",updatePost)


export default router