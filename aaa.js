//自执行函数
(function(){ 
	//查找元素的方法
	function selectElements(selector){

		//字面量声明数组:返回的结果
		var result = [];
		//如果参数selector的类型是字符串执行后面的内容
		if(typeof selector == "string"){

			//字面量声明,可直接使用正则表达式的方法
			var reg= /^[#\.a-zA-Z]/;
			if(reg.test(selector)){
				var first = selector[0];
				//传递参数ID
				if(first =="#"){
					 
					//elem是所有的元素，silce截取字符串，参数为下标,表示开始截取的地方
					var elem=document.getElementById(selector.slice(1));
					result  = elem ?[elem]:[];
				}else if (first == "."){
					   /*1. 先通过标签名获取所有的元素
					     2. for循环获取到每个元素
					     3. 获取当前的元素的类名
					     4. 用空格将当前类名切割
					     5.	用特殊符号将切割后的类名连接，例如###
					     6. 当前类名存在，则将它加入结果数组*/

					     var elems = document.getElementsByTagName("*");
					     for (var i =0;i<elems.length;i++){
					     	var name = elems[i].className;
					     	var string = "###"  +name.split(" ").join("###")+"###";
					     	if(string.search("###"  + selector.slice(1)+"###" ) != -1){
					     		result.push(elems[i]);
					     	}
						 }
					}else{
						var elems = document.getElementsByTagName(selector);

						//slice切割一个数组，并返回一个新的数组即变相的复制一份数组
						result=[].slice.call(elems,0);
						}
					}
		}
			else if (selector.nodeType == 1){
					result.push(selector);
				}
		return result;
	}
	//获取样式
	function getStyle(elem,style){
		//IE8及以下版本的样式
		if(elem.currentStyle){
			return currentStyle[style];
		}
		//IE9及以上版本
		else{
			return getComputedStyle(elem,false)[style];
		}
	}
	function isAddPx(property,value){
		var object = {
			"z-index":1,
			"opacity":1
		}
		  if(!object[property]){
		  	value +="px";
		  }
		 return value;
	}
	//构造函数
	//Init(a,d) argument用于接收使用对象的参数;
	function Init(selector){
		var arr = selectElements(selector);
		var len = arr.length;
		this.length = len;
		for(var i = 0;i<len;i++){
			this[i]=arr[i];
		}
	};
		//存储事件的对象
	 		var only=0;
	 		var events = {};
	Init.prototype = {
		//each对象只能在DOM情况下使用
		each:function(callback){
			//循环操作当前this对象下的每一个元素(this对象是一个类数组)
			for(var i = 0;i<this.length;i++){
				callback.call(this[i],i,this[i]);
			}
		},
		addClass:function(name){
			this.each(function(i,e){
				e.className += " " +name;
			})
		},
		hasClass:function(name){

			var arr=this[0].className.split(" ");
			var isExist = false;
			for(var i  = 0; i<arr.length;i++){
				if(arr[i]== name){
					isExist = true;
				}
			}
			return isExist;
		},
		removeClass: function(name){
			/*1. 循环找到每个div的classname
			  2. 匹配classname有没包含我们要删除的class(hasclass) 
			  3.把包含的div用string的replace方法替换成空
			*/
			//e是div等元素
			/*	this.each(function(i,e){
			 	if($(e).hasClass(name)==true){
			 	var classname=e.className;
			 	var newname=classname.replace(name," ");
				 e.className=newname;
				}
			 })*/
			 /*
			 for(var i= 0;i<$("div").length i++ ){}
					e = $("div")[i] == this[i]
			  */
			 var reg = new RegExp(" " + name+ " ","g");
			 this.each(function(i,e){ //e = this[i] 
			 	if($(e).hasClass(name)){
			 		var className = " " +e.className +" ";
			 		if(reg.test(className)){
			 			var new_name = className.replace(" " +name,"");
			 			e.className = new_name;
			 		}
			 	}
			 })	 
		},
		toggleClass:function(name){
			this.each(function(i,e){
				if($(e).hasClass(name)==true){
					$(e).removeClass(name);
				}
				else{$(e).addClass(name);}
			})
		},
		append:function(element){
			/*1. 先判断element是否是字符串
			  2. 如果是字符串则写入容器内
			  3.如果是元素节点，则在最后加入内容
			*/
			/*
			 1. this指向的是$()里面的对象
			 2. 返回的result是一个数
			 */
				this.each(function(i,e){
					if(typeof element == "string"){	
					e.insertAdjacentHTML("beforeend",element);
				}
				else if(element.nodeType == 1){
					var elem = element.cloneNode(true);
					e.appendChild(elem);
				}
			})
		},
		css:function(property,value){
			var arg_len=arguments.length;
			//设置CSS属性
			 //小生帮改的 
			/* if(typeof property == "string" && arg_len ==1){
			 
			 	//返回当前元素的property（样式值）
			 		return getStyle(this[0],property);		 
			  } 
			//设置CSS样式
			 if(arg_len ==2 && typeof property == "string"){
			 	if( typeof value ==="number"){
			 			value = isAddPx(property,value);
			 		}
			 		this[0].style[property] = value;
			 }
			 if(arg_len ==1 && property =="string"){
			 	 		 this[0].style[property]= value ;
			 		}
			},*/
			//老师的方法
			//argument用于接收使用对象的参数;
			//判断参数是否只有一个，并且数据类型是string
			if(arg_len== 1 && typeof property == "string"){
				//返回当前元素的样式
				//getstyle有两个参数，一个是元素，一个是样式
				return getStyle(this[0],property);
			}
			//设置
			//判断参数长度是2并且参数的数据类型是string
			if(arg_len ==2 && typeof property =="string" ){
				 //判断属性值的数据类型是否为number	 
				if(typeof value =="number"){
					
					//isAddPx：增加px的方法，参数有两个，一个是属性，一个数属性值，返回的是属性值value
					value = isAddPx(property,value);
				}
				//设置css属性值为参数value
				this[0].style[property] = value;
			}
			//设置多个style
			//判断属性（参数property）是否为object类型
			if(typeof property == "object"){
				//声明value，最后赋值给CSS属性值
				var value ;
				//for in 对象循环
				for(var key in property){
					//判断如果参数property的值类型是否为为number
					if(typeof property[key] =="number"){
						//isAddPx方法：如果不是opacity等比较特殊的情况，value值加px字符
						value = isAddPx(key,property[key]);
					}
					else{
						//value等于对象里的值
						value = property[key];
					}
					this[0].style[key] = value;
				}
			}
		},
	 	attr:function(attribute,value){
	 		
	 		var arg_len=arguments.length;
	 		//如果只有一个参数，则直接返回它的值
	 		if(arg_len==1 && typeof attribute == "string"){
	 			
	 			return this[0].getAttribute(attribute);
	 		}

	 		//如果有两个参数，则直接改变属性值
	 		if(arg_len == 2 &&  typeof attribute =="string"){
	 			this[0].setAttribute(attribute,value);
	 		}
	 		//如果参数是对象，则全部改变属性值
	 		if(typeof attribute == "object"){
	 			for(var key in attribute){
	 				this[0].setAttribute(key,attribute[key]);
	 			}
	 		}
	 	},
	 	sbilings:function(){
	 		/*1. 创建一个新对象
				2. 通过循环找到所有节点
				3.当节点不等于当前节点的时候
	 		*/
	 		var newDom = $("");
	 		var allNode = this[0].parentNode.children;
	 		var index = 0;
	 		for(var i = 0; i<allNode.length;i++){
	 			if(allNode[i] !=this[0]){
	 				newDom[index] = allNode[i];
	 				index++;
	 			}
	 		}
	 		newDom.length = index;
	 		return newDom;
	 	},
	 	next:function(){
	 	  var that = this[0];

	 	  function aaa(){
	 	  	// alert("rrr");
	 	  	var brother= that.nextSibling;
	 	  	if(brother.nodeType ==1){
	 	  		return brother ;

	 	  	}
	 	  	else if (brother.nodeType ==3){
	 	  		that = brother;
	 	  		return aaa();
	 	  	}
	 	  	else if(brother.nodeType == null){
	 	  		return null;
	 	  	}
	 	  }
	 	  return aaa();
	 	},
	 	prev:function(){
	 		var that = this[0];

	 	   function aaa(){
	 	  	 
	 	  	var brother= that.previousSibling;
	 	  	if(brother.nodeType ==1){
	 	  		return brother ;

	 	  	}
	 	  	else if (brother.nodeType ==3){
	 	  		that = brother;
	 	  		return aaa();
	 	  	}
	 	  	else if(brother.nodeType == null){
	 	  		return null;
	 	  	}
	 	  }
	 	  return aaa(); 
	 	},

	 	on:function(type,fn){

	 		this.each(function(i,e){
	 			//事件是一个对象，事件名是键，具有唯一性
	 			 only++;
	 			 var name = "handle" +only;//handle1
	 			 //把事件和事件名添加到events对象
	 			 events[name] = fn;
	 			 //绑定事件
	 			 addEvent(e,type,fn);
	 			 if(!e.eventName){
	 			 	e.eventName={};
	 			 }
	 			 if(!e.eventName[type]){
	 			 	e.eventName[type]=[];
	 			 }
	 			 /*把事件名添加到该元素的eventName属性上
					eventName是一个对象
					eventName={"click":["handle1"]}
	 			 */
	 			 
	 			e.eventName[type].push(name);
	 		})
	 	},
	 	off:function(type){
	 		this.each(function(i,e){
	 			if(e.eventName){
	 				//找到该元素下要删除的事件类型的事件名
	 				var arr = e.eventName[type];
	 				for(var i =0;i<arr.length;i++){
	 					//匹配events对象下的函数
	 					removeEvent(e,type,events[arr[i]]);
	 				}
	 			}
	 		})
	 	},
	 	
	 	remove:function(){

	 		//只能删除一个，多个删除不了
	 		/*var allNode = this[0].parentNode;
	 		var child = allNode.children;

	 		for(var i =0; i<child.length;i++){

	 			if(child[i]==this[0]){

	 				allNode.removeChild(this[0]);
	 			}
	 		}	
	 		return $(this[0]);
			*/
			this.each(function(i,e){
				var allNode = e.parentNode; 
				allNode.removeChild(e);
			})
			return this;
	 	},
	    /*parent必须是一个节点
		parent也必须是一个$()构造的对象*/
	  	appendTo:function(parent){
			var This = this;

			//判断parent是否为Init创建的对象
			if(parent instanceof Init){
				parent.each(function(i,e){  
					if( parent[0].nodeType == 1){
						var newelem =  This[0].cloneNode(true);
						 e.insertAdjacentElement("beforeend",newelem);
					}
					
				});
			}
		},
		//插入到第一个位置
		prepend:function(element){
		 	this.each(function(i,e){
					if(typeof element == "string"){	
						 
					e.insertAdjacentHTML("afterbegin",element);
				}
				else if(element.nodeType == 1){
					var elem = element.cloneNode(true);
					e.insertAdjacentElement("afterbegin",element);
				}
			})
		 },
		prependTo:function(parent){
		 	var This = this;
			if(parent instanceof Init){
				parent.each(function(i,e){  
					if( parent[0].nodeType == 1){
						var newelem =  This[0].cloneNode(true);
						 e.insertAdjacentElement("beforebegin",newelem);
					}
					
				});
			}
		 },
		//把Dom对象转换成类数组
		push:[].push,
		sort:[].sort,
		splice:[].splice
	}
	function addEvent(element,type,fn){
		if(element.addEventListener){
			element.addEventListener(type,fn,false);
		}else{
			element.attachEvent("on"+type,fn);
		}

	}
	function removeEvent(element,type,fn){
		if(element.removeEventListener){
			element.removeEventListener(type,fn,false);
		}else{
			element.detachEvent("on"+type,fn);
		}

	}

	function Dom(selector){
		return new Init(selector);
	};
	window.$ = Dom;
 }())