// pages/apply/identityInformation/identityInformation.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageInfo: '50',
    realName: '',
    gender: ['未选择', '男', '女'],
    index: 1,
    IdCard: '',//string类型
    phone_number: '',
    company: '',
    department: '',
    job: '',
    finish_suc: true,
    face_token_one: '',
    face_copy: '',
    nochange: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.face_copy);
    console.log(options.change); // 传过来的是string，不是Boolean
    console.log(options)

    if (options.change) {
      that.setData({
        finish_suc: false,
        face_copy: options.face_copy,
        nochange: options.change,
      })
    } else {
      that.setData({
        finish_suc: false,
      })
    }

    if (wx.getStorageSync('status') === 1) {
      that.setData({
        realName: wx.getStorageSync('real_name'),
        index: wx.getStorageSync('gender'),
        IdCard: wx.getStorageSync('IdCard'),
        phone_number: wx.getStorageSync('phone_number'),
        company: wx.getStorageSync('company'),
        department: wx.getStorageSync('department'),
        job: wx.getStorageSync('job'),
      })
    }
  },

  bindRealNameEvent: function (e) {
    var that = this;
    that.setData({
      realName: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.realName);
  },

  bindGenderEvent: function (e) {
    var that = this;
    that.setData({
      index: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.index);
  },

  bindIdCardEvent: function (e) {
    var that = this;
    that.setData({
      IdCard: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.IdCard);
  },

  mobileInput: function (e) {
    var that = this;
    that.setData({
      phone_number: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.phone_number)
  },

  bindCompanyEvent: function (e) {
    var that = this;
    that.setData({
      company: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.company);
  },

  bindDepartmentEvent: function (e) {
    var that = this;
    that.setData({
      department: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.department);
  },

  bindJobEvent: function (e) {
    var that = this;
    that.setData({
      job: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.job);
  },

  formSubmit: function (e) {
    var that = this;
    var userName = that.data.realName;
    var gender = that.data.index;
    var IdCard = that.data.IdCard;
    var mobile = that.data.phone_number;
    var company = that.data.company;
    var department = that.data.department;
    var job = that.data.job;
    if (userName === '') {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    } else if (IdCard === '' || IdCard === undefined) {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    } else if (IdCard.length != 18) {
      wx.showToast({
        title: '身份证号长度有误！',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    } else if (mobile === '' || mobile === undefined) {
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (mobile.length != 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (company === '') {
      wx.showToast({
        title: '请输入所属单位',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (department === '') {
      wx.showToast({
        title: '请输入在职部门',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (job === '') {
      wx.showToast({
        title: '请输入所在职位',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    var regIDCard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    if (!regIDCard.test(IdCard)) {
      wx.showToast({
        title: '身份证号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    console.log("222");
    wx.showLoading({
      title: '保存中...',
      success: function () {
        that.setData({
          finish_suc: true
        })
      }
    })
    if (that.data.nochange === 'true') {
      that.users(that.data.face_copy);
    } else {
      that.uploadFace();
    }
    // console.log(e) // 收集formId
    // app.collectFormIds(e.detail.formId);

    return true;
  },

  clickNext: function () {
    var that = this;
    // if (that.formSubmit()) {
    //   wx.showLoading({
    //     title: '保存中...',
    //     success: function () {
    //       that.setData({
    //         finish_suc: true
    //       })
    //     }
    //   })
    //   if (that.data.nochange === 'true') {
    //     that.users();
    //   } else {
    //     that.uploadFace();
    //   }
    // }
  },

  uploadFace: function () {
    var that = this;
    var temp = app.globalData.temp;
    var face_token = app.globalData.face_token;
    var host = app.globalData.host;
    wx.request({
      url: host + '/api/uploadFace',
      method: 'POST',
      data: {
        "image": temp,
        "face_token": face_token
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (resp) {
        console.log(resp);
        if (resp.statusCode === 200) {
          if (resp.data.error_code == 0) {
            that.users(face_token);
          } else {
            wx.showModal({
              title: '提示',
              content: resp.data.error_code + ' ' + resp.data.error_msg,
              showCancel: false,
              success: function () {
                that.setData({
                  finish_suc: false
                })
              }
            })
          }
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: resp.statusCode + '，' + resp.errMsg,
            showCancel: false,
            success: function () {
              that.setData({
                finish_suc: false
              })
            }
          })
        }
      },
      fail: function (resp) {
        console.log(resp);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: resp.errMsg + '网络请求错误',
          showCancel: false,
          success: function () {
            that.setData({
              finish_suc: false
            })
          }
        })
      }
    })
  },

  users: function (face_token) {
    var that = this;
    var host = app.globalData.host;
    // var face_token = '';
    // console.log("nochange--" + that.data.nochange); //传过来参数的是个字符串false不是Boolean值
    // console.log("face_token" + app.globalData.face_token);
    // console.log("face_copy" + that.data.face_copy);
    // if (that.data.nochange === 'true') {
    //   face_token = that.data.face_copy;
    //   console.log("face_copy--")
    // } else {
    //   face_token = app.globalData.face_token;
    //   console.log("face_token-- 666")
    // }

    var create_on = parseInt(Date.now() / 1000);
    var data = {
        'real_name': that.data.realName,
        'gender': that.data.index,
        'id_number': that.data.IdCard,
        'phone_number': that.data.phone_number,
        'created_on': create_on,
        'face_token_1': face_token,
        'status': 1,
        "has_push": true,
      }
    wx.request({
      url: host + '/api/users',
      method: 'PUT',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (respon) {
        console.log(respon);
        if (respon.statusCode === 200) {
          if (respon.data.error_code == 0) {
            var info = {
              'company': that.data.company,
              'department': that.data.department,
              'job': that.data.job,
            }
            var str = JSON.stringify(info);
            wx.navigateTo({
              url: '../visitedInformation/visitedInformation?jsonStr=' + JSON.stringify(info),
              success: function () {
                setTimeout(function () {
                  that.setData({
                    finish_suc: false
                  })
                }, 800)
                wx.setStorageSync('real_name', that.data.realName);
                wx.setStorageSync('company', that.data.company);
                wx.setStorageSync('department', that.data.department,);
                wx.setStorageSync('job', that.data.job);
              }
            })
          } else if (respon.data.error_code == 1) {
            wx.showModal({
              title: '提示',
              content: respon.data.error_code + ' ' + respon.data.error_msg,
              showCancel: false,
              success: function () {
                that.setData({
                  finish_suc: false
                })
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: respon.data.error_code + ' ' + respon.data.error_msg,
              showCancel: false,
              success: function () {
                that.setData({
                  finish_suc: false
                })
              }
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: respon.statusCode + ' ' + respon.error_msg,
            showCancel: false,
            success: function () {
              that.setData({
                finish_suc: false
              })
            }
          })
        }
      },
      fail: function (respon) {
        console.log(respon)
        wx.showModal({
          title: '提示',
          content: respon.errMsg + '网络错误，请重试',
          showCancel: false,
          success: function () {
            that.setData({
              finish_suc: false
            })
          }
        })
      },
      complete: function (respon) {
        wx.hideLoading();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log(options)
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