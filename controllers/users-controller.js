"use strict"

module.exports = function(data) {
    return {
        getHome(req, res) {
            res.render("../public/index.pug")
                //res.redirect("/static/index.html");
        },
        getLogin(req, res) {
            res.render("../public/login.pug");
        },
        getProfile(req, res) {
            if (!req.isAuthenticated()) {
                res.status(401).redirect('/unauthorized');
            } else {
                const user = req.user;
                console.log(user.image);
                res.render("../public/profile.pug", {
                    result: {
                        username: user.username,
                        image: user.image
                    }
                });
            }
        },
        getUnauthorized(req, res) {
            res.send('<h1>Wa wa!</h1>');
        },
        getRegister(req, res) {
            res.status(200).send(`
                <form action="/register" method="POST">
                    <input type="text" name="username" placeholder="Username" />
                    <input type="text" name="password" placeholder="Password" />
                    <input type="submit" value="Submit">
                </form>
            `);
        }
    };
};