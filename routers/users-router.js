"use strict";

const router = require("express").Router(),
    createAuthController = require("../controllers/auth-controller"),
    createUsersController = require("../controllers/users-controller");

module.exports = (app, data) => {
    const authController = createAuthController(data),
        usersController = createUsersController(data);

    router
        .get('/', usersController.getHome)
        .get('/home', usersController.getHome)
        .get('/login', usersController.getLogin)
        .post('/login', authController.loginLocal)
        .get('/register', usersController.getRegister)
        .post('/register', authController.register)
        .get('/profile', usersController.getProfile)
        .get('/unauthorized', usersController.getUnauthorized);

    app.use(router);
};