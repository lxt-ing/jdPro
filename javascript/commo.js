var itcast = {
    tap:function(el,callback){
        //  移动端的单击事件，click 会有延迟 ，所以用touchstart touchmove touchend 模拟单击事件
        // 模拟单击事件 注意点，1.单击时间小于300ms 2.move 距离小于30px 3.只有一根目标手指 
        var startTime,startY,startX;
        el.addEventListener('touchstart',function(e){
            // console.log(e.targetTouches);
            startY = e.targetTouches[0].clientY;
            startX = e.targetTouches[0].clientX;
            if(e.targetTouches.length > 1){
                return ;
            }
            // 记录开始时间
            startTime = Date.now();
        });
        el.addEventListener('touchend',function(e){
            var endPx = e.changedTouches[0].clientX;
            var endPy = e.changedTouches[0].clientY;
            if(Date.now()-startTime > 300){
                return ;
            }
            if(Math.abs(endPx - startX )< 6 && Math.abs(endPy - startY) < 6){
                // 执行回调函数，判断callback是否存在，并执行；
                callback && callback(e);
                // if(callback){
                //     callback(e);
                // }
            }
        });
    }
};