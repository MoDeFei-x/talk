//验证是否登录

(async () => {
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        alert('未登录或登录已过期，请重新登录');
        location.href = './login.html';
        return;
    }
    //下面的代码环境一定是登录状态

    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        msgContainer: $('.msg-container'),
        msg: $('.msg-container #txtMsg')
    }

    //注销事件
    doms.close.onclick = function () {
        API.loginOut();
        location.href = './login.html';
    }

    //设置用户信息
    setUserInfo();

    //加载历史记录
    await loadHistory();



    async function loadHistory() {
        const resp = await API.getHistory();
        for (const item of resp.data) {
            addChat(item);
        }
        scrollBottom();
    }

    function setUserInfo() {
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    }

    /*
        content: 'awdawdawd'
        createAt: 1652347192389
        from:  'haha'
        to: null
    */
    function addChat(chatInfo) {
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatInfo.from) {
            div.classList.add('me');
        }
        const img = $$$('img');
        img.classList.add('chat-avatar');
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

        const content = $$$('div');
        content.classList.add('chat-content');
        content.innerText = chatInfo.content;

        const date = $$$('div');
        date.classList.add('chat-date');
        date.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);

        doms.chatContainer.appendChild(div)

    }

    //让聊天区域的滚动条到底部
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDay().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    }

    //发送消息

    async function sendChat() {
        const content = doms.msg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            content,
            from: user.loginId,
            to: null,
            createdAt: Date.now(),
        })
        doms.msg.value = '';
        scrollBottom();
        const resp = await API.sendChat(content);

        addChat({
            from: null,
            to: user.loginId,
            content: resp.data.content,
            createdAt: resp.data.createdAt,
        })
        scrollBottom();
    }

    doms.msgContainer.onsubmit = function (e) {
        e.preventDefault();
        sendChat();
    }


    // window.sendChat = sendChat;

})()