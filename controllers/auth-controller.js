'use strict';

const passport = require('passport');
const fs = require('fs');
const constants = require('../utils/constants');
const encryptor = require('simple-encryptor')(constants.cryptingKey);

function authController(data) {
    const usersController = require('./users-controller')(data);
    return {
        loginLocal(req, res, next) {
            const auth = passport.authenticate('local', function(error, user) {
                if (error) {
                    next(error);
                    return;
                }

                if (!user) {

                    usersController.getLogin(req, res, 'Invalid username or password!');
                    return;
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
                        usersController.getRegister(req, res, 'User with this username already exists!');
                    }
                    if (req.body.username.length < 3 || req.body.username.length > 12) {
                        usersController.getRegister(req, res, 'Username must be between 3 and 12 characters!');
                    } else {
                        const encryptedPassword = encryptor.encrypt(req.body.password);

                        const user = {
                            username: req.body.username,
                            password: encryptedPassword
                        };

                        data.createUser(user)
                            .then(dbUser => {
                                fs.writeFileSync('./public/profileimages/' + dbUser.username + '.jpg', new Buffer(fs.readFileSync('./public/img/default-user.jpg')));
                                authController(data).loginLocal(req, res, next);
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