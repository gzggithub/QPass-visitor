// pages/apply/applySuccess/applySuccess.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageList: ["https://avatar.csdn.net/4/6/5/2_qq_35713752.jpg"],
    entry_time: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.entry_time)
    that.setData({
      entry_time: options.entry_time
    })
  },

  goon_apply: function () {
    var that = this;
    wx.switchTab({
      url: '../newApply/newApply',
    });
  },

  back_home: function () {
    var that = this;
    wx.reLaunch({
      url: '../../index/index?entry_time=' + that.data.entry_time,
    });
    // wx.switchTab({
    //   url: '../../index/index',
    //   success: function (res) {
    //     let page = getCurrentPages().pop()
    //     if (page == undefined || page == null) {
    //       return
    //     }
    //     page.onLoad();
    //     // page.onShow();
    //   }
    // });
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imageList // 需要预览的图片http链接列表
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    
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