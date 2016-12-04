/* globals require describe it beforeEach */
'use strict';

const chai = require('chai');
const sinonModule = require('sinon');
let expect = chai.expect;

describe('Users data tests', () => {
    let sinon;
    beforeEach(() => {
        sinon = sinonModule.sandbox.create();
    });

    class User {
        constructor(props) {
            this.username = props.username;
            this.offers = props.offers || [];
        }

        get image() {
            return this._image;
        }

        set image(image) {
            this._image = image;
        }

        get offers() {
            return this._offers;
        }
        
        set offers(offers) {
            this._offers = offers;
        }

        static findOne() { }

        save() { }

        static find() { }

        static findOneAndUpdate() { }
    }

    let data = require('../data/users-data')({ User: User });

    let users = [
        new User({ username: 'Pesho', offers: [
            {
                auctionId: '1',
                auctionTitle: 'NewAuc',
                amount: 100
            },
            {
                auctionId: '2',
                auctionTitle: 'AnotherAuc',
                amount: 150
            },
        ] }),
        new User({ username: 'AnotherName' }),
    ];

    describe('findUserByUsername tests', () => {
        beforeEach(() => {
            sinon.stub(User, 'findOne', (filter, cb) => {
                const username = filter.username;
                const foundUser = users.find(x => x.username === username);
                cb(null, foundUser);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return correct user', (done) => {
            const username = 'Pesho';
            const user = users[0];

            data.findUserByUsername(username)
                .then((actualUser) => {
                    expect(actualUser).to.eql(user);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });;
        });

        it('Expect not to return correct user when passed username does not exist', (done) => {
            const username = 'Not existing username';

            data.findUserByUsername(username)
                .then((actualUser) => {
                    expect(actualUser).to.eql(undefined);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });

    describe('createUser tests', () => {
        beforeEach(() => {
            sinon.stub(User.prototype, 'save', (cb) => {
                return users[0];
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to save user', (done) => {
            const user = users[0];

            data.createUser(user)
                .then((actualUser) => {
                    expect(actualUser).to.eql(user);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });

    describe('getAllUsers tests', () => {
        beforeEach(() => {
            sinon.stub(User, 'find', (cb) => {
                cb(null, users);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return all users', (done) => {
            data.getAllUsers()
                .then((actulUsers) => {
                    expect(actulUsers).to.eql(users);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });

    describe('updateUserImage tests', () => {
        beforeEach(() => {
            sinon.stub(User, 'findOneAndUpdate', (filter, update, cb) => {
                const user = users.find(x => x.username === filter.username);
                user.image = update.$set.image;
                cb(null, user);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return user found by username', (done) => {
            const username = 'Pesho';
            const image = 'image';
            data.updateUserImage(username, image)
                .then((actualUser) => {
                    expect(actualUser.username).to.eql(username);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });

        it('Expect to change user image', (done) => {
            const username = 'Pesho';
            const image = 'image';
            data.updateUserImage(username, image)
                .then((actualUser) => {
                    expect(actualUser.image).to.eql(image);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });

    describe('addOffer tests', () => {
        beforeEach(() => {
            sinon.stub(User, 'findOneAndUpdate', (filter, update, cb) => {
                const user = users.find(x => x.username === filter.username);
                user.offers.push(update.$push.offers);
                cb(null, user);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return user found by username', (done) => {
            const username = 'Pesho';
            const offer = {
                auctionId: '1',
                auctionTitle: 'NewAuc',
                amount: '100'
            };
            data.addOffer(username, offer)
                .then((actualUser) => {
                    expect(actualUser.username).to.eql(username);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });

        it('Expect to add offer to user offers', (done) => {
            const username = 'Pesho';
            const offer = {
                auctionId: '1',
                auctionTitle: 'NewAuc',
                amount: '100'
            };
            data.addOffer(username, offer)
                .then((actualUser) => {
                    expect(actualUser.offers).to.contain(offer);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });

    describe('updateUserOffer tests', () => {
        beforeEach(() => {
            sinon.stub(User, 'findOneAndUpdate', (filter, update, cb) => {
                const user = users.find(x => x.username === filter.username);
                user.offers.find(x => x.auctionId === filter['offers.auctionId']).amount = update.$set['offers.$.amount'];
                cb(null, user);
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it('Expect to return user found by username', (done) => {
            const username = 'Pesho';
            const auctionId = '1';
            const newAmount = 500;

            data.updateUserOffer(username, auctionId, newAmount)
                .then((actualUser) => {
                    expect(actualUser.username).to.eql(username);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });

        it('Expect to update user offer amount', (done) => {
            const username = 'Pesho';
            const auctionId = '1';
            const newAmount = 500;

            data.updateUserOffer(username, auctionId, newAmount)
                .then((actualUser) => {
                    expect(actualUser.offers.find(x => x.auctionId === auctionId).amount).to.eql(newAmount);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
});