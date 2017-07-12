(function($){
	jQuery.fn.dropDownMenu = function(options){ 
		//创建一些默认值，拓展任何被提供的选项
		var settings = $.extend({
		'width': '400px',
		'height': '400px',
		'data':[1,2,3],
		"click":function(that){}//点击li标签回调事件
		}, options);
		
		var _this=this;
		var methods={
			//生成下拉菜单
			init:function(data){
				var top=_this.height();
				var tdWidth=_this.width();
				var dropDown="<div class='group_drop_down'>";
				var groupName="<div class='group_name'>--请选择--</div>"
				dropDown+="<ul class='dropdown_menu'></ul>";
				dropDown+="<input type='text'  class='group_search' placeholder='搜索关键字' />";
				dropDown+="<span class='search_icon'></span>";
				dropDown+="</div>";
				_this.append(groupName).after(dropDown).next(".group_drop_down").css({"top":top+2,width:tdWidth})
				.parent().css({"position":"relative","height":settings.height}).end().find(".dropdown_menu").css({height:settings.height});
				var liHtml="<li class='pleaseSeclect active' id='000'>--请选择--</li>";
				var len = data.length;
				for(var i = 0;i < len;i++){
					liHtml+="<li id="+data[i].ProID+" data-cityId="+data[i].CityID+" title="+data[i].name+">"+data[i].name+"</li>"
				}
				_this.next(".group_drop_down").find("ul").append(liHtml);
			},
			//显示下拉菜单
			show:function(){
				_this.next(".group_drop_down").slideDown();
			},
			//隐藏下拉菜单
			hide:function(){
				_this.next(".group_drop_down").slideUp();
			},
			//模糊查询
			fuzzSearch:function(){
				var keyWord =_this.next(".group_drop_down").find("input").val();
			 	var list=_this.next(".group_drop_down").find("ul")
			 	if(!keyWord || keyWord == ""){
			 		list.find("li").show()
			 	}
			 	else{
			 		list.find("li").hide();
			 		list.find(".pleaseSeclect").show();
	    			list.find("li[title*="+keyWord+"]").show();
	    			list.find("li[id*="+keyWord+"]").show();
			 	}
			},
			//选中li标签事件
			seclectLi:function(callback){
				_this.next(".group_drop_down").find("ul").off("click").click(function(e){
					var that=e.target;
					index=$(that).index();
					var value=that.id;
					var text=that.title;
					$(that).addClass("active").siblings("li").removeClass("active");
					_this.attr("data-value",value).attr("data-text",text).find(".group_name").html(that.innerHTML).end().next(".group_drop_down").slideUp();
					callback(that);
				})
			},
			
			//上下移动li标签
			moveLi:function(){
				var $group_drop_down=_this.next(".group_drop_down");
				 index=$group_drop_down.find("li[class*='active']").index();
				var liHeight=$group_drop_down.find("li").height();
				var ulHeight=$group_drop_down.find("ul").height();
				var maxIndex=$group_drop_down.find("li").length;
				var liNum=parseInt(ulHeight/liHeight);
				$(document).off("keyup").keyup(function(e){
					if(e.keyCode==40){//下移
						if(index<maxIndex-1){
							$group_drop_down.find("li").eq(index+1).addClass("active").end().eq(index).removeClass("active");
							index++;
							if(index % liNum==0){
								$group_drop_down.find("ul").scrollTop(20*index);
							}
						}
					}
					else if(e.keyCode==38){
						if(index>0){
							var scrollTop=$group_drop_down.find("ul").scrollTop();
							$group_drop_down.find("li").eq(index-1).addClass("active").end().eq(index).removeClass("active");
							index--;
							if((index+1) % liNum==0){
								$group_drop_down.find("ul").scrollTop(scrollTop-20*liNum);
							}
						}
					}
				})
			}
			
		}
	
		//生成下拉菜单
		var $group_drop_down=$(this).next('.group_drop_down');
		if($group_drop_down.length<=0){
			methods.init(settings.data);
		}
	
		this.click(function(e){
			$(".group_drop_down").not($(this).next(".group_drop_down")).slideUp();
			$(this).next('.group_drop_down').css("display")=="block"?methods.hide():methods.show();
			
			$(document).off("click").click(function(){
				methods.hide()
			})
			//阻止冒泡
			$(this).next('.group_drop_down').find(".group_search").click(function(ev){
				ev.stopPropagation();
			}).focus();
			$(this).next('.group_drop_down').off("click").click(function(e){
				e.stopPropagation();
			})
			e.stopPropagation();
			methods.seclectLi(settings.click);
			
			if($(this).next('.group_drop_down').css("display")=="block"){
				methods.moveLi();
			}
		})
		
		//按键查询
		this.next(".group_drop_down").find("input").off("keyup").keyup(function(e){
			if(e.keyCode==13){
				methods.fuzzSearch();
			}
		})
	
		//点击查询
		this.next(".group_drop_down").find(".search_icon").off("click").click(function(e){
			methods.fuzzSearch();
		})
		

	};
})(jQuery);
