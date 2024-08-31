// 用户登录和注册的表单项验证的通用代码


class FieldValidator {
    /**
     * 
     * @param {String} txtId 文本框的ID
     * @param {Function} validatorFunc 验证规则函数，当需要对该文本进行验证时，会调用该函数
     */
    constructor(txtId, validatorFunc) {
        this.input = $(`#${txtId}`);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        }
    }

    /**
     * 验证成功返回true,验证失败返回false
     */
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            //有错误
            this.p.innerText = err;
            return false;
        } else {
            //没有错误
            this.p.innerText = '';
            return true;
        }
    }

    static async validate(validators) {
        const proms = validators.map(v => v.validate());

        const results = await Promise.all(proms) 
        return results.every(r => r)
    }
}




