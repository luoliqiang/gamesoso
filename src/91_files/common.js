//api
var HTTPAPIPATH = "http://" + location.host + "/api/",
    // 获取短信验证码
    getVerifyCode = HTTPAPIPATH + "user/getVerifyCode",
    //登录地址
    loginAuth = HTTPAPIPATH + "user/loginAuth",
    //获取微信qrcode地址
    getQrCodeUrl = HTTPAPIPATH + "wx/getQrCode",
    //微信登录
    wxLogin = HTTPAPIPATH + "user/wxLogin",
    //退出地址
    loginOut = HTTPAPIPATH + 'user/loginOut',
    //获取用户信息
    getUserInfo = HTTPAPIPATH + "user/getUserInfo",
    //搜索商品列表
    getPage = HTTPAPIPATH + "product/getPage",
    //
    getNoticeList = HTTPAPIPATH + "index/getNoticeList",
    //看了又看列表
    getListByGroupCategory = HTTPAPIPATH + "product/getListByGroupCategory",
    // 获取商品详情
    getDetail = HTTPAPIPATH + "product/getDetail/",
    //提交订单
    submitTrade = HTTPAPIPATH + "trade/submitTrade",
    //申请成为一级代理
    applyLevel = HTTPAPIPATH + "user/applyLevel",
    // 获取配置
    getConfig = HTTPAPIPATH + 'index/getConfig',

    getdetailQRCodes = HTTPAPIPATH + "trade/getQRCode",
    //获取金额信息
    getAmountInfo = HTTPAPIPATH + 'user/getAmountInfo',
    //获取推广渠道列表
    getPromoPage = HTTPAPIPATH + "user/getPromoPage",
    //获取金额分页列表
    getAmountPage = HTTPAPIPATH + 'user/getAmountPage',
    //绑定身份证
    bindCer = HTTPAPIPATH + 'user/bindCer',
    //获取用户信息
    getTradeInfo = HTTPAPIPATH + 'user/getTradeInfo',
    //绑定交易帐号
    bindTradeAccount = HTTPAPIPATH + 'user/bindTradeAccount',
    //提现
    withdraw = HTTPAPIPATH + 'user/withdraw',
    //获取提现分页列表
    getWithdrawPage = HTTPAPIPATH + 'user/getWithdrawPage',

    //获取推广渠道列表
    getPromoPage = HTTPAPIPATH + "user/getPromoPage",
    //增加推广渠道列表
    addPromo = HTTPAPIPATH + "user/addPromo",
    //获取订单列表
    orderPageList = HTTPAPIPATH + "trade/orderPageList",
    //取消订单
    cancelOrder = HTTPAPIPATH + "trade/cancelOrder",
    //获取订单详情
    orderDetail = HTTPAPIPATH + 'trade/orderDetail',
    //获取服务器
    getSupplierServerArea = HTTPAPIPATH + "product/getSupplierServerArea/",
    //获取商品价格
    getSupplierPrice = HTTPAPIPATH + "product/getSupplierPrice",
    //提交订单
    submitTrade = HTTPAPIPATH + "trade/submitTrade",
    //提交订单
    getPayQRCode = HTTPAPIPATH + "trade/getQRCode",
    //检测状态
    checkStatus = HTTPAPIPATH + "trade/checkStatus",
    //检测状态
    checkProductStatus = HTTPAPIPATH + "product/chackStatus/",

    //获取订单详情
    orderDetail = HTTPAPIPATH + "trade/orderDetail/",
    //位置信息
    getLotteryInfoByPosition = HTTPAPIPATH + "activity/getLotteryInfoByPosition",
    //抽取奖品
    lotteryPrize = HTTPAPIPATH + "activity/lotteryPrize",
    //获取奖品日志
    getLotteryPrizeLogList = HTTPAPIPATH + "activity/getLotteryPrizeLogList",
    //获取自己的奖品信息
    getOwnLotteryPrizeLogList = HTTPAPIPATH + "activity/getOwnLotteryPrizeLogList",
    // 获取列表页广告图
    getMallad = HTTPAPIPATH + "index/getMallAd"


