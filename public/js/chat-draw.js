drawUsersContainer()

let SCROLL_WIDTH = 24;

let popup = $("#popup");
let popupBar = $("#popup-bar");
let btnClose = $("#btn-close");
let myProfile = $('#my-profile');
let profileImg = $("#my-profile-image");
let profileName = $('#my-profile-name');
let profileStatus = $('#my-profile-status');
let myStatusDot = $('#my-profile-status-dot');
let myStatus = $('#my-status');
let searchUser = $('#search-user');
let searchUserContainer = $('.search-user');
let usersWindow = $('#users-window')
let popupMessageBox = $('#popup-message');

var messageController = {};

let usersOnline = [];

let localUser = null;

let isClosed = false;

let popupProperties = {
    right: 5,
    bottom: 5,
    width: 250,
    height: 450
}

let imageProperties = {
    width: 40,
    height: 40
}

let statusDotProperties = {
    width: 10,
    height: 10
}

let btnCloseProperties = {
    top: 5,
    right: 5
}

let searchProperties = {
    top: 55,
    left: 5,
    width: 220,
    height: 20
}

let usersWindowProperties = {
    top: 90,
    left: 5,
    width: 230,
    height: 350
}

let userBoxProperties = {
    width: 225,
    height: 45
}

let messageBoxIconProperties = {
    right: -75,
    bottom: 2,
    width: 20,
    height: 20
}

let popupMessageBoxProperties = {
    right: 270,
    bottom: 5,
    width: 260,
    height: 340
}

let chatBoxProperties = {
    width: 240,
    height: 200
}

var messageCollectionData = []

setStylesToItems();

$('body').on('click', function(event) {
    let element = $(event.target);
    //alert($(event.target).attr('class'))

    if (element.attr('class') == 'msg-exit-button') {
        closeMessageBox();
    } else if (element.attr('class') == 'message-box-icon') {
        let toUser = element.attr('data-username');

        for (let i = 0; i < messageCollectionData.length; i += 1) {
            if (messageCollectionData[i].toUsername == toUser) {
                drawMessageBox(messageCollectionData[i], localUser);
                return;
            }
        }

        let toUserData = null;

        console.log('To Users: ' + toUser);
        console.log(usersOnline)

        for (let i = 0; i < usersOnline.length; i += 1) {
            if (usersOnline[i].username == toUser) {
                toUserData = usersOnline[i];
            }
        }

        let messageDataNow = {
            toUsername: toUser,
            toImgUrl: toUserData.imgUrl,
            online: toUserData.online,
            messages: []
        };

        messageCollectionData.push(messageDataNow);

        drawMessageBox(messageDataNow, localUser);
    }
});

btnClose.hover(function() {
    btnClose.css('color', '#F8F8F8');
    btnClose.css('cursor', 'pointer');
});

btnClose.mouseout(function() {
    btnClose.css('color', '#A8A8A8');
    btnClose.css('cursor', 'auto');
})

btnClose.on('click', function() {
    if (isClosed == false) {
        popupProperties.height = 55;
        btnClose.html('---');
        closeMessageBox();
    } else {
        popupProperties.height = 450;
        btnClose.html('X');
    }

    isClosed = !isClosed;

    setVisibleToItems();

    btnClose.css('color', '#A8A8A8');
    btnClose.css('cursor', 'auto');
    setStylesToItems();
})

$('#search-user').on('keydown', function(ev) {
    let searchedValue = $(ev.target).val();


    let users = $('.profile-name');

    for (let i = 0; i < users.length; i += 1) {
        for (let j = 0; j < usersOnline.length; j += 1) {
            if (users.eq(i).html().toLowerCase().indexOf(searchedValue.toLowerCase()) == -1) {
                users.eq(i).closest('.user-box').css('display', 'none');
            } else {
                users.eq(i).closest('.user-box').css('display', '');
            }
        }
    }
});

