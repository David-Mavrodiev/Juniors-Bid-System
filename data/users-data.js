const helper = require('../utils/helper');

module.exports = (models) => {
    let User = models.User;
    return {
        findUserByUsername: function(name) {
            name = helper.preventUserInjectionAttack(name);

            return new Promise((resolve, reject) => {

                User.findOne({ username: name }, function(err, user) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
            })
        },
        createUser: function(obj) {
            obj.username = helper.preventUserInjectionAttack(obj.username);

            //console.log(`Username: ${username}, Password: ${password}`);
            const user = new User({
                username: obj.username,
                password: obj.password
            });

            return Promise.resolve(user.save());
        },
        getAllUsers: function() {
            return new Promise((resolve, reject) => {
                User.find((err, users) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(users);
                })
            });
        },
        updateUserImage: function(username, image) {
            username = helper.preventUserInjectionAttack(username);

            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({
                    username: username
                }, {
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
        },
        addOffer: function(username, offer) {
            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({
                    username: username
                }, {
                    $push: {
                        offers: offer
                    }
                }, (err, user) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(user);
                });
            });
        },
        updateUserOffer: function(username, auctionId, newAmount) {
            return new Promise((resolve, reject) => {
                User.findOneAndUpdate({
                    username: username,
                    'offers.auctionId': auctionId
                }, {
                    $set: {
                        'offers.$.amount': newAmount
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