//支付链接
tradeUrl = "http://www.91cdkey.com/pay/index.html?tradeId=",
// tradeUrl = "http://dev.91cdkey.com/pay/index.html?tradeId=",

    productdetail = HTTPAPIPATH + "product/getDetail/productId";

$(".close").click(function () {
    close();
    return false;
})
getOssUrl()
window.onload = function () {
    var productId = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
    var url = document.referrer;
    var allTrueParam = "";
    var needParamArray = ["channelId", "resCode", "netbarId"];

    function getParam(url) {
        var allParam = url.substring(url.indexOf("?") + 1);
        var param = allParam.split("&");
        var obj = {};
        if (allParam == "") {
            return "";
        }
        for (var i = 0; i < param.length; i++) {
            var paramName = param[i].split("=")[0];
            var paramValue = param[i].split("=")[1];
            obj[paramName] = paramValue;
        }
        return obj;
    }

    var newParam = getParam(location.search.substring(1));
    var oldParam = getParam(url);

    if (!!newParam) {//新链接参数
        for (var key in newParam) {
            appendLinkUrl(key, newParam[key])
        }
    }
    if (!!oldParam) {
        for (var key in oldParam) {//如果旧的参数 存在 需要挂载之前参数  就拼接url上
            if (needParamArray.indexOf(key) > -1 || key == "promoCode") {
                appendLinkUrl(key, oldParam[key])
            }
        }
    }
    function appendLinkUrl(key, value) {

        if(allTrueParam.indexOf(key)>=0){
            return
        }
        if (allTrueParam != "") {
            allTrueParam += "&";
        }
        allTrueParam += key + "=" + value
    }

    if (allTrueParam != "") {
        history.replaceState("", "", productId + "?" + allTrueParam)
    }
}

function close() {
    $(".close").parent().addClass("hide");
    $(".shade").addClass("hide");
    $("body").removeClass("oh");
    return false;
}

function getUserInfos() {
    var str = "";
    var strr = "";
    Ajax({
        url: getUserInfo,
        success: function (res) {
            str = '<div id="user-sucess" class=" greyColor hand ml-50 inline-block fs-14" style="position: relative;"><span id="username">' + res.data.userNickname +
                '</span><span class="triangle-down hand"></span> <div class="user-info hide">' +
                '<span class="mt-15" style="padding-left: 10px; padding-right: 10px; display: block; word-break: keep-all;">可提现金额：' +
                '<span class="yellowColor">' + ((res.data.totalAmount - res.data.unusableAmount) / 10000).toFixed(2) +
                '元</span> <a href="my-withdraw.html" class="redColor" style="margin-left: 5px;">提现</a> </span>' +
                '<p class="text-center mt-15">' +
                '<a href="../my-order.html" class="btn-default" style="width: 80px; height: 26px; line-height: 26px;">我的订单</a>' +
                '<a href="../my-income.html" class="btn-default ml-5" style="width: 80px; height: 26px; line-height: 26px;">我的收入</a> </p>' +
                '<span class="login-out hand" id="loginOut" onclick="loginout()">退出登录</span>' +
                '</div> </div>'
            strr = '<p class="slider-wel">' + res.data.userNickname + '</p>' +
                '<p class="mt-10"> <a href="../my-order.html">订单</a> <a href="../my-income.html">收入</a>  <p>'
            $(".header-please").html(str)
            $(".slider-main-inner").html(strr)
        },
        error: function (error) {

        }
    })
}

var DEFAULT_VERSION = 8.0;
var DEFAULT_VERSIONT = 7.0;
var ua = navigator.userAgent.toLowerCase();
var isIE = ua.indexOf("msie")>-1;
var safariVersion;
if(isIE){
    safariVersion =  ua.match(/msie ([\d.]+)/)[1];
}
if(safariVersion <= DEFAULT_VERSION || safariVersion <= DEFAULT_VERSION){
    alert('请使用更高版本的浏览器或者其他浏览器打开本站')
};

