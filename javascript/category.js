window.onload = function(){
    var l_startY,l_moveY,diffY;
    var currentY = 0;
    
    var ct_cLeft = document.querySelector('.ct_cLeft');
    var l_kind = ct_cLeft.querySelector('ul:last-of-type');
    var lis = l_kind.querySelectorAll('li');
    // 设置 左菜单拉动时上下可拉动最大距离
    var maxDiff = 100;
    var minTop = ct_cLeft.offsetHeight - l_kind.offsetHeight;// 负值

    l_kind.addEventListener('touchstart',function(e){
        l_startY = e.targetTouches[0].clientY;
        console.log(e);
    });
    l_kind.addEventListener('touchmove',function(e){
        l_moveY = e.changedTouches[0].clientY;
        diffY = l_moveY - l_startY;
        // 需要将l_startY 重新复制 ，不然每次执行move事件，startY均为同一个值，都会重复加一部分值
        l_startY = l_moveY;

        currentY += diffY;// 0+diff 

        // 当 currentY 超过一定范围 将top 值

        if(currentY > maxDiff){
            currentY = maxDiff;
        }else if(currentY < (minTop - maxDiff)){
            currentY = minTop - maxDiff;
        }
        // 先清除transition动画
        l_kind.style.transition = 'none';
        l_kind.style.top = currentY +'px'; 
    });
    l_kind.addEventListener('touchend',function(e){
// 松开时用动画将ul 回到顶端对齐 或者低端对齐
        if((0 <= currentY) && (currentY <= maxDiff)){
            // console.log('回到顶端对齐');
            l_kind.style.transition = 'top 0.5s';
            l_kind.style.top = 0 +'px';
            // 当回到顶端top = 0时，需要将currentY清零；
            currentY = 0;   
        }
        if((minTop - maxDiff) <= currentY && currentY <= minTop){
            // console.log('低端对齐');
            l_kind.style.transition = 'top 0.5s';
            l_kind.style.top = minTop +'px';
            
            // 此时回到低端，需要将currentY 可看成top 值 改为 低端对齐时的大小；
            currentY = minTop;
        }
    });
    // ul 的点击事件 先给每个li 添加index 属性
    for(var i = 0; i < lis.length;i++){
        lis[i].index = i;
    }
    
    //  移动端的单击事件，click 会有延迟 ，所以用touchstart touchmove touchend 模拟单击事件

};