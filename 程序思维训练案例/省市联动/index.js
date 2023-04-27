(async function () {
    // 获取需要的dom
    const doms = {
        selProvince: document.getElementById('selProvince'),
        selCity: document.getElementById('selCity'),
        selArea: document.getElementById('selArea'),
    }
    // 获取数据
    const datas = await getDatas()
    console.log(datas);

    // 页面初始化
    function init() {
        fillSelece(doms.selProvince, datas);
        fillSelece(doms.selCity, []); // 一开始无法 禁用状态
        fillSelece(doms.selArea, []); // 一开始无法 禁用状态
    }
    init()

    /**
     * 创建一个功能函数  用于渲染某个下拉列表中的数据
     * 它还极具通用性
     * @param {*} select  被添加数据的是那个下拉列表
     * @param {*} list 添加的数据 数组形式传入  如传入为空 被添加数据的就为禁选状态
     */
    function fillSelece(select, list) {
        // 判断下数组是为空吗  空就禁用
        select.className = `select ${list.length?'':'disabled'}`;
        // 修改下拉列表中span 的文字
        const tiName = select.dataset.name; // 获取到自定义的属性了  进行拼接
        const span = select.querySelector('.title span');
        span.innerText = `请选择${tiName}`; // 进行拼接

        select.data = list; //把填充的数据放到dom中  后续就直接取来使用就行

        const ul = select.querySelector('.options');
        // for(const item of list){
        //     const li = document.createElement('li');
        //     li.innerText = item.label;
        //     ul.appendChild(li);
        // }
        ul.innerHTML = list.map(item => `<li>${item.label}</li>`).join('');
    }

    // 用户交互   事件注册
    regCommonEvent(doms.selProvince)
    regCommonEvent(doms.selCity)
    regCommonEvent(doms.selArea)

    regProvince()
    regCity()
    /**
     * 注册公共的事件 title 和  ul
     * @param {*} select   要注册是那个DOM 
     */
    function regCommonEvent(select) {
        // 1.title 点击事件
        const title = select.querySelector('.title');
        title.addEventListener('click', () => {
            // 判断一下在注册的DOM上有没有禁用的类名 有不做任何操作
            if (select.classList.contains('disabled')) {
                return;
            }
            const expand = document.querySelectorAll('.select.expand');
            // 点击的时候除了自己以外的全部收回
            for (const item of expand) {
                if (item !== select) {
                    item.classList.remove('expand')
                }
            }
            select.classList.toggle('expand')
        })

        // 2.ul点击事件
        const ul = select.querySelector('.options');
        ul.addEventListener('click', (e) => {
            if (e.target.tagName !== 'LI') {
                return // 必须要点击LI才进行处理
            }
            // 取消之前所选中的
            const active = select.querySelector('li.active');
            active && active.classList.remove('active');
            // 获取li
            const li = e.target;
            li.classList.add('active');
            // 修改文本
            const span = select.querySelector('.title span');
            span.innerText = li.innerText; // 进行文字的修改
            // 选中后折叠
            select.classList.remove('expand')
        })
    }

    let da;
    // 省份点击事件
    function regProvince() {
        const ul = doms.selProvince.querySelector('.options');
        ul.addEventListener('click', (e) => {
            if (e.target.tagName !== 'LI') {
                return
            }
            // const li = e.target;
            // const city = datas.find(item => item.label === li.innerText)
            // da = city.children;
            // console.log(city.children);
            // fillSelece(doms.selCity, city.children);
            // regCommonEvent(doms.selCity)
            // 这样的写法需要有把参数放到公共区域中  不好

            console.log(doms.selProvince.data);
            const li = e.target;
            const city = doms.selProvince.data.find(item => item.label === li.innerText)
            console.log(city);
            fillSelece(doms.selCity, city.children);
            // regCommonEvent(doms.selCity)

            fillSelece(doms.selArea, []);

        })
    }

    // 城市点击事件
    function regCity() {
        const ul = doms.selCity.querySelector('.options');
        ul.addEventListener('click', (e) => {
            if (e.target.tagName !== 'LI') {
                return
            }
            // const li = e.target;
            // const area = da.find(item => item.label === li.innerText)
            // // console.log(area);
            // fillSelece(doms.selArea, area.children);
            // regCommonEvent(doms.selArea)
            // 这样的写法需要有把参数放到公共区域中 不好

            console.log(doms.selCity.data);
            const li = e.target;
            const area = doms.selCity.data.find(item => item.label === li.innerText)
            // console.log(area);
            fillSelece(doms.selArea, area.children);
            // regCommonEvent(doms.selArea)

        })
    }

})()