$(function () {
    $("#paypage").load("../../html/public/pay.html")
    $("#headerpage-top").load("../../html/public/New-header-top-test.html")
    $("#headerpage").load("../../html/public/New-header-test.html")
    $("#footerpage").load("../../html/public/New-footer-test.html")
    $("#usercenterpage").load("../../html/usercenter.html")
    $("#loginpage").load("../../html/public/login.html")
    setTimeout(function () {
        getUserInfos();
    }, 100);
    $("a").each(function () {
        var link = $(this).attr("href");
        var promoCode = getQueryString("promoCode")
        var channelId = getQueryString("channelId")
        var resCode = getQueryString("resCode")
        var netbarId = getQueryString("netbarId")
        if (link.toString().indexOf("#") >= 0) {
            return
        }
        if (link.toString().indexOf("?") >= 0) {
            if (promoCode) {
                link += "&promoCode=" + promoCode
            }
            if (channelId && resCode) {
                link += "&channelId=" + channelId + "&resCode=" + resCode + "&netbarId=" + netbarId
            }
        } else {
            if (promoCode) {
                link += "?promoCode=" + promoCode
                if (channelId && resCode) {
                    link += "&channelId=" + channelId + "&resCode=" + resCode + "&netbarId=" + netbarId
                }
            } else {
                if (channelId && resCode) {
                    link += "?channelId=" + channelId + "&resCode=" + resCode + "&netbarId=" + netbarId
                }
            }
        }
        $(this).attr("href", link);
    });
})

function appendUrl(link) {
    var promoCode = getQueryString("promoCode")
    var channelId = getQueryString("channelId")
    var resCode = getQueryString("resCode")
    var netbarId = getQueryString("netbarId")
    if (link.toString().indexOf("#") >= 0) {
        return
    }
    if (link.toString().indexOf("?") >= 0) {
        if (promoCode) {
            link += "&promoCode=" + promoCode
        }
        if (channelId && resCode) {
            link += "&channelId=" + channelId + "&resCode=" + resCode + "&netbarId=" + netbarId
        }
    } else {
        if (promoCode) {
            link += "?promoCode=" + promoCode
            if (channelId && resCode) {
                link += "&channelId=" + channelId + "&resCode=" + resCode + "&netbarId=" + netbarId
            }
        } else {
            if (channelId && resCode) {
                link += "?channelId=" + channelId + "&resCode=" + resCode + "&netbarId=" + netbarId
            }
        }
    }
    return link
}

var reg = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/;
var timer = "";
var scheduler = "";
var totalCount = 60;
var disabled = false
var sceneStr = ""

$(".slider-login").click(function () {
    getQrcode()
    $(".index-login").removeClass("hide");
    $(".shade").removeClass("hide");
    $("body").addClass("oh");

})
$("body").delegate(".header-login", "click", function () {
    getQrcode()
    $(".index-login").removeClass("hide");
    $(".shade").removeClass("hide");
    $("body").addClass("oh");
})
$("body").delegate(".header-registe", "click", function () {
    $(".index-login").removeClass("hide");
    $(".shade").removeClass("hide");
    $("body").addClass("oh");
    getQrcode()
})
//登录注册切换
$("#login-phone").click(function () {
    $(".index-login").addClass("hide");
    $(".index-reg").removeClass("hide");
    clearInterval(scheduler)
    scheduler = null
    draw(show_num);
})
$(".index-login-return").click(function () {
    $(".index-reg").addClass("hide");
    $(".index-login").removeClass("hide");
    getQrcode();
});


var show_num = [];
$("#canvas").on('click', function () {
    draw(show_num);
})
$(".counterBtn").click(function () {
    if (disabled) {
        return
    }
    if ($(".phone-ipt").val() === "") {
        $("#message-info").text("手机号码不能为空")
        $("#message").show().delay(3000).fadeOut();
    } else if (!reg.test($(".phone-ipt").val())) {
        $("#message-info").text("手机号码格式错误")
        $("#message").show().delay(3000).fadeOut();
    }
    disabled = true
    Ajax({
            type: "post",
            url: getVerifyCode,
            data: {
                phone: $(".phone-ipt").val()
            },
            success: function (res) {
                startCount();
            }
        }
    )
})

// 获取验证码
function getQrcode() {
    Ajax({
        type: "get",
        url: getQrCodeUrl,
        success: function (res) {
            $("#qrcode").attr("src", res.data.qrCode);
            sceneStr = res.data.sceneStr
            schedule()
        }
    })
}

