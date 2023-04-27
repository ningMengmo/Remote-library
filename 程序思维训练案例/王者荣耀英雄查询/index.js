(async function () {
    // 1.页面初始化 
    // 获取需要的DOM
    const doms = {
        ul: document.querySelector('.list'),
        radios: document.querySelectorAll('.radio'),
        word: document.querySelector('.word input')
    }

    // 获取数据
    const allHeroes = await getHeroes()
    console.log(allHeroes);
    heroesHTML(allHeroes)

    /**
     * 渲染数据到页面  传对应的数组就能渲染对应的数据
     * @param {*} heroes  传参为数组的形式
     */
    function heroesHTML(heroes) {
        doms.ul.innerHTML = heroes.map((h) =>
            `<li><a href="https://pvp.qq.com/web201605/herodetail/${h.ename}.shtml" target="_blank">
                <img src = "https://game.gtimg.cn/images/yxzj/img201606/heroimg/${h.ename}/${h.ename}.jpg">
                <span>${h.cname}</span>
                </a></li>`
        ).join('')
    }


    // 2.用户(事件)交互
    // 循环添加事件 按钮点击
    for (const r of doms.radios) {
        r.addEventListener('click', function () {
            // 1.点中后有选中的高亮
            setChoose(this);
            // 2.根据选择的高亮更改对应的数据
            setHeroes(this);
        })
    }

    // 选中后添加高亮
    function setChoose(radio) {
        // 取消之前选择中添加的样式
        const checkRa = document.querySelector('.radio.check')
        checkRa && checkRa.classList.remove('check')
        // 选中后添加样式
        radio.classList.add('check');
    }

    /**
     * 判断选择中的按钮 进行对应的数据提取
     * 三种情况的判断
     * all
     * pay_type
     * hero_type, hero_type2
     * @param {*} radio 传选中的是那个值 
     */
    function setHeroes(radio) {
        let heroes;
        const type = radio.dataset.type;
        const value = radio.dataset.value;
        if (type === 'all') {
            heroes = allHeroes;           
        } else if (type === 'pay_type') {
            heroes = allHeroes.filter(item => item.pay_type == value)     
        } else if (type === 'hero_type') {
            heroes = allHeroes.filter(item => item.hero_type == value || item.hero_type2 == value)
        }
        heroesHTML(heroes)
    }

    // 搜索事件
    doms.word.addEventListener('input' ,function (){
        // 利用过滤加 includes() 判断 是否有需要的字体
        let tex = allHeroes.filter(item => item.cname.includes(this.value));
        heroesHTML(tex);
        // 在查找时候设置为全部的点位
        setChoose(document.querySelector('.radio[data-type="all"]'))
    })

})()