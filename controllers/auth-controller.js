'use strict';

const passport = require('passport');
const fs = require('fs');

function authController(data) {
    return {
        loginLocal(req, res, next) {
            const auth = passport.authenticate('local', function(error, user) {
                if (error) {
                    next(error);
                    return;
                }

                if (!user) {
                    res.json({
                        success: false,
                        message: 'Invalid name or password!'
                    });
                }

                req.login(user, error => {
                    if (error) {
                        next(error);
                        return;
                    }

                    res.redirect('/profile');
                });
            });

            auth(req, res, next);
        },
        loginGithub(req, res, next) {
            const auth = passport.authenticate('github', function(error, user) {
                if (error) {
                    next(error);
                    return;
                }

                if (!user) {
                    res.json({
                        success: false,
                        message: 'Invalid name or password!'
                    });
                }

                req.login(user, error => {
                    if (error) {
                        next(error);
                        return;
                    }

                    res.redirect('/profile');
                });
            });

            auth(req, res, next);
        },
        logout(req, res) {
            req.logout();
            res.send({ redirectUrl: '/home' });
        },
        register(req, res, next) {
            data.findUserByUsername(req.body.username)
                .then((user) => {
                    if (user) {
                        res.redirect('/register');
                    } else {
                        const user = {
                            username: req.body.username,
                            password: req.body.password,
                            image: req.body.image
                        };

                        data.createUser(user)
                            .then(dbUser => {
                                fs.writeFileSync('./public/profileimages/' + user.username + '.jpg', new Buffer(fs.readFileSync('./public/img/default-user.jpg')));
                                console.log('Writed new img');
                                authController(data).loginLocal(req, res, next);
                                //require('./auth-controller')(data).loginLocal(req, res, next);
                            })
                            .catch(error => res.status(500).json(error));
                    }
                })
                .catch((err) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }
    }
};

module.exports = authController;