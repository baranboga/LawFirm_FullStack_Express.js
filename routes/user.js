const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const csrf = require("../middlewares/csrf");

//1-<a href="/blogs/category/<%= category.url %>"  kategori menüsünden slug bilgisini içeren request atarız.

 router.get("/blogs/category/:slug", userController.blog_list);    //2-seçilen kategorinin url bilgisini get sorgusuna göndeririz.  usercontroll.blog.list=>

router.get("/blogs/:slug", userController.blogs_details);

router.get("/contact",csrf, userController.get_contact);

router.post("/contact", userController.post_contact);

router.get("/team", userController.team);

router.get("/work", userController.work);

router.get("/about", userController.about);

router.get("/blogs", userController.blog_list);

router.get("/", userController.index);
 
module.exports = router;