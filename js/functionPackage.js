//前一个兄弟节点
function previousNode(obj){
	if(obj.previousElementSibling){
		return obj.previousElementSibling;//火狐谷歌IE9
	}else{
		return obj.previousSibling;//IE 6 7 8 
	}
}
//后一个兄弟节点
function nextNode(obj){
	if(obj.nextElementSibling){
		return obj.nextElementSibling;//火狐谷歌IE9
	}else{
		return obj.nextSibling;//IE 6 7 8 
	}
}
//获取任意一个兄弟节点---不包含自己
function Siblings (ele){
	var arr=[];
	var nodes = ele.parentNode.children;
	for(var i=0;i<nodes.length;i++){
		if(nodes[i]!==ele){
			arr.push(nodes[i]);
		}
		return arr;
	}
}
//第一个子节点
function firstNode(obj){
	if(obj.firstElementChild){
		return obj.firstElementChild;//火狐谷歌IE9
	}else{
		return obj.firstChild;//IE 6 7 8 
	}
}
//最后一个子节点
function lastNode(obj){
	if(obj.lastElementChild){
		return obj.lastElementChild;//火狐谷歌IE9
	}else{
		return obj.lastChild;//IE 6 7 8 
	}
}
//计时器缓冲函数(水平-左右)
function animateLeft(ele,target){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		var step = (target - ele.offsetLeft)/10;
		step = step>0?Math.ceil(step):Math.floor(step);
		ele.style.left = ele.offsetLeft + step + "px";
		if(Math.abs(target-ele.offsetLeft)<Math.abs(step)){
			ele.style.left = target + "px";
			clearInterval(ele.timer);
		}
	},30);
}
//--计时器缓冲函数(垂直-上下)
function animateTop(ele,target){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		var step = (target - ele.offsetTop)/10;
		step = step>0?Math.ceil(step):Math.floor(step);
		ele.style.top = ele.offsetTop + step + "px";
		if(Math.abs(target-ele.offsetTop)<Math.abs(step)){
			ele.style.top = target + "px";
			clearInterval(ele.timer);
		}
	},30);
}
//缓冲水平垂直运动
function animateLeftTop(ele,targetX,targetY){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		//水平
		var stepX = (targetX - ele.offsetLeft)/10;
		stepX = stepX>0?Math.ceil(stepX):Math.floor(stepX);
		ele.style.left = ele.offsetLeft + stepX + "px";
		if(Math.abs(targetX-ele.offsetLeft)<Math.abs(stepX)){
			ele.style.left = targetX + "px";
			clearInterval(ele.timer);
		}
		//垂直
		
		var stepY = (targetY - ele.offsetTop)/10;
		stepY = stepY>0?Math.ceil(stepY):Math.floor(stepY);
		ele.style.top = ele.offsetTop + stepY + "px";
		if(Math.abs(targetY-ele.offsetTop)<Math.abs(stepY)){
			ele.style.top = targetY + "px";
			clearInterval(ele.timer);
		}
	},30);
}
//--scroll()封装
function scroll(){
	if(window.pageYOffset !== undefined){
		//---火狐/谷歌/ie9+以上支持的
		return {
            "top": window.pageYOffset,
            "left": window.pageXOffset
        };
	}else if(document.compatMode === "CSS1Compat"){
		//---已经声明DTD,（IE678只认识他）,compatMode渲染模式
		return {
            "top": document.documentElement.scrollTop,
            "left": document.documentElement.scrollLeft
        };
	}else{
		//---未声明 DTD（谷歌只认识他）
		return {
            "top": document.body.scrollTop,
            "left": document.body.scrollLeft
        };
    }
}
//clientHeight
function client(){
	if(window.innerHeight !== undefined){//---火狐/谷歌/ie9+以上支持的
		return {
            "width": window.innerWidth,
            "height": window.innerHeight
        }
	}else if(document.compatMode === "CSS1Compat"){
        return {//---已经声明DTD,（IE678只认识他）,compatMode渲染模式
            "width": document.documentElement.clientWidth,
            "height": document.documentElement.clientHeight
        }
	}else{
        return {//---未声明 DTD（谷歌只认识他）
            "width": document.body.clientWidth,
            "height": document.body.clientHeight
        }
    }
}
//页面字体封装
function Rem(picwidth,prem){
	var html = document.getElementsByTagName("html")[0];
	var ScreenWidth = client().width;
	html.style.fontSize = ScreenWidth/picwidth * prem + "px";
}
//鼠标拖动
function grag(obj){
	obj.onmousedown = function(ev){
		var ev = ev||window.event;
		var disX =ev.clientX - this.offsetLeft;
		var disY = ev.clientY - this.offsetTop;
		//---setCapture锁定当前事件（当前指定元素）
		if(obj.setCapture){
			obj.setCapture();
		}
		document.onmousemove = function(ev){
			var ev = ev||window.event;
			var moveLeft =  ev.clientX - disX;
			if(moveLeft<0){
				moveLeft =0;
			}else if(moveLeft>client().width - obj.offsetWidth){
				moveLeft = client().width - obj.offsetWidth;
			}
			var moveTop = ev.clientY - disY;
			if(moveTop<0){
				moveTop =0;
			}else if(moveTop>client().height-obj.offsetTop){
				moveTop = client().height-obj.offsetTop;
			}
			
			obj.style.left = moveLeft + "px";
			obj.style.top = moveTop + "px";
		}
		document.onmouseup = function(){
			document.onmousemove = null;
			document.onmouseup = null;
			if(obj.releaseCapture){
				obj.releaseCapture();
			}
			return;
		}
	}
}
//放大镜函数
function showBig(minbox,minImg,mask,maxbox,maxImg){
	minbox.onmousemove = function(event){
		var ev = event||window.event;
		mask.style.display = "block";
		maxbox.style.display = "block";
		//--蒙版移动(鼠标就在蒙版的中间)
		var maskL = ev.clientX - minbox.offsetLeft - mask.offsetWidth/2;
		var maskT = ev.clientY - minbox.offsetTop - mask.offsetHeight/2;
		//--蒙版的移动范围
		var maxmoveX = minbox.offsetWidth - mask.offsetWidth;
		var maxmoveY = minbox.offsetHeight - mask.offsetHeight;
		if(maskL>=maxmoveX){
			maskL = maxmoveX;
		}else if(maskL<0){
			maskL = 0;
		}
		if(maskT>=maxmoveY){
			maskT = maxmoveY;
		}else if(maskT<0){
			maskT = 0;
		}
		mask.style.left = maskL + "px";
		mask.style.top = maskT + "px";
		
		//控制移动比例
		var scale = maxImg.offsetWidth/minImg.offsetWidth;
		maxImg.style.left = -maskL * scale + "px";
		maxImg.style.top = -maskT * scale +"px";			
		
		minbox.onmouseout = function(){
			mask.style.display = "none";
			maxbox.style.display = "none";
		}
	}	
}
//动画封装获取所有css样式
function getCssStyle(ele,attr){
	if(window.getComputedStyle(ele,null)){
		return window.getComputedStyle(ele,null)[attr];
	}else{
		return ele.currentStyle[attr];
	}
}
//动画回调函数（队列动画）
function animate(ele,json,fn){
	clearInterval(ele.timer);
	ele.timer = setInterval(function(){
		var flag = true;
		for(key in json){
			if(key==='opacity'){
				var leader = getCssStyle(ele,key)*100||1;
			}else{
//							var leader = getCssStyle(ele,key)||0;
				 leader = parseInt(getCssStyle(ele,key))||0;
			}
			
			var step = (json[key] - leader)/10;
			step = step>0?Math.ceil(step):Math.floor(step);
			leader = leader + step;
			
			if(key==='opacity'){
				ele.style[key] =leader/100;
				ele.style.filter = 'alpha(opacity='+leader+')';
			}else if(key==='z-index'){
				ele.style.zIndex = json[key];
			}else{
					ele.style[key] =leader + "px";
			}
			if(json[key]!==leader){
				flag =false;
			}
		}
		if(flag){
			clearInterval(ele.timer);
			//只要有回调函数就直接调用
			if(fn){
				fn();
			}
		}
	},20);
}
//添加事件监听
//addEventHaddler(inner,'click',inner1);
//addEventHaddler(inner,'click',inner3);(备注)
function addEventHaddler(obj,type,fn){
	if(obj.addEventListener){
		obj.addEventListener(type,fn,false);
	}else{
		obj.attachEvent('on'+type,fn);
	}
}
//---移除事件监听
//removeEventHaddler(inner,'click',inner3);
function removeEventHaddler(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false);
	}else{
		obj.detachEvent('on'+type,fn);
	}
}