function chatBoxEvent(ev) {
    //Enter
    if (ev.which == 13) {
        let messageBox = $(ev.target);
        let text = messageBox.val();
        messageBox.val('');
        let fromUser = messageBox.attr('data-from-username');
        let toUser = messageBox.attr('data-to-username');

        messageController.sendMessage(toUser, text)
    }
}

function closeMessageBox() {
    $('.chat-input-field').off('keydown')
    popupMessageBox.html('');
    popupMessageBox.css('display', 'none');
}

function drawUsersContainer() {
    let usersContainer = $(`
        <div id="popup">
            <div class="top">
                    <div id="popup-bar"></div>
                    <div id="my-profile">
                        <img id="my-profile-image" src="">
                        <div id="my-status">
                            <div id="my-profile-name"></div>
                            <img id="my-profile-status-dot" src="http://www.clker.com/cliparts/R/d/z/v/H/1/neon-green-dot-hi.png" alt="">
                            <div id="my-profile-status">Online</div>
                        </div>
                    </div>
                    <div id="btn-close">
                        X
                    </div>
                </div>
                <div class="search-user">
                    <input id="search-user" type="text" placeholder="Search user">
                </div>
                <div id="users-window">
            </div>
        </div>
        <div id="popup-message">
        </div>`)

    $('body').append(usersContainer);
}

function setVisibleToItems() {
    if (isClosed) {
        searchUser.css('display', 'none');
        usersWindow.css('display', 'none');
    } else {
        searchUser.css('display', '');
        usersWindow.css('display', '');
    }
}

function drawMessageBox(messageCollection, localUser) {
    closeMessageBox();
    popupMessageBox.html('');
    popupMessageBox.css('display', '');

    let userBox = $('<div></div>');

    userBox.addClass('user-box');
    userBox.css('padding-left', '2px');
    userBox.css('padding-top', '2px');

    let userImg = $('<img>')
    userImg.addClass('profile-image');
    userImg.attr('src', messageCollection.toImgUrl);

    userImg.width(imageProperties.width)
    userImg.height(imageProperties.height)
    userImg.css('float', 'left');
    userImg.css('border', '2px solid #00ccff')

    let statusBox = $('<div></div>');
    statusBox.addClass('status-box');

    let profileName = $('<div></div>');
    profileName.addClass('profile-name');
    profileName.html(messageCollection.toUsername);
    profileName.css('margin-left', '45px');
    profileName.css('color', '#00ccff')

    let profileStatusDot = $('<img>');
    profileStatusDot.addClass('profile-status-dot');
    profileStatusDot.width(statusDotProperties.width);
    profileStatusDot.height(statusDotProperties.height);
    profileStatusDot.css('float', 'left');
    profileStatusDot.css('margin-top', '4px');
    profileStatusDot.css('margin-left', '5px');

    let profileStatus = $('<div></div>');
    profileStatus.addClass('profile-status');

    profileStatus.css('float', 'left');
    profileStatus.css('margin-left', '5px');
    profileStatus.css('color', '#00ccff')

    if (messageCollection.online) {
        profileStatusDot.attr('src', 'http://www.clker.com/cliparts/R/d/z/v/H/1/neon-green-dot-hi.png');
        profileStatus.html('Online');
    } else {
        profileStatusDot.attr('src', 'http://worldartsme.com/images/red-dot-clipart-1.jpg');
        profileStatus.html('Offline');
    }

    profileName.appendTo(statusBox);
    profileStatusDot.appendTo(statusBox);
    profileStatus.appendTo(statusBox);

    let messageBoxIcon = $('<img>');
    messageBoxIcon.attr('src', 'http://iconshow.me/media/images/Mixed/small-n-flat-icon/png/512/bubble.png');

    userImg.appendTo(userBox);
    statusBox.appendTo(userBox);

    userBox.width(userBoxProperties.width);
    userBox.height(userBoxProperties.height);

    userBox.css('margin-top', '10px');
    userBox.css('margin-left', '10px');

    userBox.appendTo(popupMessageBox);

    let chatBox = $('<div></div>')
    chatBox.addClass('chat-box');
    chatBox.css('background-color', '#383838')
    chatBox.width(chatBoxProperties.width);
    chatBox.height(chatBoxProperties.height);
    chatBox.css('margin-left', '10px');
    chatBox.css('margin-top', '10px');
    chatBox.css('padding-top', '5px');
    chatBox.css('padding-left', '5px');
    chatBox.css('overflow', 'auto');

    for (let i = 0; i < messageCollection.messages.length; i += 1) {
        let messageContent = $('<div></div>')
        messageContent.addClass('message-content');

        messageContent.css('word-break', 'break-all')
        messageContent.css('color', 'white');

        let messageAuthor = $('<span></span>')
        messageAuthor.html(messageCollection.messages[i].author + ': ')
        messageAuthor.css('color', '#00ccff');


        messageAuthor.appendTo(messageContent);
        messageContent.append(messageCollection.messages[i].message);

        messageContent.appendTo(chatBox);
    }

    chatBox.animate({ scrollTop: $(document).height() }, "fast");

    chatBox.appendTo(popupMessageBox);

    let chatInputField = $('<input>')
    chatInputField.addClass('chat-input-field');
    chatInputField.attr('type', 'text');
    chatInputField.attr('placeholder', 'Type your message');
    chatInputField.css('margin-top', '10px');
    chatInputField.css('margin-left', '10px');
    chatInputField.css('background-color', '#F8F8F8')
    chatInputField.css('border', 'none')
    chatInputField.width(225)
    chatInputField.height(40)
    chatInputField.on('keydown', chatBoxEvent);
    chatInputField.css('padding-left', '5px');

    chatInputField.attr('data-from-username', localUser.username);
    chatInputField.attr('data-to-username', messageCollection.toUsername);

    chatInputField.appendTo(popupMessageBox);

    let exitButton = $('<div></div>');
    exitButton.html('X');
    exitButton.css('position', 'absolute');
    exitButton.css('right', btnCloseProperties.right);
    exitButton.css('top', btnCloseProperties.top);
    exitButton.css('color', '#A8A8A8');
    exitButton.css('cursor', 'pointer');
    exitButton.addClass('msg-exit-button');

    exitButton.appendTo(popupMessageBox);
}

