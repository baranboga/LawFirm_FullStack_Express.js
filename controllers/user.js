const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize");
const emailService = require("../helpers/send-mail");
const config = require("../config");

exports.blogs_details = async function(req, res) {
    const slug = req.params.slug;
    try {
        const blog = await Blog.findOne({
            where: {
                url: slug
            },
            raw: true
        });

        if(blog) {
            console.log(blog)
            return res.render("users/blog-details", {
                title: blog.baslik,
                blogs: blog
            });
        }
        res.redirect("/404");
    }
    catch(err) {
        console.log(err);
    }
}
exports.get_contact = async function(req, res) {
    try {
      
        res.render("users/contact", {
          csrfToken: req.csrfToken()
          
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_contact = async function(req, res) {
     const name=req.body.adsoyad;
     const email=req.body.email;
     const konu=req.body.konu;
     const mesaj=req.body.mesaj;
     
     
    try {

        emailService.sendMail({
            from: config.email.from,
            to: "baraboga97@gmail.com",
            subject: "Müvekkilden mesaj var",
            html:"<h5>Müvekkilden mesaj var</h5>"+"<h5>"+name+"</h5>"+"<h5>"+email+"</h5>"+"<h5>"+konu+"</h5>"+"<h5>"+mesaj+"</h5>"
            
        });

      
      
        
        res.render("users/index", {
         
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.work = async function(req, res) {
    try {
      
        const blogs = await Blog.findAll({
            
        });

        res.render("users/work", {
         
            blogs:blogs,
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.team = async function(req, res) {
    try {
      

        res.render("users/team", {
         
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.about = async function(req, res) {
    try {
      

        res.render("users/about", {
         
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.blog_list = async function(req, res) {
    const size = 3;                    //Sayfa başına kaç veri geleceğini bir değişkende tutarız.
    const { page = 0 } = req.query;    //Buradan bir page querysi alırız. herhangi bir değer yok ise (kullanıcı başka sayfa da değil ise) 
                                       //page otomatik olarak 0 olur.

    const slug = req.params.slug;     //3-slug bilgisini alırız.

    try {
        const { rows, count } = await Blog.findAndCountAll({        //4-aldığımız categori slug bilgisi ile blogların içerisinde categori slug bilgisi eşleşen kayıtları alırız.
            where: { onay: {[Op.eq]: true } },
            raw: true,
            include: slug ? { model: Category, where: { url: slug } } : null,     //slug geliyor ise slug bilgisi categori ile eşleşen blogları getir.
            limit: size,
            offset: page * size          //kullanıcının göndermiş olduğu page querysine göre bloglar gelecek
        });

        const categories = await Category.findAll({ raw: true });

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: rows,
            totalItems: count,
            totalPages: Math.ceil(count / size),
            currentPage: page,
            categories: categories,
            selectedCategory: slug              //5- "Active" özelliğinin çalışması için  categori bilgisini dolu göndeririz.

            // class="list-group-item list-group-item-action <%= selectedCategory == category.url ? 'active': '' %> ">  categori.menu.js=>
        })
    }
    catch(err) {
        console.log(err);
    }
}

exports.index = async function(req, res) {
    try {
        const blogs = await Blog.findAll({      //blogların hepsini buluruz.
            where: {                           // Anasayfada görünmesi ve onay ları olanları isteriz.
                [Op.and]: [
                    { anasayfa: true },
                    { onay: true }
                ]
            },
            raw: true                           //Sadece bize çağırdığımız verilerin gelmesini sağlar, detaylar gelmez.
        }); 

        const categories = await Category.findAll({ raw: true });    //Bütün kategorileri seçeriz.

        res.render("users/index", {                                  //Tüm bunları index e göndeririz.
            title: "Popüler Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: null,                                 //!!
            isAuth:req.session.isAuth,
        })
    }
    catch(err) {
        console.log(err);
    }
}