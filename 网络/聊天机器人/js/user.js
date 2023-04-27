// 用户登录和注册的表单项验证的通用代码

// 对某一个表单项进行验证的构造函数
class FieldValidator {
    /**
     * 
     * @param {String} txtId    文本框的Id
     * @param {Function} validatorFunc   验证规则函数，当需要对该文本框进行验证时，会调用该函数，函数的参数为当前文本框的值，函数的返回值为验证的错误消息，若没有返回，则表示无错误
     */
    constructor(txtId, validatorFunc) {
        // 需要获取一个id 和 她下面的一些子元素 进行后续操作
        this.input = $('#' + txtId);
        this.validatorFunc = validatorFunc;
        this.p = this.input.nextElementSibling;
        // 添加下失去焦点的事件进行验证 
        this.input.onblur = () => {
            this.validate()
        }
    }

    // 验证是否成功的方法 成功返回true  失败返回false  这里异步是因为有的地方需要返回异步
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            this.p.innerText = err
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    /**
     * 对传入的所有验证器进行统一的验证， 如果所有的验证均通过， 则返回true， 否则返回false
     * @param {FieldValidator[]} validators 
     */
    static async validate(...validators){
        const proms = await validators.map(v => v.validate())
        const reply = await Promise.all(proms);  // 得到一个数组形式的返回结果[true,false]
        return reply.every(i => i) // 全部为true 就为真  有一个false就为假
    }
}
