module.exports = (models) => {
    let User = models.User;
    return {
        findUserByUsername: function (name) {
            return new Promise((resolve, reject) => {

                User.findOne({ username: new RegExp(name) }, function (err, user) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
            })
        },
        createUser: function (obj) {
            //console.log(`Username: ${username}, Password: ${password}`);
            const user = new User({
                username: obj.username,
                password: obj.password,
                image: obj.image
            });

            return Promise.resolve(user.save());
        },
        getAllUsers: function () {
            return new Promise((resolve, reject) => {
                User.find((err, users) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(users);
                })
            });
        },
        updateUserImage: function (username, image) {
            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({
                    username: username
                },
                    {
                        $set: {
                            image: image
                        }
                    }, (err, user) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(user);
                    });
            });
        }
    };
};