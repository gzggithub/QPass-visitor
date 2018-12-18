// pages/history/history.js
const app = getApp();
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    items: [],
    waitItems: [],
    passItems: [],
    rejectItems: [],
    events: {},
    padding: false,
    accepted: false,
    rejected: false,
    startX: 0, //开始坐标
    startY: 0,
    isTouchMove: false,
    clientHeight: app.globalData.windowHeight,
    isHideLoadMore: true,
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var that = this;
    var entry_time = 0;
    var leave_time = 0;
    // that.get_event(entry_time, leave_time);

    console.log(options.status)
    switch (parseInt(options.status)) {
      case 1:
        that.setData({
          currentTab: 0,
        })
        break;
      case 2:
        that.setData({
          currentTab: 1,
        })
        break;
      case 3:
        that.setData({
          currentTab: 2,
        })
        break;
      default:
        //unknow status
        break;
    }
  },

  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    if (e.detail.source === 'touch') {
      that.setData({
        currentTab: e.detail.current
      });
    }
  },

  /** 
   * 点击tab切换 
   */
  switchNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  click_apply: function () {
    var that = this;
    wx.navigateTo({
      url: '../newApply/newApply',
    });
  },

  get_event: function (entry_time, leave_time) {
    var that = this;
    var host = app.globalData.host;
    wx.showLoading({
      title: '加载中...',
    })
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
            var items = [];
            var items = res.data.data; // 是个数组
            console.log(res.data.data);
            if (!items) {
              var events = that.data.events;
              events.padding = {};
              events.accepted = {};
              events.rejected = {};
              that.setData({ // 重新渲染数据
                events: events,
                padding: true,
                accepted: true,
                rejected: true
              })
              
              wx.hideLoading();
            } else {
              var events = that.data.events;
              events.padding = {};
              events.accepted = {};
              events.rejected = {};
              items.forEach((element) => {
                element.entry_date = new Date(element.entry_time * 1000);
                element.entry = util.formatDateThree(element.entry_time * 1000);
                element.entry_month = element.entry_date.getMonth();
                switch (element.visit_status) {
                  case 1:
                    that.setMonth(element, events.padding);
                    break;
                  case 2:
                    that.setMonth(element, events.accepted);
                    break;
                  case 3:
                    that.setMonth(element, events.rejected);
                    break;
                  default:
                    //unknow status
                    break;
                }
              });
              console.log(events);
              if (JSON.stringify(events.padding) == "{}") {
                var padding = true;
              } else {
                var padding = false;
              }
              if (JSON.stringify(events.accepted) == "{}") {
                var accepted = true;
              } else {
                var accepted = false;
              }
              if (JSON.stringify(events.rejected) == "{}") {
                var rejected = true;
              } else {
                var rejected = false;
              }
              that.setData({ // 重新渲染数据
                events: events,
                padding: padding,
                accepted: accepted,
                rejected: rejected
              })
              wx.hideLoading();
            }
          }
        } else if (respon.statusCode === 403) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '您的登录信息已过期，请点击确定重新登录',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                app.globalData.hasLogin = false;
                wx.setStorageSync('hasLogin', false);
                wx.reLaunch({
                  url: '../mine/mine',
                })
              }
            }
          })
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: res.statusCode + ' ' + res.data.message + '网络错误，请重试',
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
  },

  setMonth: function (element, array) {
      switch (element.entry_date.getMonth()) {
        case 0:
          if (array.Jan) {
            array.Jan.push(element);
            array.Jan.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Jan = [];
            array.Jan.push(element);
            array.Jan.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 1:
          if (array.Feb) {
            array.Feb.push(element);
            array.Feb.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Feb = [];
            array.Feb.push(element);
            array.Feb.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 2:
          if (array.Mar) {
            array.Mar.push(element);
            array.Mar.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Mar = [];
            array.Mar.push(element);
            array.Mar.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 3:
          if (array.Apr) {
            array.Apr.push(element);
            array.Apr.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Apr = [];
            array.Apr.push(element);
            array.Apr.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 4:
          if (array.May) {
            array.May.push(element);
            array.May.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.May = [];
            array.May.push(element);
            array.May.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 5:
          if (array.Jun) {
            array.Jun.push(element);
            array.Jun.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Jun = [];
            array.Jun.push(element);
            array.Jun.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 6:
          if (array.Jul) {
            array.Jul.push(element);
            array.Jul.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Jul = [];
            array.Jul.push(element);
            array.Jul.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 7:
          if (array.Aug) {
            array.Aug.push(element);
            array.Aug.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Aug = [];
            array.Aug.push(element);
            array.Aug.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 8:
          if (array.Sep) {
            array.Sep.push(element);
            array.Sep.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Sep = [];
            array.Sep.push(element);
            array.Sep.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 9:
          if (array.Oct) {
            array.Oct.push(element);
            array.Oct.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Oct = [];
            array.Oct.push(element);
            array.Oct.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 10:
          if (array.Nov) {
            array.Nov.push(element);
            array.Nov.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Nov = [];
            array.Nov.push(element);
            array.Nov.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        case 11:
          if (array.Dec) {
            array.Dec.push(element);
            array.Dec.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          } else {
            array.Dec = [];
            array.Dec.push(element);
            array.Dec.sort(function (a, b) {
              var c = new Date(a.entry_time * 1000);
              var d = new Date(b.entry_time * 1000);
              return c < d ? 1 : -1;
            });
          }
          break;
        default:
          //错误处理，月份未生成或者 entry_time为null
          break;
      }
    return;
  },

  deleteRecord: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;//获取当前长按id
    var index = e.currentTarget.dataset.index;//获取当前长按下标
    console.log('id - index:' + id + ' -- ' + index);
    wx.showModal({
      title: '提示',
      content: '确定要删除此吗？',
      success: function (res) {
        if (res.confirm) {
          that.delectEvent(id, index);
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  delectEvent: function (id, index) {
    var that = this;
    var host = app.globalData.host;
    var data = {
      'id': id
    }
    wx.request({
      url: host + '/api/event',
      method: 'DELETE',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        console.log(res.data);
        if (res.statusCode === 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 3500
          })
          that.get_event(0, 0); // 重新请求数据刷新
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false
        })
      }
    })
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.items.forEach(function(v, i) {
      v.isTouchMove = false;
      if (Math.abs(angle) > 30) return;//滑动超过30度角 return
      if (i == index) {
        if (touchMoveX > startX) { //右滑
          v.isTouchMove = false;
        } else { //左滑
          v.isTouchMove = true
        }
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },

  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function(e) {
    var that = this;
    that.data.items.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      items: that.data.items
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
    var that = this;
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('加载更多')
    this.setData({
      isHideLoadMore: true,
      recommends: [],
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
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