function drawOnlineUsers(onlineUsers, localUserData, messageCollection) {
    usersWindow.html('');

    messageCollectionData = messageCollection;

    usersOnline = onlineUsers;

    localUser = localUserData;

    $('#my-profile-name').html(localUser.username);
    $('#my-profile-image').attr('src', localUser.imgUrl);

    for (let i = 0; i < onlineUsers.length; i += 1) {
        let userBox = $('<div></div>');

        userBox.addClass('user-box');
        userBox.css('padding-left', '2px');
        userBox.css('padding-top', '2px');

        let userImg = $('<img>')
        userImg.addClass('profile-image');
        userImg.attr('src', onlineUsers[i].imgUrl);

        userImg.width(imageProperties.width)
        userImg.height(imageProperties.height)
        userImg.css('float', 'left');
        userImg.css('border', '2px solid #00ccff')

        let statusBox = $('<div></div>');
        statusBox.addClass('status-box');

        let profileName = $('<div></div>');
        profileName.addClass('profile-name');
        profileName.html(onlineUsers[i].username);
        profileName.css('margin-left', '45px');
        profileName.css('color', '#00ccff')

        let profileStatusDot = $('<img>');
        profileStatusDot.addClass('profile-status-dot');
        profileStatusDot.width(statusDotProperties.width);
        profileStatusDot.height(statusDotProperties.height);
        profileStatusDot.css('float', 'left');
        profileStatusDot.css('margin-top', '4px');
        profileStatusDot.css('margin-left', '5px');

        let profileStatus = $('<div></div>');
        profileStatus.addClass('profile-status');

        profileStatus.css('float', 'left');
        profileStatus.css('margin-left', '5px');
        profileStatus.css('color', '#00ccff')

        if (onlineUsers[i].online) {
            profileStatusDot.attr('src', 'http://www.clker.com/cliparts/R/d/z/v/H/1/neon-green-dot-hi.png');
            profileStatus.html('Online');
        } else {
            profileStatusDot.attr('src', 'http://worldartsme.com/images/red-dot-clipart-1.jpg');
            profileStatus.html('Offline');
        }

        profileName.appendTo(statusBox);
        profileStatusDot.appendTo(statusBox);
        profileStatus.appendTo(statusBox);

        let messageBoxIcon = $('<img>');
        messageBoxIcon.attr('src', 'http://iconshow.me/media/images/Mixed/small-n-flat-icon/png/512/bubble.png');

        messageBoxIcon.css('position', 'relative');
        messageBoxIcon.css('right', messageBoxIconProperties.right + 'px');
        messageBoxIcon.css('bottom', messageBoxIconProperties.bottom + 'px');
        messageBoxIcon.width(messageBoxIconProperties.width);
        messageBoxIcon.height(messageBoxIconProperties.height);
        messageBoxIcon.addClass('message-box-icon');
        messageBoxIcon.attr('data-username', onlineUsers[i].username);
        messageBoxIcon.css('cursor', 'pointer');

        userImg.appendTo(userBox);
        statusBox.appendTo(userBox);
        messageBoxIcon.appendTo(userBox)

        userBox.width(userBoxProperties.width);
        userBox.height(userBoxProperties.height);

        userBox.css('background-color', '#585858');
        userBox.css('margin-top', '5px');

        userBox.appendTo(usersWindow);
    }
}

