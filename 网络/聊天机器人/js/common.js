// 封装获取元素代码
function $(element){
    return document.querySelector(element);
}

function $$(element) {
    return document.querySelectorAll(element);
}

// 创建元素的函数
function $$$(element) {
    return document.createElement(element);
}
