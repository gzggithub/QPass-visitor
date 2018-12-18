// pages/mine/detail/detail.js
const app = getApp();
const util = require('../../../utils/util.js');
const pinyin = require('../../../utils/getChina.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    real_name: '-',
    gender: ['未选择', '男', '女'],
    index: 1,
    phone_number: '-',
    company: '-',
    province: '',
    city: '',
    remark: '-',
    real_name_1: '',
    hiddenCompanyPut: true,
    hiddenSignPut: true,
    hiddenNickNamePut: true,
    hiddenTelNumPut: true,
    perInfo: null,
    has_push: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // var personInfo = JSON.parse(options.jsonStr); // 个人信息
    // that.getUsers();
  },

  getUsers: function () {
    var that = this;
    var host = app.globalData.host;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: host + '/api/users',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          // if (res.data.status === 1) {
            var person_info = res.data;
            console.log(person_info);
            console.log('200--1-')
            var avatar = person_info.avatar;
            var status = person_info.status;
            var face_token_path = host + '/' + person_info.user_id + '/' + person_info.face_token_1 + '.jpg';
            var face_token_path_copy = person_info.face_token_1;
            var real_name = person_info.real_name;
            var birthday = util.formatDate(person_info.birthday * 1000);
            var gender = person_info.gender;
            
            app.globalData.status = person_info.status;
            app.globalData.face_image = host + '/' + person_info.user_id + '/' + person_info.face_token_1 + '.jpg';
            app.globalData.face_copy = person_info.face_token_1;

            wx.setStorageSync('status', status);
            wx.setStorageSync('face', face_token_path);
            wx.setStorageSync('real_name', real_name);
            wx.setStorageSync('gender', gender);
            wx.setStorageSync('birthday', birthday);
            wx.setStorageSync('phone_number', phone_number);
            var province = pinyin.getChina(app.globalData.userInfo.province);
            var city = pinyin.getChina(app.globalData.userInfo.city);
            var avatar = app.globalData.userInfo.avatarUrl;
            console.log(app.globalData.userInfo);
            var phone_number = person_info.phone_number;
            if (phone_number === '' || phone_number === null || phone_number === undefined) {
              phone_number = '-';
              console.log('phone_number--1-');
            }
            //  else {
            //   phone_number = person_info.phone_number;
            //   console.log('phone_number--2-');
            // }
            
            var companyStorage = wx.getStorageSync('company');
            var company = '';
            if (companyStorage) {
              if (companyStorage === '' || companyStorage === null || companyStorage === undefined) {
                company = '-';
                console.log('company--1-');
              } else {
                company = wx.getStorageSync('company');
                console.log('company--2-');
              }
            } else {
              company = '-';
              console.log('company--3-');
            }

            console.log('200--2-');
            
            var remark_1 = person_info.remark;
            var remark = '';
            if (remark_1 === '' || remark_1 === null || remark_1 === undefined) {
              console.log('remar--1-');
              remark = '-';
            } else {
              remark = person_info.remark;
              console.log('remar--2-');
            }

            that.setData({
              avatar: app.globalData.userInfo.avatarUrl,
              real_name: person_info.real_name,
              index: person_info.gender,
              phone_number: person_info.phone_number,
              province: province,
              city: city,
              company: company,
              remark: remark,
              personInfo: person_info
            })

            console.log('200--3-');
            
            wx.hideLoading();
          // } else {

          // }
        } else {
          var content = res.errMsg;
          that.commonFailDeal(content);
          wx.hideLoading();
        }
      },
      fail: function (res) {
        console.log(res);
        var content = res.errMsg + '重试';
        that.commonFailDeal(content);
        wx.hideLoading();
      },
      complete: function (res) {
        console.log("me -- complete");
        wx.hideLoading();
      }
    });
  },

  commonFailDeal: function (content) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
  },

  changenickName: function(e) {
    var that = this;
    // wx.navigateTo({
    //   url: './modify/modify',
    // })
    that.setData({
      hiddenNickNamePut: !that.data.hiddenNickNamePut
    })
  },

  changeTelNum: function () {
    var that = this;
    that.setData({
      hiddenTelNumPut: !that.data.hiddenTelNumPut
    })
  },

  changeCompany: function() {
    var that = this;
    that.setData({
      hiddenCompanyPut: !that.data.hiddenCompanyPut
    })
  },

  changeSign: function() {
    var that = this;
    that.setData({
      hiddenSignPut: !that.data.hiddenSignPut
    })
  },

  changeAvatar: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          avatar: tempFilePaths,
        });
        // var data = {
        //   'avatar': tempFilePaths,
        //   'has_push': that.data.has_push
        // }
        // var avatar_gender = tempFilePaths;
        // console.log(avatar_gender);
        // console.log(typeof(avatar_gender));
        // that.users_person(data, avatar_gender);
      }
    })
  },

  inputNickName: function(e) {
    var that = this;
    that.setData({
      real_name: e.detail.value
    })
    console.log(that.data.real_name)
  },

  bindViewEvent: function (e) { // gender
    var that = this;
    that.setData({
      index: e.detail.value
    })
    var data = {
      'gender': e.detail.value,
      'has_push': that.data.has_push
    }
    var avatar_gender = parseInt(e.detail.value);
    console.log(avatar_gender);
    console.log(typeof(avatar_gender));
    that.users_person(data, avatar_gender);
  },

  inputTelNum: function(e) {
    var that = this;
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    // if (!myreg.test(mobile)) {
    //   wx.showToast({
    //     title: '手机号有误！',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    // }
    that.setData({
      phone_number: e.detail.value
    })
    console.log(that.data.phone_number)
  },

  inputCompany: function(e) {
    var that = this;
    that.setData({
      company: e.detail.value
    })
    console.log(that.data.company)
  },

  inputSign: function(e) {
    var that = this;
    // console.log(e);
    that.setData({
      remark: e.detail.value
    })
    console.log(that.data.remark)
  },
 
  cancel: function() { // cancel button
    var that = this;
    var person_info = that.data.personInfo;
    console.log(person_info);

    var companyStorage = wx.getStorageSync('company');
    var company = '';
    if (companyStorage) {
      if (companyStorage === '' || companyStorage === null || companyStorage === undefined) {
        company = '-';
        console.log('company--1-');
      } else {
        company = wx.getStorageSync('company');
        console.log('company--2-');
      }
    } else {
      company = '-';
      console.log('company--3-');
    }

    var remark_1 = person_info.remark;
    var remark = '';
    if (remark_1 === '' || remark_1 === null || remark_1 === undefined) {
      console.log('remar--1-');
      remark = '-';
    } else {
      remark = person_info.remark;
      console.log('remar--2-');
    }

    that.setData({
      hiddenNickNamePut: true,
      hiddenTelNumPut: true,
      hiddenCompanyPut: true,
      hiddenSignPut: true,

      avatar: app.globalData.userInfo.avatarUrl,
      real_name: person_info.real_name,
      index: person_info.gender,
      phone_number: person_info.phone_number,
      // province: province,
      // city: city,
      company: company,
      remark: remark,
    });
  },

  confirm: function(e) { // confirm button
    var that = this;
    that.setData({
      hiddenNickNamePut: true,
      hiddenTelNumPut: true,
      hiddenCompanyPut: true,
      hiddenSignPut: true,
    })
    
    var data = {
      'avatar': app.globalData.userInfo.avatarUrl,
      'real_name': that.data.real_name,
      'gender': that.data.index,
      'phone_number': that.data.phone_number,
      'company': that.data.company,
      'remark': that.data.remark,
      'has_push': that.data.has_push
    }
    that.users(data);
  },

  users: function (data) { // modify users person information
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + '/api/users',
      method: 'PUT',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        console.log(res);
        if(res.statusCode === 200) {
          // that.setData({
          //   real_name: that.data.real_name_1,
          // });
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
          // console.log(data.avatar)
          // that.setData({
          //   avatar: data.avatar,
          // });

        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1500
          })
          var personInfo = that.data.perInfo;
          console.log(personInfo);
          that.setData({
            avatar: personInfo.avatar,
            real_name: personInfo.real_name,
            index: personInfo.gender,
            phone_number: personInfo.phone_number,
            // company: personInfo.company,
            remark: personInfo.remark
          })
        }
        
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '网络错误,请重试',
          showCancel: false,
        })
      }
    })
  },

  users_person: function (data, avatar_gender) { // modify users person information
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + '/api/users',
      method: 'PUT',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          console.log(typeof (avatar_gender));
          if (typeof (avatar_gender) == 'number') {
            that.setData({
              index: avatar_gender,
            });
          } else {
            that.setData({
              avatar: avatar_gender,
            });
            console.log(that.data.avatar);
          }
          
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1500
          })
          var personInfo = that.data.perInfo;
          console.log(personInfo);
          that.setData({
            avatar: personInfo.avatar,
            real_name: personInfo.real_name,
            index: personInfo.gender,
            phone_number: personInfo.phone_number,
            // company: personInfo.company,
            remark: personInfo.remark
          })
        }

      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '网络错误,请重试',
          showCancel: false,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // var that = this;
    // wx.stopPullDownRefresh();
    // that.getUsers();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    console.log(options);
    if (options.from === 'menu') {
      console.log("share---");
    }

    return {
      title: '访客系统',
      path: '/pages/index/index',
      success: function(res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '转发失败',
          duration: 2000
        })
      }
    }
  }
})