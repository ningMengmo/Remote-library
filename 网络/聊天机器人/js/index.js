// 验证是否有登录，如没有登陆 跳转到登陆界面 如有登录获取登录界面信息
(async function () {
    const resp = await API.profile()
    // console.log(resp);
    const user = resp.data;
    if (resp.code === 401) {
        // 未登录的状态
        alert('未登录，或登录已过期')
        location.href = './login.html'
        return
    }

    // 没进if说明是登录上了   接下来就做页面的初始化

    // 获取需要的DOM 
    const doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        container: $(".chat-container"),
        txtMsg: $('#txtMsg'),
        msgContainer: $('.msg-container'),
    }
    setUserInfo()
    // await History()

    // 添加事件
    doms.msgContainer.onsubmit = function (e) {
        e.preventDefault();
        sendChat();
    };

    // 注销事件
    doms.close.onclick = function () {
        API.loginOut();
        location.href = './login.html'
    }

    // 设置用户信息
    function setUserInfo() {
        doms.aside.nickname.innerText = user.nickname;
        doms.aside.loginId.innerText = user.loginId;
    }

    // 获取聊天消息   理解就行  API有问题了
    // async function History() {
    //     const resp = await API.getHistory()
    //     // console.log(resp);
    //     for (const item of resp.data) {
    //         addChat(item)
    //     }
    //     scrollBottom()
    // }

    /**
     * 添加聊天的内容和信息渲染到页面
     * @param {object} chatInfo   传输为对象
     */
    function addChat(chatInfo) {
        // 创建对应的DOM
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatInfo.form) {
            // 进入说明是自己发送的消息
            div.classList.add('me');
        }

        const img = $$$('img');
        img.className = 'chat-avatar';
        img.src = chatInfo.form ? './asset/avatar.png' : './asset/robot-avatar.jpg'

        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content;

        const date = $$$('div');
        date.className = 'chat-date';
        date.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);
        container.appendChild(div);
    }

    /**
     * 时间戳的解析
     * @param {*} timestamp   传入时间戳
     * @returns 时间 
     */
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const data = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${data} ${hours}:${minutes}:${seconds}`
    }

    // 滚动条事件一直在底部
    function scrollBottom() {
        doms.container.scrollTop = doms.container.scrollHeight;
    }

    // 聊天消息
    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(),
            content,
        });
        doms.txtMsg.value = '';
        scrollBottom();

        const resp = await API.sendChat(content);
        addChat({
            from: null,
            to: user.loginId,
            ...resp.data,
        });
        scrollBottom();
    }


})()