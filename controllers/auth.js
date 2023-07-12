const User = require("../models/user");
const bcrypt = require("bcrypt");
const config = require("../config");
const emailService = require("../helpers/send-mail");

exports.get_register = async function(req, res) {
    try {
        return res.render("auth/register", {
            title: "register"
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_register = async function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user  = await User.findOne({ where: { email: email }});


    if(user) {
        req.session.message = { text: "Girdiğiniz email adresiyle daha önce kayıt olunmuş.", class: "warning"};
        return res.redirect("login");
    }

    try {
        const newUser = await User.create({ fullname: name, email: email, password: hashedPassword });

        emailService.sendMail({
            from: config.email.from,
            to: newUser.email,
            subject: "Hesabınızı oluşturuldu.",
            text: "Hesabınızı başarılı şekilde oluşturuldu."
        });


        req.session.message = { text: "Hesabınıza giriş yapabilirsiniz", class: "success"};

        return res.redirect("login");
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_login = async function(req, res) {
    const message = req.session.message;
    delete req.session.message;
    try {
        return res.render("auth/login", {
            title: "login",
            message: message,
            csrfToken: req.csrfToken()
        });
    }
    catch(err) {
        console.log(err);
    }
}


exports.get_logout = async function(req, res) {
    try {
        await req.session.destroy();        //session u destroy ederiz.

        setTimeout(() => {
            
            return res.redirect("/");

        }, 1000);
       
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_login = async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if(!user) {
            return res.render("auth/login", {
                title: "login",
                message: { text: "Email hatalı", class: "danger"}
            });
        }

        // parola kontrolü
        const match = await bcrypt.compare(password, user.password);

        if(match) {

           
            req.session.isAuth = await true;
            req.session.fullname=await user.fullname;
            return res.redirect("/");

           
            
          
           
        } 
        
        return res.render("auth/login", {
            title: "login",
            message:  { text: "Parola hatalı", class: "danger"}
        });     
    }
    catch(err) {
        console.log(err);
    }
}