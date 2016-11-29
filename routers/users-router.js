"use strict";

const router = require("express").Router(),
    createAuthController = require("../controllers/auth-controller"),
    createUsersController = require("../controllers/users-controller"),
    data = require("../data"),
    passport = require("passport"),
    User = require("../models/user-model");

const authController = createAuthController(require("../data/users-data")(User)),
    usersController = createUsersController(require("../data/users-data")(User));

module.exports = app => {
    router
        .get('/', usersController.getHome)
        .get('/home', usersController.getHome)
        .get('/login', usersController.getLogin)
        .post('/login', authController.loginLocal)
        .get('/register', usersController.getRegister)
        .post('/register', authController.register)
        .get('/profile', usersController.getProfile)
        .post('/logout', authController.logout)
        .get('/unauthorized', usersController.getUnauthorized);

    app.use(router);
};