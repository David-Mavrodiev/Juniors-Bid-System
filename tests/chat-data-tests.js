/* globals require describe it beforeEach */
'use strict';

const chai = require('chai');
const sinonModule = require('sinon');
let expect = chai.expect;

describe('Chat data tests', () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class Chat {
        constructor(props) {
            this.firstUser = props.firstUser;
            this.secondUser = props.secondUser;
            this.messages = props.messages || [];
        }

        get firstUser() {
            return this._firstUser;
        }

        set firstUser(user) {
            this._firstUser = user;
        }

        get secondUser() {
            return this._secondUser;
        }

        set secondUser(user) {
            this._secondUser = user;
        }

        get messages() {
            return this._messages;
        }

        set messages(msgs) {
            this._messages = msgs;
        }

        static findOne(data) {}

        save() {}

        markModified() {}

        static find() {}

        static findOneAndUpdate() {}
    }

    let data = require('../data/chat-data')({ Chat: Chat });

    let chats = [
        new Chat({
            firstUser: 'Pesho',
            secondUser: 'Gosho',
            messages: [{
                author: 'Pesho',
                message: 'Hi'
            }, {
                author: 'Gosho',
                message: 'Hello'
            }]
        }),
        new Chat({
            firstUser: 'Pesho',
            secondUser: 'Ivan',
        }),
    ];

    describe('createChat tests', () => {
        beforeEach(() => {
            sinon.stub(Chat.prototype, 'save', (cb) => {
                return chats[0];
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to save chat', (done) => {
            const chat = chats[0];

            data.createChat('Pesho', 'Gosho')
                .then((actualChat) => {
                    expect(actualChat).to.eql(chat);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('findChatByFirstNameAndLastName tests', () => {
        beforeEach(() => {
            sinon.stub(Chat, 'findOne', (params1, callback) => {
                callback(null, chats[0]);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to get correct chat', (done) => {
            const chat = chats[0];

            data.findChatByFirstNameAndLastName('Pesho', 'Gosho')
                .then((actualChat) => {
                    expect(actualChat).to.eql(chat);
                    done();
                })
                .catch((err) => {});
        });
    });

    describe('findChatsByUsername tests', () => {
        beforeEach(() => {
            sinon.stub(Chat, 'find', (params1, callback) => {
                callback(null, chats[0]);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to get first chat', (done) => {
            const chat = chats[0];

            data.findChatsByUsername('Pesho')
                .then((actualChat) => {
                    expect(actualChat).to.eql(chat);
                    done();
                })
                .catch((err) => {});
        });

        it('Expect to get get rejection', (done) => {
            const chat = chats[0];
            sinon.restore();
            sinon.stub(Chat, 'find', (params1, callback) => {
                callback('Error', null);
            });

            data.findChatsByUsername('Pesho')
                .then((actualChat) => {})
                .catch((err) => {
                    expect(err).to.eql('Error');
                    done();
                });
        });
    });

    describe('getAllChats tests', () => {
        beforeEach(() => {
            sinon.stub(Chat, 'find', (callback) => {
                callback(null, chats);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to get all chats correctly', (done) => {
            data.getAllChats()
                .then((allChats) => {
                    expect(allChats).to.eql(chats);
                    done();
                })
                .catch((err) => {});
        });

        it('Expect to get all chats to reject', (done) => {
            sinon.restore();

            sinon.stub(Chat, 'find', (callback) => {
                callback('Error', null);
            });

            data.getAllChats()
                .then((allChats) => {})
                .catch((err) => {
                    expect(err).to.eql('Error');
                    done();
                });
        });
    });

    describe('addMessageToChat tests', () => {
        it('Expect to add message to chat correctly', (done) => {
            sinon.stub(Chat, 'findOne', (params, callback) => {
                callback(null, chats[0]);
            });

            sinon.stub(Chat.prototype, 'save', (ea) => {
                return chats[0];
            });

            data.addMessageToChat('Pesho', 'Gosho', 'Pesho', 'Kak si')
                .then((chat) => {
                    expect(chat).to.eql(chats[0]);
                    expect(chat.messages[2].message).to.eql('Kak si');
                    sinon.restore();
                    done();
                })
                .catch((err) => {});
        });

        it('Expect to reject', (done) => {
            sinon.stub(Chat, 'findOne', (params, callback) => {
                callback('Error', null);
            });

            data.addMessageToChat('Pesho', 'Gosho', 'Pesho', 'Kak si')
                .then((chat) => {})
                .catch((err) => {
                    expect(err).to.eql('Error');
                    done();
                });
        });
    });
});