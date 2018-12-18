// pages/index/detail/detail.js
var app = getApp();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_stat: 0,
    waitItems: null,
    passItems: null,
    rejectItems: null,
    waitItems_copy: null,
    itemss: [],
    itemsss: [],
    months1: [],
    months2: [],
    months3: [],
    visit_id: 0,
    entry_time: '',
    leave_time: '',
    real_name: '',
    visitor_real_name: '',
    company: '',
    department: '',
    job: '',
    job_copy: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var visit_id = parseInt(options.id);
    var apply_stat = parseInt(options.visit_status);
    that.setData({
      visit_id: visit_id, // 数据类型应该是number，现在是string
      apply_stat: apply_stat
    })
    that.get_event(visit_id, apply_stat);
  },

  restart_apply: function () {
    var that = this;
    wx.redirectTo({
      url: '../../newApply/newApply',
    })
  },

  reject_modal: function () {
    var that = this;
    wx.showModal({
      title: '被拒原因',
      content: that.data.waitItems_copy.reject_reason,
      showCancel: false,
    })
  },

  get_event: function (id, visit_status) {
    var that = this;
    var host = app.globalData.host;
    wx.showLoading({
      title: '加载中...',
    })
    var data = {
      'id': id,
      'entry_time': 0,
      'leave_time': 0,
      'interviewee_id': 0,
      'visit_status': visit_status
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
            // 是个数组
            var items = res.data.data[0];
            console.log(res.data.data);
            var interviewee_id = items.interviewee_id;
            console.log('interviewee_id--' + interviewee_id);

            that.search_name(interviewee_id);

            var entry_time = util.formatDateOne(items.entry_time * 1000);
            var leave_time = util.formatDateTwo(items.leave_time * 1000);
            
            that.setData({
              waitItems_copy: items,
              entry_time: entry_time,
              leave_time: leave_time,
            })
            wx.hideLoading();
            console.log(that.data.waitItems);
          }
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

  search_name: function (interviewee_id) {
    var that = this;
    var host = app.globalData.host;
    var data = {
      // 'id': interviewee_id,
    };
    wx.request({
      url: host + '/api/users/' + interviewee_id,
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res)
          if (res.data.error_code === 0) {
            var visitor_info = res.data.data[0];
            var company_id = visitor_info.company_id;
            var department_id = visitor_info.department_id;
            that.search_company(company_id);
            that.search_department(department_id);
            that.setData({
              visitor_real_name: visitor_info.real_name,
              job_copy: visitor_info.title
            })
          }
            
        } else {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: res.data.message + '网络错误，请重试',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: res.errMsg + '网络错误，请重试',
          showCancel: false
        })
      }
    })
  },

  search_company: function (company_id) {
    var that = this;
    var host = app.globalData.host;
    var data = {
      'id': company_id,
    };
    wx.request({
      url: host + '/api/getCompany',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res)
          if (res.data.error_code === 0) {
            var visitor_company = res.data.data[0];
            var company = visitor_company.name;
            that.setData({
              company: company,
            })
          }

        } else {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: res.data.message + '网络错误，请重试',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: res.errMsg + '网络错误，请重试',
          showCancel: false
        })
      }
    })
  },

  search_department: function (department_id) {
    var that = this;
    var host = app.globalData.host;
    var data = {
      'id': department_id,
    };
    wx.request({
      url: host + '/api/getDepartment',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          console.log(res)
          if (res.data.error_code === 0) {
            var visitor_department = res.data.data[0];
            var department = visitor_department.name;
            var real_name = wx.getStorageSync('real_name');
            that.setData({
              department: department,
              job: that.data.job_copy,
              real_name: real_name,
              waitItems: that.data.waitItems_copy
            })
          }

        } else {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: res.data.message + '网络错误，请重试',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: res.errMsg + '网络错误，请重试',
          showCancel: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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