//微信登录
function schedule() {
    scheduler = setInterval(function () {
            Ajax({
                type: "get",
                url: wxLogin + "/" + sceneStr,
                success: function (res) {
                    if (res.data.status == '0') {
                        //不存在
                    } else {
                        res.userId = res.userId + '';
                        close()
                        $("#message-info").text("登录成功")
                        $("#message").show().delay(3000).fadeOut();
                        str = '<div id="user-sucess" class=" greyColor hand ml-50 inline-block fs-14" style="position: relative;"><span id="username">' + res.data.user.userNickname + '</span><span class="triangle-down hand"></span>' +
                            '<div class="user-info hide"> <span class="mt-15" style="padding-left: 10px; padding-right: 10px; display: block; word-break: keep-all;">可提现金额： <span class="yellowColor">' + ((res.data.totalAmount - res.data.unusableAmount) / 10000).toFixed(2) + '</span> <a href="my-withdraw.html" class="redColor" style="margin-left: 5px;">提现</a> </span>' +
                            '<p class="text-center mt-15"> <a href="../my-order.html" class="btn-default" style="width: 80px; height: 26px; line-height: 26px;">我的订单</a><a href="../my-income.html" class="btn-default ml-5" style="width: 80px; height: 26px; line-height: 26px;">我的收入</a> </p> <span class="login-out hand" id="loginOut" onclick="loginout()">退出登录</span> </div> </div>'
                        strr = '<p class="slider-wel">${res.data.userNickname}</p> <p class="mt-10"> <a href="../my-order.html">订单</a> <a href="../my-income.html">收入</a>  <p>'
                        $(".header-please").html(str)
                        $(".slider-main-inner").html(strr)
                        getUserInfos()
                        clearInterval(scheduler);
                        scheduler = null
                        window.location.reload()
                    }
                },
            })
        },
        1500)
}

//验证码倒计时
function startCount() {
    // var val = $(".code-ipt").val().toLowerCase();
    // var num = show_num.join("");
    timer = setTimeout(function () {
        totalCount -= 1;
        if (totalCount <= 0) {
            disabled = false;
            totalCount = 60;
            clearTimeout(this.timer);
            timer = null;
            $(".counterBtn").text("获取验证码")
        }
            // else if (val !== num) {
            // $("#message-info").text("图形验证码错误")
            //$("#message").show().delay(3000).fadeOut();
            //   draw(show_num);
            //   $(".code-ipt").val('');
        // }
        else {
            $(".counterBtn").text(totalCount + 's')
            disabled = true;
            startCount();
        }
    }, 1000);
}

//手机号码登录
$(".login-btn").on('click', function () {
    var val = $(".code-ipt").val().toLowerCase();
    var num = show_num.join("");
    var str = "";
    var strr = "";

    var value = $(".phone-ipt").val();
    if (value == "") {
        $("#message-info").html("手机号码不能为空")
        $("#message").show().delay(3000).fadeOut();
    } else if (!reg.test(value)) {
        $("#message-info").html("手机号码格式错误")
        $("#message").show().delay(3000).fadeOut();
    } else if ($(".code-ipt").val() == "") {
        $("#message-info").text("图形验证码不能为空")
        $("#message").show().delay(3000).fadeOut();
    } else if (val !== num) {
        $("#message-info").text("图形验证码错误！")
        $("#message").show().delay(3000).fadeOut();
        draw(show_num);
        $(".code-ipt").val('');
    } else if ($(".phonecode-ipt").val() == "") {
        $("#message-info").text("短信验证码不能为空")
        $("#message").show().delay(3000).fadeOut();
    } else {
        Ajax({
                type: "post",
                url: loginAuth,
                data: {
                    phone: value,
                    verifyCode: $(".phonecode-ipt").val()
                },
                success: function (res) {
                    close()
                    $("#message-info").text("登录成功")
                    $("#message").show().delay(3000).fadeOut();
                    getUserInfos()
                    str = '<div id="user-sucess" class=" greyColor hand ml-50 inline-block fs-14" style="position: relative;"><span id="username">' + res.data.userNickname + '</span><span class="triangle-down hand"></span> <div class="user-info hide"> <span class="mt-15" style="padding-left: 10px; padding-right: 10px; display: block; word-break: keep-all;">可提现金额： <span class="yellowColor">' + ((res.data.totalAmount - res.data.unusableAmount) / 10000).toFixed(2) + '元</span>' +
                        '<a href="my-withdraw.html" class="redColor" style="margin-left: 5px;">提现</a> </span> <p class="text-center mt-15"> <a href="../my-order.html" class="btn-default" style="width: 80px; height: 26px; line-height: 26px;">我的订单</a> <a href="../my-income.html" class="btn-default ml-5" style="width: 80px; height: 26px; line-height: 26px;">我的收入</a> </p> <span class="login-out hand" id="loginOut" onclick="loginout()">退出登录</span> </div> </div>'
                    strr = '<p class="slider-wel">${res.data.userNickname}</p> <p class="mt-10"> <a href="../my-order.html">订单</a> <a href="../my-income.html">收入</a>  <p>'
                    $(".header-please").html(str)
                    $(".slider-main-inner").html(strr)
                }
            }
        )
    }
})

