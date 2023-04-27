const login = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号'
    }
})

const loginPwd = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码'
    }
})

const form = $('.user-form');
form.onsubmit = async function (e) {
    e.preventDefault(); // 取消表单默认刷新事件
    const reply = await FieldValidator.validate(login, loginPwd)
    // 判断是否验证通过
    if (!reply) {
        return;
    }
    const data = {
        "loginId": login.input.value,
        "loginPwd": loginPwd.input.value
    }
    const re = await API.login(data);
    if (re.code === 0) {
        alert('登录成功，点击确定进入首页')
        location.href = './index.html'
    }
    if (re.code === 400) { // 有错误的情况下  告知错误
        loginPwd.input.value = '';
        loginPwd.p.innerText = re.msg;
    }
}