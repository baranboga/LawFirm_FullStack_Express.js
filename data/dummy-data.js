const Category = require("../models/category");      //modeller requested
const Blog = require("../models/blog");
const slugField = require("../helpers/slugfield");   //slugfiled requested
const User = require("../models/user");
const bcrypt = require("bcrypt");



async function populate() {                        // Dumydata created 

    const count = await Category.count();         //Categorys count requested.

    if(count == 0) {                             //İf count of categories is equal to zero, the following functions will start and crate data's
 
 

        const categories = await Category.bulkCreate([                            //kategori sayısı 0 a eşit ise kategorileri yaratırız.
            { name: "Sağlık Hukuku",url: slugField("Sağlık Hukuku"), },
            { name: "Ceza Hukuku",url: slugField("Ceza Hukuku"), },    //İkinci parametre olarak url veririz ve slıgfield kullanırız. UserController =>
            { name: "Aile Hukuku",url: slugField("Aile Hukuku"), },
            { name: "Miras Hukuku",url: slugField("Miras Hukuku"), },
        ]);

        const users = await User.bulkCreate([
            {fullname: "", email: "", password: await bcrypt.hash("", 10)},
            
        ]);

        const blogs = await Blog.bulkCreate([

            
        ]);

     
    }

}

module.exports = populate;