var ossUrl = ""

//设置图片url
function setPicUrl(url) {
    if (!ossUrl) {
        ossUrl="https://wbyixiu.oss-cn-hangzhou.aliyuncs.com/"
        getOssUrl()
        return ossUrl + url
    } else {
        return ossUrl + url
    }
}


//获取配置
function getOssUrl(fn) {
    Ajax({
        type: "get",
        url: getConfig,
        success: function (res) {
            ossUrl = res.data.ossUrl;
            if(location.pathname.indexOf("search")>=0){
                getPages()
            }
            if (fn && typeof fn == "function") {
                fn()
            }
        }
    })
}

function loginout() {
    var strout = ""
    var stroutr = ""
    Ajax({
        url: loginOut,
        success: function (res) {
            var localurl = window.location.pathname
            if (localurl.indexOf("my-income.html")>=0||localurl.indexOf("my-order.html")>=0||
                localurl.indexOf("my-channel.html")>=0||localurl.indexOf("my-withdraw.html")>=0||localurl.indexOf("my-account.html")>=0) {
                window.location.href = "../../html/index.html";
                strout = '<span> 亲，请 </span> <span class="header-login"> 登录 </span> <span class="header-registe"> 免费注册 </span>`stroutr = `<p class="slider-wel">你好</p><p class="slider-login">登录/注册</p>'
                $("#message-info").text("退出成功")
                $("#message").show().delay(3000).fadeOut();
                $(".header-please").html(strout)
                $(".slider-main-inner").html(stroutr)
                window.location.reload()
            } else {
                strout = '<span> 亲，请 </span> <span class="header-login"> 登录 </span> <span class="header-registe"> 免费注册 </span>`stroutr = `<p class="slider-wel">你好</p><p class="slider-login">登录/注册</p>'
                $("#message-info").text("退出成功")
                $("#message").show().delay(3000).fadeOut();
                $(".header-please").html(strout)
                $(".slider-main-inner").html(stroutr)
                window.location.reload()
            }
        }
    })
}


$("body").delegate(".header-please", "mouseover", function () {
    $(".user-info").removeClass("hide");
})
$("body").delegate(".header-please", "mouseout", function () {
    $(".user-info").addClass("hide");
})

