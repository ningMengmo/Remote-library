const loginId = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号'
    }
    const exists = await API.exists(val);
    // console.log(exists);
    if (exists.data) {
        return '英雄所见略同，请重新选择一个账号'
    }
    if (exists.msg) {
        return '账号长度为20个字符以内'
    }
});

const nickName = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称'
    }
})


const loginPwd = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码'
    }
})

const pwdConfirm = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请填写确认密码'
    }
    if (val !== loginPwd.input.value) {
        return '两次密码不一致'
    }
})

// 表单提交看所有是否通过验证
const form = $('.user-form');
form.onsubmit = async function (e) {
    e.preventDefault(); // 取消表单默认刷新事件
    const reply = await FieldValidator.validate(loginId, nickName, loginPwd, pwdConfirm)
    // 判断是否验证通过
    if(!reply){
        return;
    }
    const data = {
        "loginId": loginId.input.value,
        "nickname": nickName.input.value,
        "loginPwd": loginPwd.input.value
    }
    
    const re = await API.reg(data);
    if (re.code === 0){
        alert('注册成功，点击确定跳转到登录页面')
        location.href = './login.html'
    }
}