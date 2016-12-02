const helper = require('../utils/helper');

module.exports = (models) => {
    let Chat = models.Chat;
    return {
        findChatByFirstNameAndLastName: function(firstUser, secondUser) {
            firstUser = helper.preventUserInjectionAttack(firstUser);
            secondUser = helper.preventUserInjectionAttack(secondUser);

            return new Promise((resolve, reject) => {
                if (firstUser.localeCompare(secondUser) > 0) {
                    let tempUser = firstUser;
                    firstUser = secondUser;
                    secondUser = tempUser;
                }

                Chat.findOne({ firstUser, secondUser }, function(err, chat) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(chat);
                    }
                });
            })
        },
        findChatsByUsername: function(username) {
            username = helper.preventUserInjectionAttack(username);

            return new Promise((resolve, reject) => {

                Chat.find({ firstUser: username }, function(err, chat) {
                    if (err) {
                        reject(err);
                    } else if (!chat) {
                        Chat.findOne({ secondUser: username }, function(err2, chat2) {
                            if (err2) {
                                reject(err2);
                            } else {
                                resolve(chat2)
                            }
                        })
                    } else {
                        resolve(chat);
                    }
                });
            })
        },
        createChat: function(firstUser, secondUser) {
            firstUser = helper.preventUserInjectionAttack(firstUser);
            secondUser = helper.preventUserInjectionAttack(secondUser);

            if (firstUser.localeCompare(secondUser) > 0) {
                let tempUser = firstUser;
                firstUser = secondUser;
                secondUser = tempUser;
            }

            const chat = new Chat({
                firstUser,
                secondUser,
                messages: []
            });

            return Promise.resolve(chat.save());
        },
        getAllChats: function() {
            return new Promise((resolve, reject) => {
                Chat.find((err, chats) => {
                    if (err) {
                        return reject(err)
                    }

                    return resolve(chats);
                })
            });
        },
        addMessageToChat: function(firstUser, secondUser, author, message) {
            firstUser = helper.preventUserInjectionAttack(firstUser);
            secondUser = helper.preventUserInjectionAttack(secondUser);
            author = helper.preventUserInjectionAttack(author);
            message = helper.preventMessageInjectionAttack(message);

            return new Promise((resolve, reject) => {
                if (firstUser.localeCompare(secondUser) > 0) {
                    let tempUser = firstUser;
                    firstUser = secondUser;
                    secondUser = tempUser;
                }

                Chat.findOne({ firstUser, secondUser }, function(err, chat) {
                    if (err) {
                        return reject(err);
                    }
                    if (!chat) {
                        chat = new Chat({
                            firstUser,
                            secondUser,
                            messages: []
                        });
                    }

                    chat.messages.push({
                        author,
                        message
                    })

                    chat.markModified('messages');

                    resolve(chat.save());
                });
            });
        }
    };
};