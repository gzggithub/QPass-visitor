// pages/template/tabbar/tabBar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

//初始化数据
function tabbarinit() {
  return [{
    "current": 0,
    "style": 0, //样式
    "pagePath": "../../pages/index/index",
    "iconPath": "../../image/rch-icon.png",
    "selectedIconPath": "../../image/rc-icon.png",
    "text": "日程"
  },
  {
    "current": 1,
    "style": 1, //样式
    "pagePath": "../../pages/newApply/newApply",
    "iconPath": "../../image/plus_ico.png",
    "selectedIconPath": "../../image/Item.png"
  },
  {
    "current": 2,
    "style": 0, //样式
    "pagePath": "../../pages/mine/mine",
    "iconPath": "../../image/wd-icon.png",
    "selectedIconPath": "../../image/wdl-icon.png",
    "text": "我的"
  }
  ]

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath'] //换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({
    bindData
  });
}

// function tabBarJump(){
//   getCurrentPages().pop();
//   wx.navigateTo({
//     url: './../index/index'
//   })
// }

module.exports = {
  tabbar: tabbarmain
}