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
        .get('/createAdmin', usersController.getCreateAdmin)
        .post('/createAdmin', usersController.createAdmin)
        .get('/login', usersController.getLogin)
        .post('/login', authController.loginLocal)
        .get('/register', usersController.getRegister)
        .post('/register', authController.register)
        .get('/profile', usersController.getProfile)
        .get('/profile/:username', usersController.getProfileByUsername)
        .post('/profile', usersController.uploadImage)
        .post('/logout', authController.logout)
        .get('/unauthorized', usersController.getUnauthorized)
        .post('/image', usersController.uploadImage);

    app.use(router);
};