$(".back").click(function () {
    window.history.go(-1)
})
$("#back").click(function () {
    window.history.go(-1)
})

    var searchText = $("#search-text");
    var headSearchVal = $("#headsearch-input");
    var searchVal = $(".goods-search-right-top input");


    function getUrlParam() {
        var url = location.search; //获取url中"?"符后的字符串包括‘？’ ，window.location.href获取的是url完整的字符串
        var theParam = new Object();
        if (url.indexOf("?") != -1) { //确保‘？’不是最后一个字符串，即携带的参数不为空
            var str = url.substr(1); //substr是字符串的用法之一，抽取指定字符的数目，这里抽取？后的所有字符
            strs = str.split("&"); //将获取到的字符串从&分割，输出参数数组，即输出[参数1=xx,参数2=xx,参数3=xx,...]的数组形式
            for (var i = 0; i < strs.length; i++) { //遍历参数数组
                theParam[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]); //这里意思是抽取每个参数等号后面的值，unescape是解码的意思
            }
        }
        return theParam; //返回参数值
    }

    var keyWords = getUrlParam("keyWords")
    $(searchText).text(keyWords.keyWords);
    $(".goods-search-right-top img").click(function () {
        if (searchVal.val() == "") {
            searchVal.val(searchVal.attr("placeholder"));
            window.location.href = "../search" + "?keyWords=" + searchVal.val();
        } else {
            window.location.href = "../search" + "?keyWords=" + searchVal.val();
        }
    })
    $(".goods-search-right-tage").click(function () {
        var page = $(this).text()
        window.location.href = "../search" + "?keyWords=" + page;
    })

    function getPages() {
        var param = {
            pageNum: 1,
            pageSize: 100,
        }
        if (keyWords.keyWords) {
            param.productName = encodeURI(keyWords.keyWords)
        }
        Ajax({
            url: getPage,
            type: "get",
            data: param,
            success: function (res) {
                if (res.data.items.length == 0) {
                    $("#search-nogoods").addClass("active").siblings().removeClass("active")
                } else {
                    $("#search-res").html("")
                    for (var i = 0; i < res.data.items.length; i++) {
                        var goodshtml = '<li class="index-main-list mt-20 mr-16"><a href="http://91cdkey.com/detail/' + res.data.items[i].productId + '">' +
                            '<img src="' + setPicUrl(res.data.items[i].productImage) + '" alt="" width="228" height="140">' +
                            '<div class="index-main-price">' +
                            '<p class="goods-name fl">' + res.data.items[i].productName + '</p>' +
                            '<p class="fr">' +
                            '<span class="index-main-xj">￥' + res.data.items[i].specList[0].salesPrice / 10000 + '</span> </p> </div> <div class="index-main-mark"> <div class="index-main-mark1">' +
                            '<p class="text-ellipsis">' + res.data.items[i].productName + '</p>' +
                            '<p><span class="index-main-xj fs-18 fwb">￥' + res.data.items[i].specList[0].salesPrice / 10000 + '</span></p> </div> <div class="index-main-mark2 whiteColor">立即抢购</div> </div> </a> </li>'
                        $("#search-res").append(goodshtml);
                    }

                }
            }
        })
    }

//全部展开
$("body").delegate(".header-all", "mouseover", function () {
    $(".header-unflod").removeClass("hide");
})
$("body").delegate(".header-all", "mouseout", function () {
    $(".header-unflod").addClass("hide");
})
$("body").delegate(".header-unflod", "mouseover", function () {
    $(".header-unflod").removeClass("hide");
})
$("body").delegate(".header-unflod", "mouseout", function () {
    $(".header-unflod").addClass("hide");
})
$(".header-search img").click(function () {
    if ($("#headsearch-input").val() == "") {
        headSearchVal.val(headSearchVal.attr("placeholder"));
        window.location.href = "../search" + "?keyWords=" + headSearchVal.val();
    } else {
        window.location.href = "../search" + "?keyWords=" + headSearchVal.val();
    }
})
// $("body").delegate(".header-searchimg","click",function () {
//     if ($("#headsearch-input").val() == "") {
//         headSearchVal.val(headSearchVal.attr("placeholder"));
//         window.location.href = "../search" + "?keyWords=" + headSearchVal.val();
//     } else {
//         window.location.href = "../search" + "?keyWords=" + headSearchVal.val();
//     }
// })
//头部切换
$("body").delegate(".header-item", "click", function () {
    $(this).addClass("active").siblings().removeClass("active");
    var index = $(this).index();
    $(".con-inner").eq(index).addClass("active").siblings().removeClass("active");
});
//商品累加
$(function () {
    var num = parseInt($(".goods-detail-info-num").val());
    $(".up").on("click", function () {
        num = num + 1;
        $(".goods-detail-info-num").val(num)
        if (num > 5) {
            num = 5;
            $(".goods-detail-info-num").val(num)
            $(".up").addClass("disable").siblings().removeClass("disable")
        } else {
            $(".up").removeClass("disable")
        }
    })
    $(".down").click(function () {
        num = num - 1;
        $(".goods-detail-info-num").val(num)
        if (num < 1) {
            num = 1;
            $(".goods-detail-info-num").val(num)
            $(".down").addClass("disable").siblings().removeClass("disable")
        } else {
            $(".down").removeClass("disable")
        }
    })
})


