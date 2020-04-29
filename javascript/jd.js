/*jshint esversion: 6 */
//  使用 函数表达式 存储setInverval 函数
window.onload = function(){
    var spikeInterval,bannerInterval;
    var dotStr = [];
    var isEnd = true;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var banner = document.querySelector('.jd_banner');
    var bannerHeight = banner.offsetHeight;
    var search = document.querySelector('.jd_search');
    var bannerList = document.querySelector('.jd_bannerImg');
    var lis = bannerList.querySelectorAll('li');
    var bannerOl = banner.querySelector('ol');
    // var dots = bannerOl.querySelectorAll();
    var spikeSpans = document.querySelector('.jd_spike_left').querySelectorAll('span');
    window.onscroll = function(e){
        // 1.使用原生js实现搜索栏背景颜色变化
        if(scrollTop <= bannerHeight){
            search.style.backgroundColor = 'rgba(233, 73, 73,'+scrollTop/bannerHeight+')';
        }
    };
    
    //  2. 京东秒杀事件
    var timeSpike = spikeDuration('2020-04-25 16:55:40');
    clearInterval(spikeInterval);
    if(timeSpike > 0 ){
        // 当时间大于0时执行
        spikeInterval = setInterval(function(){
            if(timeSpike == 0){
                clearInterval(spikeInterval);
                return ;
            }
            timeSpike--;
            spikeSpans[1].textContent = timeFormat(timeSpike).h < 10?0:Math.floor(timeFormat(timeSpike).h/10);
            spikeSpans[2].textContent = timeFormat(timeSpike).h%10;
            spikeSpans[4].textContent = timeFormat(timeSpike).m < 10?0:Math.floor(timeFormat(timeSpike).m/10);
            spikeSpans[5].textContent = timeFormat(timeSpike).m%10;
            spikeSpans[7].textContent = timeFormat(timeSpike).s < 10?0:Math.floor(timeFormat(timeSpike).s/10);
            spikeSpans[8].textContent = timeFormat(timeSpike).s%10;
        },1000);
        
    }
    for(var i = 0;i < lis.length;i++){
        //  添加样式
        dotStr[i] = '<li></li>';
    }

    bannerOl.insertAdjacentHTML('afterbegin',dotStr.join(''));
    var dots = bannerOl.children;
    // banner自动播放事件，双侧滚动，首先首尾添加图片
    var first = lis[0].cloneNode(true);
    var last = lis[lis.length - 1].cloneNode(true);
    // 在前面插入 last
    bannerList.insertBefore(last,lis[0]);
    // 在后面插入first
    bannerList.appendChild(first);

    // 改变结构后，改变样式 宽高
    dots[0].classList.add('current');
    bannerList.style.left = '-100%';
    // bannerList.style.width = (lis.length+2) +'00%' ;
    bannerList.style.width = (lis.length+2)*banner.offsetWidth +'px' ;

    // 教程中需要resize 时重新获取宽高，但是因为这里用到百分比，所以没有出现那种情况，这里忽略
    
    // 制作自动轮播
    var bannerindex = 1;
    var startBannerInterval = function(){
        console.log(bannerindex);
        console.log('----------------');
        bannerindex++;
        // bannerList.style.left = -bannerindex+'00%';// 左移位置
        bannerList.style.transition = 'left 0.3s'; // 移动时间
        bannerList.style.left = -bannerindex*banner.offsetWidth + 'px';// 左移位置
    };
    // 执行轮播之前清楚轮播
    clearInterval(bannerInterval);
    bannerInterval = setInterval(startBannerInterval,1000);

    // banner 手指touch事件
    var startX,startY,moveX,moveY,distanceX;
    //  设置isEnd 判断过渡效果是否完成，完成后才能进行下一次拖拽
    
    banner.addEventListener('touchstart',function(et){
        // 禁用自带事件
        et.preventDefault();

        if(!isEnd){
            // 禁用触屏事件
            return ;
        }

        // 去掉过度样式效果 !!! 
        bannerList.style.transition = 'none';
        clearInterval(bannerInterval);
        // 获取开始坐标x
        startX = et.targetTouches[0].clientX;
    });
    banner.addEventListener('touchmove',function(et){
        et.preventDefault();

        if(!isEnd){
            // 禁用触屏事件
            return ;
        }
        // 过渡动画结束后才能 执行 在touchend 时 将isEnd 标记为false
        
        // 移动后的坐标x
        endX = et.targetTouches[0].clientX;
        // 移动的距离
        distanceX = endX-startX;
        //  如果向右滑，endX-startX > 0;
        if(distanceX !== 0){
            bannerList.style.left = -bannerindex*banner.offsetWidth + distanceX + 'px';
        }
    });

    banner.addEventListener('touchend',function(et){
        et.preventDefault();

        isEnd = false; // 设置isEnd false 将坐标重置
        //  定位banner，重新开始滑动
        // 如果小于1/3 bannerindex 不变；大于1/3 bannerindex 改变
        if(Math.abs(distanceX) > (banner.offsetWidth/3)){
            if(distanceX < 0){
                // 向左滑动
                bannerindex++;
            }else if(distanceX > 0){
                bannerindex--;
            }
        }

        bannerList.style.transition = 'left 0.3s';
        // bannerList.style.left = -bannerindex+'00%';
        bannerList.style.left = -bannerindex*banner.offsetWidth + 'px';
        distanceX = 0;
    });

    // bannerList 每次执行完transition后调用的方法 ,所有对于bannerinder的判断都在这里做
    bannerList.addEventListener('webkitTransitionEnd',function(){
        for(var i = 0;i < dots.length;i++){
            // 移除dots的current类
            dots[i].classList.remove('current');
        }
        //  bannerindex == 0; 此时需要将left 改成倒数第二个
        console.log(bannerindex+'----------End');
        if(bannerindex == 0){
        // 当移动到最前面一张的时候 将left改变 到倒数第二张
            bannerindex = bannerList.children.length-2;
            bannerList.style.transition = 'none';
            bannerList.style.left = -bannerindex*banner.offsetWidth + 'px';
            dots[bannerList.children.length-3].classList.add('current');
        }else{
            if(bannerindex == bannerList.children.length-1){
                // 当滑动到右边最后一张，将left 改成第二张；
                    bannerindex = 1;
                    bannerList.style.transition = 'none';
                    bannerList.style.left = -bannerindex*banner.offsetWidth + 'px';
                }
                dots[bannerindex-1].classList.add('current');
        }
        setTimeout(function(){
            console.log(bannerindex+'----------isEnd');
            isEnd = true;
            clearInterval(bannerInterval);
            bannerInterval = setInterval(startBannerInterval,1000);
            
        },200);
    });
    
    // 鼠标悬挂在banner
    banner.addEventListener('mouseenter',function(){
        clearInterval(bannerInterval);
    });
    banner.addEventListener('mouseleave',function(){
        // 重新开始;
        clearInterval(bannerInterval);
        bannerInterval = setInterval(startBannerInterval,1000);
    });

    for(let i = 0; i < dots.length;i++){
        dots[i].addEventListener('mouseenter',function(){
            for(var j = 0;j < dots.length;j++){
                dots[j].classList.remove('current');
            }
            bannerindex = i + 1;
            bannerList.style.transition = 'left 0.3s';
            // bannerList.style.left = -bannerindex+'00%';
            bannerList.style.left = -bannerindex*banner.offsetWidth + 'px';
            dots[i].classList.add('current');
        });
    }
    window.onfocus = function(){
        clearInterval(bannerInterval);
        bannerInterval = setInterval(startBannerInterval,1000);
    };
    window.onblur = function(){
        clearInterval(bannerInterval);
    };
};
  // 时间格式转换
function timeFormat(time){

    var h = parseInt(time/3600);
    var m = parseInt(time%3600/60);
    var s = parseInt(time%60);

    // h = h<10?'0'+h:h;
    // m = m<10?'0'+m:m;
    // s = s<10?'0'+s:s;

    return timeObj = {
        h:h,
        m:m,
        s:s
    }
}

//  给定时间 得出时长 deadline 时间格式为 '2019-11-02 12:00'
function spikeDuration(deadline){
    var date = new Date;
    deadline = new Date(deadline);
    var duration = deadline.getTime()-date.getTime();
    return parseInt(duration/1000);
}

//  可以考虑在ol下面添加一个元素用于current的改变，减少for的使用