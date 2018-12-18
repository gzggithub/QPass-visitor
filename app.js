//app.js
App({

  globalData: {
    hasLogin: false, // 作为判断是否登录的条件
    systemInfo: null,//客户端设备信息
    userInfo: null,
    formIds: [],
    token: '',
    face_token: '',
    face_copy: '',
    status: 0,
    face_image: '',
    windowWeight: '',
    windowHeight: '',
    brand: '',
    model: '',
    deviceOrientation: '',
    pixelRatio: 1,
    face_token_1: '',
    temp: '',
    // host: 'https://boom.ghent.com.cn',
    // host: 'https://qpass.51lz.net',
    // host: 'http://192.168.10.14:3000',
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#979795",
      "selectedColor": "#1c1c1b",
      "list": [
        {
          "pagePath": "/pages/index/index",
          "iconPath": "icon/rch-icon.png",
          "selectedIconPath": "icon/rc-icon.png",
          "text": "日程"
        },
        {
          "pagePath": "/pages/newApply/newApply",
          "iconPath": "icon/Item_2.png",
          "isSpecial": true,
          "text": "申请"
        },
        {
          "pagePath": "/pages/mine/mine",
          "iconPath": "icon/wd-icon.png",
          "selectedIconPath": "icon/wdl-icon.png",
          "text": "我的"
        }
      ]
    },
  },
  onLaunch: function() {
    //隐藏系统tabbar
    wx.hideTabBar();

    //获取设备信息
    this.getSystemInfo();
    
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.globalData.windowWeight = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
        that.globalData.model = res.model;
        that.globalData.brand = res.brand;
        that.globalData.deviceOrientation = res.deviceOrientation;
        that.globalData.pixelRatio = res.pixelRatio;
      }
    })

    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("login--")
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })  
  },

  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },

  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },

  collectFormIds: function(formId) {
    let formIds = this.globalData.formIds;
    if(!formIds) {
      formIds = [];
    }
    let data = {
        formId: formId,
        expire: new Date().getTime() + 60480000
      };
    formIds.push(data);
    this.globalData.formIds = formIds;
  },

  uploadFormIds: function(){
    let formIds = this.globalData.formIds;
    if(formIds.length!= 0) {
      this.globalData.formIds = [];
      wx.request({
        url: host + '',
        method: 'GET',
        data: data,
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.statusCode === 200) {
            console.log(res.data);
            if (res.data.error_code === 0) {
              console.log(res.data)
            }
          } else {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: res.data.message + '网络错误，请重试',
              showCancel: false,
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
    }
    return;
  },

})