import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import * as article from "../controllers/article.controller";

const router = Router();

router.post("/signin", auth.signIn);
router.post("/signup", auth.signUp);

router.post("/article/add", article.addNewArticle);
router.post("/article/getall", article.getAllArticles);
router.post("/article/embed", article.embedArticles);
router.post("/article/delete", article.deleteArticles);
router.post("/article/findref", article.findReference);
export default router;