//生成并渲染出验证码图形
function draw(show_num) {
    var canvas_width = $('#canvas').width();
    var canvas_height = $('#canvas').height();
    var canvas = document.getElementById("canvas");//获取到canvas的对象，演员
    var context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    var sCode = "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
    var aCode = sCode.split(",");
    var aLength = aCode.length;//获取到数组的长度

    for (var i = 0; i < 4; i++) {  //这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
        var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
        // var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
        var deg = Math.random() - 0.5; //产生一个随机弧度
        var txt = aCode[j];//得到随机的一个内容
        show_num[i] = txt.toLowerCase();
        var x = 10 + i * 20;//文字在canvas上的x坐标
        var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
        context.font = "bold 23px 微软雅黑";

        context.translate(x, y);
        context.rotate(deg);

        context.fillStyle = randomColor();
        context.fillText(txt, 0, 0);

        context.rotate(-deg);
        context.translate(-x, -y);
    }
    for (var i = 0; i <= 5; i++) { //验证码上显示线条
        context.strokeStyle = randomColor();
        context.beginPath();
        context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
        context.stroke();
    }
    for (var i = 0; i <= 30; i++) { //验证码上显示小点
        context.strokeStyle = randomColor();
        context.beginPath();
        var x = Math.random() * canvas_width;
        var y = Math.random() * canvas_height;
        context.moveTo(x, y);
        context.lineTo(x + 1, y + 1);
        context.stroke();
    }
}

//得到随机的颜色值
function randomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return "rgb(" + r + "," + g + "," + b + ")";
}

// 获取参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return 0;
}


function Ajax(param) {
    var eparam = {
        type: param.type || 'get',
        url: param.url + "?refresh=" + Math.random() || '',
        data: param.data || {},
        noCheck: param.noCheck || false,
        success: param.success || function () {

        },
        error: param.error || function () {

        }
    };
    if (!eparam.url) throw 'Ajax方法传入对象必须有url路径';

    // 创建ajax对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    eparam.type = eparam.type.toUpperCase();

    if (typeof eparam.data === 'object') {
        var str = '';
        for (var key in eparam.data) {
            str += key + '=' + eparam.data[key] + '&';
        }
        eparam.data = str.replace(/&$/, '');
    }
    if (eparam.type === 'POST') {
        xhr.open('POST', eparam.url, true);
        // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(eparam.data);
    } else {
        if (eparam.data) {
            xhr.open(eparam.type, eparam.url + '&' + eparam.data, true);
        } else {
            xhr.open(eparam.type, eparam.url, true);
        }
        xhr.send();
    }

    // 处理返回数据
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var data = typeof xhr.responseText === 'string' ? JSON.parse(xhr.responseText) : xhr.responseText;
            if (xhr.status === 200) {
                if (data.status === '1' || eparam.noCheck) {
                    typeof eparam.success === "function" && eparam.success(data);
                } else {
                    if (!eparam.error) {
                        if (data.code === '401') {
                            window.location.href = "../../html/index.html"
                        } else if (data.code === '1000001') {
                            typeof eparam.error === "function" && eparam.error(data);
                        } else {
                            $("#message-info").text(data.info)
                            $("#message").show().delay(3000).fadeOut();
                        }
                    }
                    typeof eparam.error === "function" && eparam.error(data);
                }
            } else {
                typeof eparam.error === "function" && eparam.error(data);
            }
        }
    }
}

function timestampToTime(cjsj, isSimple) {
    var date = new Date(cjsj * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) :
        date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    if (!!isSimple) {
        return Y + M + D
    }
    var h = date.getHours() + ':'
    var m = date.getMinutes() + ':'
    var s = date.getSeconds()
    return Y + M + D + h + m + s
}

/**
 * 是否为手机号码
 * @param phone
 * @returns {boolean}
 */
function isPhone(phone) {
    var exp = /^1[3-9][0-9]\d{8}$/;
    return exp.test(phone)
}

function sec_to_time(s) {
    var min = Math.floor(s / 60) % 60;
    var sec = Math.floor(s % 60);
    if (min < 0 || sec < 0) {
        this.$router.go(-1)
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    return min + "分" + sec + "秒"
}

function price(val) {
    return (val / 10000).toFixed(2);
}



