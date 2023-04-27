// 页面开发思路可以按着这两个东西来做  页面初始化    交互事件

(function () {    
    // 获取需要的DOM结构
    const doms = {
        lrc: document.querySelector('.lrc'),
        audio: document.querySelector('audio'),
        container : document.querySelector('.container')
    }
    
    // 歌词事件对象储存
    let lrcData;

    // 页面初始化
    async function init(){
        // 需要渲染页面歌词 获取数据
        const word = await getLrc();   
        // 将歌词转化为数组对象的形式 [{time:6.3 words: 天阔阔雪漫漫共谁同航}]
        lrcData = word.split('\n').filter(item => item).map(item => {         
            const parts = item.split(']');
            const partsStr = parts[0].replace('[', ' ').split(':');
            return {
                time: +partsStr[0] * 60 + +partsStr[1],
                words: parts[1]
            }
        })
        // console.log(lrcData);
        // 歌词添加到 ul 中  循环比较麻烦  可以跟的简单 利用Map
        // let wordStr= '';
        // for(const item of lrcData){
        //    wordStr += `<li>${item.words}</li>`
        // }
        // doms.lrc.innerHTML = wordStr;

        const wordStr = lrcData.map(item => `<li>${item.words}</li>`).join('')
        doms.lrc.innerHTML = wordStr;
    }
    
    init()

    // 交互事件   什么事件   如何处理
    doms.audio.addEventListener('timeupdate',function(){
        setStatus(this.currentTime);
    })

    /**
     * 根据事件设置歌词的走向 和状态
     * @param {*} time 
     */
    function setStatus(time) {
        // 1.歌词的高亮显示 以及对应的词
        // 微调歌词 有点慢
        time += 0.4

        // 去掉之前的高亮歌词
        const activeLi = document.querySelector('.active');
        activeLi && activeLi.classList.remove('active');

        // 获取index 的下标 进行歌词高亮  找第一个歌词的时间比  传过来的时间大的 在 -1 就是他的歌词了
        let index = lrcData.findIndex(item => item.time > time) - 1; 
        if(index < 0){  // 小于 0 不做处理
            return
        } 
        doms.lrc.children[index].classList.add('active');

        // 2.歌词的整体移动 ul 滚动
        const li = doms.lrc.children[0].clientHeight * index
        const liHeight = doms.lrc.children[0].clientHeight;
        const conHeight = doms.container.clientHeight / 2;
        let top = (li + liHeight) - conHeight;
        top = -top;
        if(top > 0) {
            top = 0;
        }
        doms.lrc.style.transform = `translateY(${top}px)`;
    }

})()

