// 放在外面会污染全局 尽可能的减少污染就把它放在立即执行函数中  返回个对象 用对象的形式进行调用
var API = (function () {
    // 接口提升  常量定义全局  方便修改
    const BAE_URL = 'https://study.duyiedu.com';
    const TOKEY_KEY = 'token';

    // 封装以一下GET 和 POST 让代码更加简洁  还需获取令牌
    function get(path) {
        const headers = {}
        const token = localStorage.getItem(TOKEY_KEY);
        if (token) { // 判断localStorage中有没有令牌有就添加带上
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BAE_URL + path, {
            headers
        });
    }

    function post(path, bodyObj) {
        const headers = {
            "Content-Type": 'application/json'
        }
        const token = localStorage.getItem(TOKEY_KEY);
        if (token) { // 判断localStorage中有没有令牌有就添加带上
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BAE_URL + path, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        });
    }


    // 注册接口
    /**
     * 
     * @param {*} userInfo  传输的已经是一个满足格式的对象了 
     * @returns  返回一个promise
     */
    async function reg(userInfo) {
        return await post('/api/user/reg', userInfo).then(res => res.json()) // 这部是得到响应的结果解析 返回
    }

    // 登录接口   登录接口需要获取一个令牌  保存其中
    async function login(loginInfo) {
        const result = await post('/api/user/login', loginInfo) // 获取到的是响应头的信息 在响应体
        const reply = await result.json();
        if (reply.code === 0) { // 判断登录成功了没  成功了才保存令牌
            // 获取头部信息中的令牌
            const token = result.headers.get('authorization');
            console.log(token);
            localStorage.setItem(TOKEY_KEY, token); // 保存到本地储存中
        }
        return reply;
    }

    // 验证账号接口
    async function exists(loginId) {
        const reply = await get('/api/user/exists?loginId=' + loginId)
        return reply.json();
    }

    // 当前登录用户信息接口
    async function profile() {
        return await get('/api/user/profile').then((res) => res.json())
    }

    // 发送聊天接口
    async function sendChat(content) {
        return await post('/api/chat', {
            content,
        }).then((res) => res.json());
    }

    // 获取聊天消息接口
    async function getHistory() {
        await get('/api/chat/history').then(res => res.json());
    }

    // 清除登录信息
    function loginOut() {
        localStorage.removeItem(TOKEY_KEY);
    }

    return {
        reg,
        login,
        exists,
        profile,
        sendChat,
        getHistory,
        loginOut
    }
})()