// pages/mine/mine.js
const app = getApp();
const util = require('../../utils/util.js');
const pinyin = require('../../utils/getChina.js');

Page({

  /**
   * Page initial data
   */
  data: {
    //tabbar
    tabbar: {},
    waitItems: [],
    passItems: [],
    rejectItems: [],
    waitItems_total: 0,
    passItems_total: 0,
    rejectItems_total: 0,
    hasLogin: false,
    userInfo: null,
    personInfo: null,
    company: '',
    hasUserInfo: false,
    province: '',
    city: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winHeight: app.globalData.windowHeight + 100,
    origin: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    var that = this;
    wx.hideTabBar();
    this.setData({ // 自定义tabBar赋值
      tabBar: app.globalData.tabBar
    })
    app.editTabbar();
    
    if (options.origin) {
      that.setData({
        origin: options.origin
      })
    }

    if (wx.getStorageSync('hasLogin')) {
      app.globalData.hasLogin = wx.getStorageSync('hasLogin');
    } else {
      app.globalData.hasLogin = false
    }

    if (app.globalData.hasLogin === false) {
      that.authorization();
      that.authorizationAfterDeal();
    } else {
      var province = pinyin.getChina(app.globalData.userInfo.province);
      var city = pinyin.getChina(app.globalData.userInfo.city);
      that.setData({
        hasLogin: true,
        province: province,
        city: city
      })
      that.get_event(0, 0);
    }

    var companyStorage = wx.getStorageSync('company');
    var company = '';
    if (companyStorage) {
      if (companyStorage != '' || companyStorage != null) {
        company = wx.getStorageSync('company');
      } else {
        company = '-';
      }
    } else {
      company = '-';
    }
    that.setData({
      company: company
    })
  },

  authorization: function () { // 是否授权
    var that = this;
    wx.getSetting({
      success: res => {
        console.log("333")
        if (res.authSetting['scope.userInfo']) {// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.userLogin();
        } else {
          wx.hideLoading();
          that.setData({
            hasLogin: false
          })
        }
      }
    })
  },

  authorizationAfterDeal: function () {
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        getUsers: false
      })
    } else if (that.data.canIUse) {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      app.userInfoReadyCallback = res => {// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        that.setData({// 所以此处加入 callback 以防止这种情况
          userInfo: res.userInfo,
          hasUserInfo: true,
          getUsers: false
        })
      }
    } else { // 在没有 open-type=getUserInfo 版本的兼容处理
      that.setData({
        getUsers: false
      })
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            getUsers: false
          })
        }
      })
    }
  },

  bindGetUserInfo: function (e) {
    var that = this;
    console.log(e);
    if (e.detail) {
      if (!e.detail.userInfo) { //reject
        that.setData({
          getUsersOne: true
        })
      } else { //allow
        app.globalData.userInfo = e.detail.userInfo;
        that.userLogin();
      }
    }
  },

  userLogin: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    wx.login({
      success: function (res) {
        if (res.code) { // 发起网络请求
          var code = res.code;
          wx.hideLoading();
          // that.signIn(code);
        } else {
          console.log('登录失败！' + res.errMsg);
          wx.hideLoading();
        }
      },
      fail: function (res) {
        wx.hideLoading();
      }
    })
  },

  signIn: function (code) {
    var that = this;
    var host = app.globalData.host;
    console.log(host);
    wx.showLoading({
      title: '登录中...'
    })
    wx.request({
      url: host + '/api/auth/signin',
      method: 'POST',
      data: {
        code: code
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          if (res.data.error_code === 0) { // aleardy signUp
            wx.hideLoading();
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('openId', res.data.openId);
            that.loginSuccessDeal();
            
            // that.users();
          } else if (res.data.error_code === -1) { // no signUp
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('openId', res.data.openId);
            // wx.hideLoading();
            // that.signUp();
            // that.reLaunchTo();
          } else {
            wx.hideLoading();
            wx.setStorageSync('hasLogin', false);
            var content = res.data.errcode + ' ' + res.data.errorMsg + ',重试';
            that.loginFail(content);
          }
        } else if (res.statusCode == 502) {
          wx.hideLoading();
          wx.setStorageSync('hasLogin', false);
          var content = '服务器错误，请重试';
          that.loginFail(content);
        } else {
          wx.hideLoading();
          wx.setStorageSync('hasLogin', false);
          var content = res.errorMsg + ',请重试';
          that.loginFail(content);
        }
      },
      fail: function (res) {
        console.log(res);
        wx.hideLoading();
        var content = res.errMsg + ',请重试';
        that.loginFail(content);
      }
    })
  },

  loginSuccessDeal: function () {
    var that = this;
    wx.setStorageSync('hasLogin', true);
    app.globalData.hasLogin = true;// aleardy login

    var province = pinyin.getChina(app.globalData.userInfo.province);
    var city = pinyin.getChina(app.globalData.userInfo.city);
    console.log(province + '-' + city)
    that.setData({
      hasLogin: true,
      userInfo: app.globalData.userInfo,
      province: province,
      city: city
    })
    that.get_event(0, 0);
  },

  reLaunchTo: function () {
    var that = this;
    var url = '';
    if (that.data.origin == 1) {
      url = '../index/index';
    } else if (that.data.origin == 2) {
      url = '../newApply/newApply';
    } else {
      url = '../mine/mine';
    }
    that.setTimeOutLink(url);
  },

  setTimeOutLink: function (url) {
    var that = this;
    setTimeout(function () {
      wx.switchTab({
        url: url,
      })
    }, 1000)
  },

  signUp: function () {
    var that = this;
    var host = app.globalData.host;
    var data = {
      "openId": wx.getStorageSync('openId'),
      "displayName": app.globalData.userInfo.nickName,
      "avatar": app.globalData.userInfo.avatarUrl,
      "real_name": app.globalData.userInfo.nickName,
      "pinyin": "",
      "gender": app.globalData.userInfo.gender,
      "phone_number": "",
      "title": ""
    }
    wx.request({
      url: host + '/api/auth/signup',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token'),
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          wx.hideLoading();
          that.loginSuccessDeal();
        } else {
          wx.hideLoading();
          var content = res.statusCode + ' ' + res.data.message;
          that.signUpFailDeal(content);
        }
      },
      fail: function (res) {
        console.log(res);
        var content = res.errMsg + '点击确定重试';
        that.signUpFailDeal(content);
      }
    });
  },

  signUpFailDeal: function (content) {
    var that = this;
    wx.hideLoading();
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.power();
        }
      }
    })
  },

  power: function () {
    var that = this;
    app.globalData.hasLogin = false;
    that.setData({
      hasLogin: false
    })
  },

  commonFailDeal: function (content) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
  },

  loginFail: function (content) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.setData({
            getUsers: true
          })
        }
      }
    })
  },

  clickLogin: function() {
    var that = this;   
  },

  getInfo: function() {
    var that = this;
    // if (that.data.hasLogin === true) {
      wx.navigateTo({
        url: './detail/detail',
      })
    // } else {
      // wx.showModal({
      //   title: '提示',
      //   content: '请先登录，谢谢',
      //   showCancel: false
      // })
    // } 
  },

  getHistory: function(e) {
    var that = this;
    console.log(e);
    var status = e.currentTarget.dataset.status;
    // if (that.data.hasLogin === true) {
      wx.navigateTo({
        url: '../history/history?status=' + status,
      })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先登录，谢谢',
    //     showCancel: false
    //   })
    // } 
  },

  get_event: function (entry_time, leave_time) {
    var that = this;
    var host = app.globalData.host;
    var data = {
      'id': 0,
      'entry_time': entry_time,
      'leave_time': leave_time,
      'interviewee_id': 0,
      'visit_status': 0
    };
    wx.request({
      url: host + '/api/event',
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.error_code === 0) {
            var items = res.data.data; // 是个数组
            console.log(res.data.data);
            var waitItems = that.data.waitItems;
            var passItems = that.data.passItems;
            var rejectItems = that.data.rejectItems;
            var entry_time = 0;
            if (!res.data.data) {
              // no found deal
              wx.hideLoading();
            } else {
              waitItems = [];
              passItems = [];
              rejectItems = [];
              items.forEach((element) => {
                if (element.visit_status === 1) { // 申请中
                  waitItems.push(element) 
                } else if (element.visit_status === 2) { // 已通过
                  passItems.push(element)
                } else if (element.visit_status === 3) { // 已拒绝
                  rejectItems.push(element)
                } 
              })
              that.setData({ // 重新渲染数据
                waitItems: waitItems,
                passItems: passItems,
                rejectItems: rejectItems,
                waitItems_total: waitItems.length,
                passItems_total: passItems.length,
                rejectItems_total: rejectItems.length,

              })
              wx.hideLoading();
            }
            wx.hideLoading();
          }
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: res.data.message + '网络错误，请重试',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
          showCancel: false
        }) 
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    console.log("on Ready -- start");
    var that = this;
    that.setData({
      userInfo: app.globalData.userInfo
    })   
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {
    var that = this;
    that.get_event(0, 0);
    wx.stopPullDownRefresh();
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function (options) {
    console.log(options);
    if (options.from === 'menu') {
      console.log("share---");
    }

    return {
      title: '访客系统',
      path: '/pages/index/index',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          duration: 2000
        })
      }
    }
  }
})