const loginIdValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '请填写账号';
    }

    const resp = await API.exists(val);
    if (resp.data) {
        return '该账号已被占用,请重新填写';
    }
});

const nicknameValidator = new FieldValidator('txtNickname', function (val) {
    if (!val) {
        return '请填写昵称';
    }
})

const loginPwdValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '请填写密码';
    }
})

const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请确认密码';
    }
    
})


const form = $('.user-form');

form.onsubmit = async function(e){
    e.preventDefault();
    const result = await FieldValidator.validate([loginIdValidator,nicknameValidator,loginPwdValidator,loginPwdConfirmValidator]);
    if(!result){
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const resp = await API.reg(data);

    if(resp.code === 0){
        alert('注册成功');
        location.href = './login.html'
    }
}