function setStylesToItems() {
    popup.css('position', 'fixed');
    popup.css('right', popupProperties.right);
    popup.css('bottom', popupProperties.bottom);
    popup.css('border', '1px solid black');
    popup.width(popupProperties.width);
    popup.height(popupProperties.height);
    popup.css('background-color', '#404040')

    btnClose.css('position', 'absolute');
    btnClose.css('right', btnCloseProperties.right);
    btnClose.css('top', btnCloseProperties.top);
    btnClose.css('color', '#A8A8A8');

    myStatus.css('float', 'left');
    myStatus.css('margin-left', '5px');

    profileName.css('color', '#00ccff')

    profileStatus.css('float', 'left');
    profileStatus.css('color', '#00ccff')
    profileStatus.css('margin-left', '5px');

    myStatusDot.width(statusDotProperties.width);
    myStatusDot.height(statusDotProperties.height);
    myStatusDot.css('float', 'left');
    myStatusDot.css('margin-top', '4px');
    myStatusDot.css('margin-left', '3px');

    profileImg.width(imageProperties.width);
    profileImg.height(imageProperties.height);
    profileImg.css('float', 'left');
    profileImg.css('border', '2px solid #00ccff');
    profileImg.css('margin-left', '5px');

    myProfile.css('margin-top', '5px');

    searchUserContainer.css('margin-top', '30px');

    searchUser.css('position', 'absolute');
    searchUser.css('left', searchProperties.left);
    searchUser.css('top', searchProperties.top);
    searchUser.css('background-color', '#303030');
    searchUser.css('border', '2px solid #00ccff');
    searchUser.css('padding-left', '5px');
    searchUser.css('color', 'white');
    searchUser.width(searchProperties.width);
    searchUser.height(searchProperties.height);

    usersWindow.css('background-color', '#505050')
    usersWindow.css('position', 'absolute')
    usersWindow.width(usersWindowProperties.width);
    usersWindow.height(usersWindowProperties.height);
    usersWindow.css('top', usersWindowProperties.top + 'px')
    usersWindow.css('left', usersWindowProperties.left + 'px')
    usersWindow.css('overflow', 'auto')

    popupMessageBox.width(popupMessageBoxProperties.width);
    popupMessageBox.height(popupMessageBoxProperties.height);
    popupMessageBox.css('position', 'fixed');
    popupMessageBox.css('right', popupMessageBoxProperties.right);
    popupMessageBox.css('bottom', popupMessageBoxProperties.bottom);
    popupMessageBox.css('background-color', '#404040')
    popupMessageBox.css('display', 'none');
}