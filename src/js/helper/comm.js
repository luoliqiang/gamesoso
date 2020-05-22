;(function (factory, window) {
    if (typeof define === "function" && define.amd) {
        define('comm', factory);
    }
    else {
        window.comm = factory();
    }
}
(function() {

'use strict';
	
	var CACHE_KEY = 'JS_ANNUALMEETING_';

	function initDropdrow() {
		$('.dropdown').on('click', function(e) {
			$(this).toggleClass('open');
			if (e.target.className === 'dropdown-item') {
				var $target = $(e.target)
				$(this).data('val', $target.data('val'));
			}
		});
	}

	var _comm = {
		initPage: function () {
			initDropdrow()
		},
		factoryVue: function(vue, name, ctor) {
			var name = 'vue_instance_' + name
			if (this.name) {
				return this.name
			} else {
				console.log(ctor)
				this.name = new vue(ctor)
				return this.name
			}
		},
		getCache: function(name) {
			return window.localStorage.getItem(CACHE_KEY + name);
		},
		setCache: function(name, val) {
			window.localStorage.setItem(CACHE_KEY + name, val);
		},
		removeCache: function(name) {
			window.localStorage.removeItem(CACHE_KEY + name);
		},
		mergeArr: function() {
			return Array.prototype.concat.apply([], arguments);
		},
		loading: function(type) {
			if(type === 'hide') {
				document.getElementById('dialog-tip-loading').className = 'hide';
			}
			else {
				document.getElementById('dialog-tip-loading').className = 'dialog-tip';
			}			
		},
		showTip: function(vue) {
			vue.component('dialogtip', {
			    template: '<div class="dialog-tip-wrap"><div class="modal-layout" v-bind:class="{ show: tip.show }" v-on:click="tip.show = !tip.show"></div>\
						   <div class="dialog-msg-tip" v-bind:class="{ show: tip.show }">\
							   <div class="msg" v-html="tip.msg"></div>\
							   <div class="btn-submit mt20" v-on:click="tip.show = !tip.show">确定</div>\
						    </div></div>',
				props: ['tip']
			});
		},
		tplBottomMenu: function(vue) {
			vue.component('tpl_bottom_menu', {
			  template: '\
			  	<div class="bottom-menu">\
					<ul>\
						<a href="./home.html"><li class="ico-video" v-bind:class="{ sed: sed_video }"><i></i>节目单</li></a>\
						<a href="./support.html"><li v-if="user.is_friend || user.is_visitor" class="ico-love" v-bind:class="{ sed: sed_love }"><i></i>亲友助力</li></a>\
						<a href="./rewards.html"><li v-if="user.is_staff || user.is_guest" class="ico-gift" v-bind:class="{ sed: sed_gift }"><i></i>奖品下注</li></a>\
						<a href="./blessing.html"><li class="ico-blessing" v-bind:class="{ sed: sed_blessing }"><i></i>{{ txt_blessing }}</li></a>\
						<a href="./user-index.html"><li class="ico-self" v-bind:class="{ sed: sed_self }"><i></i>个人中心</li></a>\
					</ul>\
				</div>\
			  ',
			  props: [
			  		  'user',
					  'sed_video', 
					  'sed_gift', 
					  'sed_love',
					  'sed_blessing', 
					  'sed_self', 
					  'txt_blessing'
				  ]
			});
		},
		getTeamKey: function(name) {
			var key = null;

			switch (name) {
				case '红队':
					key = 'red';
					break;
				case '黄队':
					key = 'yellow';
					break;
				case '蓝队':
					key = 'blue';
					break;
			}

			return key;
		},
		weixinPay: function(opts, data) {
			WeixinJSBridge.invoke('getBrandWCPayRequest', data, function(response) {
                if(response.err_msg === 'get_brand_wcpay_request:ok') { // 支付成功
                	if(opts.success) {
                		opts.success();
                	}
                }
                else {
                	if(opts.fail) {
                		opts.fail(response.err_msg);
                	}
                }
            });
		},
		getUrlParam: function (name, isTop) {
	        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
	        	r = !isTop ? window.location.search : window.top.location.search;

	        r = r.substr(1).match(reg);
	        if (r !== null) {
	            return unescape(r[2]);
	        }
	        return null;
	    },
	    formatTime: function(time_int) {
	        var s = Math.floor((time_int/1000)%60),
		        i = Math.floor((time_int/1000/60)%60),
		        h = Math.floor((time_int/1000/60/60)%24);

	        var _zero = function(v) {
	            return v < 10 ? ('0' + v) : v;
	        };
	        return {hour: _zero(h), mit: _zero(i), sec: _zero(s)};
	    },
	    ptime: function(ptime) {
			ptime = this.formatTime(ptime * 1000);
            return ptime.hour + ':' + ptime.mit + ':' + ptime.sec;
		},
	    rtime: function($rtime, callback) {
			var _this = this,
				time_interval = null,
				end_time = 0,
				hs_int = 100;

			function _update() {
	            var t = _rtime();
	            $rtime.text(t.m + ':' + t.s + ':' + t.hs);

	            return t.t;
	        }

	        function _rtime() {
	        	var total = end_time - new Date().getTime();
	            total = total < 0 ? 0 : total;

	            var rtime = _this.formatTime(total),
	            	seconds = rtime.sec,
	                minutes = rtime.mit;

	             if(hs_int <= 0) {
	             	hs_int = 100;
	             }
	             hs_int = hs_int - 2;

	            return {
	                t: total,
	                m: minutes,
	                s: seconds,
	                hs: hs_int < 10 ? ('0' + hs_int) : hs_int
	            };
	        }

	        function _init() {
				end_time = new Date().getTime() + Number($rtime.data('rtime'));
				_update();

	        	time_interval = setInterval(function() {
	                var total = _update();
	                if(total <= 0) {
	                    clearInterval(time_interval);
	                    if(callback) {
	                        callback();
	                    }
	                }
	            }, 20);
	        }
	        _init();
		},
		parseTime(time, cFormat) {
			if (arguments.length === 0) {
			  return null
			}
			const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
			let date
			if (typeof time === 'object') {
			  date = time
			} else {
			  if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
				time = parseInt(time)
			  }
			  if ((typeof time === 'number') && (time.toString().length === 10)) {
				time = time * 1000
			  }
			  date = new Date(time)
			}
			const formatObj = {
			  y: date.getFullYear(),
			  m: date.getMonth() + 1,
			  d: date.getDate(),
			  h: date.getHours(),
			  i: date.getMinutes(),
			  s: date.getSeconds(),
			  a: date.getDay()
			}
			const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
			  let value = formatObj[key]
			  // Note: getDay() returns 0 on Sunday
			  if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
			  if (result.length > 0 && value < 10) {
				value = '0' + value
			  }
			  return value || 0
			})
			return time_str
		},
		formatTimeStr(time, option) {
			if (('' + time).length === 10) {
				time = parseInt(time) * 1000
			} else {
				time = +time
			}
			const d = new Date(time)
			const now = Date.now()

			const diff = (now - d) / 1000

			if (diff < 30) {
				return '刚刚'
			} else if (diff < 3600) {
				// less 1 hour
				return Math.ceil(diff / 60) + '分钟前'
			} else if (diff < 3600 * 24) {
				return Math.ceil(diff / 3600) + '小时前'
			} else if (diff < 3600 * 24 * 2) {
				return '1天前'
			}
			if (option) {
				return this.parseTime(time, option)
			} else {
				return (
				d.getMonth() +
				1 +
				'月' +
				d.getDate() +
				'日' +
				d.getHours() +
				'时' +
				d.getMinutes() +
				'分'
				)
			}
		}
	};

	return _comm

}, window));