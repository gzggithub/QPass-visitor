//index.js //获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
const upng = require('../../utils/UPNG.js');

Page({
  data: {
    //tabbar
    tabbar: {},
    imageList: ['../../image/Group.png'],
    imgList: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAiCAMAAADrsDC0AAAAAXNSR0IB2cksfwAAAPlQTFRFAAAALov/InzpIXzqIHzqIX3qIX3qI3znNnjWTHTCb22jtWBi9lUp/1Ig/1Mg/1Mf/1Qf/10uJH3qIH3pIH3pIHzpJ3viZ2+o1VpG/1If/1Mg/1Ig/1MfIYTvIXzpIHzqIXzpcG2h5Fg4/1If/1If/1IhI37qIXzqLnndwF5Z/1Mg/1QfIXzrIH3qInzom2V7/1Mf/1IfIH3p9lQouF9gd2ubWHG2QnbLK3rg/1MfIH3qIX3qIXzpIn7qK4DxIX3qIX3pJH3tIX3qI4TtIXzqIH7qIX3qIn3qI33rIoDuJH/tIXzqIX3pIH3qJHzmNXnWT3O/cW2gtmBizKnC3AAAAFN0Uk5TAAtSnL/Z8/bw7vD289m/nFILMa73///////3rjEfpP7////+pB9J8P//8Elz/f///XOv////////8+fMmmES+7E5sx3yV3x4WB44+pnl9+/y9PmzldysAAABMElEQVR4nI3U51YCQQwF4CvNStMNOCAdsSv2ghQFe/f9H8YNLlvYKeT3d5KZTCaAF3ORaCyemF9YXFpeSabSmSxksbpmkRu5/LoQheJGSJXKFQpEtVYXotHcDLLWFoVie0cIsbvnZ/sHYUZ0eGTD9rGPyRQHQ+HCljTbOCOXbjulS5KzuWes8xn/L1NWM6IaV26O+1bRuardR9HgPp7oGFGeExbtx7L0Lndqu0IWET0jOuOEGURN7pxdGjGTu2CXQtzkLtklkTC5K3bXMFzXdTcz1u2YnHOPW5Nz+tI1OafPvb6eTd4NA72bzAHutMybK9zrnDenGI7UzD/3eFBOdOAfAY8qF/yXwJM82/Q/B55n2xvAy/St5XvIjtfBm6eUe42j133vfFifX98/v6E9+QcDiGkkVRTbHQAAAABJRU5ErkJggg=='],
    imgTemp: '',
    marginTop: 80,
    transition: 1,
    change_date: '今日',
    today_schedule: true,
    // today_color: '#207CE9',
    today_color: '#D4E8FF',
    today_bgcolor: '#207CE9',
    // today_bgcolor: '#AAD4F5',
    dayStyle: [
      {
        month: 'current',
        day: new Date().getDate(),
        color: '#D4E8FF',
        background: '#207CE9'
      }
    ],
    items: [],
    itemsMonths: [],
    history_record: [],
    no_record: false,
    history_record_other: [],
    scheduleItems: [],
    startX: 0, //开始坐标
    startY: 0,
    navData: app.globalData.navData,
    animation: {},
    preIndex: 0,
    curYear: new Date().getFullYear(), // 年份
    curMonth: new Date().getMonth() + 1,// 月份 1-12
    day: new Date().getDate(), // 日期 1-31 若日期超过该月天数，月份自动增加
    header_show: true, // 主标题是否显示
    prev: true, // 上一个月按钮是否显示
    next: true, // 下一个月按钮是否显示
    overflow_height: 360,
    top: 0,
    scrollTop: 0,
    clientHeight: app.globalData.windowHeight,
    platform: app.globalData.systemInfo.platform
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideTabBar(); // 隐藏tabbar
    this.setData({ // 自定义tabBar赋值
      tabBar: app.globalData.tabBar
    })
    app.editTabbar();
    var apply_time = options.entry_time;
    // if (wx.getStorageSync('hasLogin')) {
    //   app.globalData.hasLogin = wx.getStorageSync('hasLogin');
    // } else {
      // setTimeout(function () {
        // if (app.globalData.hasLogin === false) { // 判断是否登录
          // wx.showModal({
          //   title: '提示',
          //   content: '请先登录，谢谢',
          //   showCancel: false,
          //   success: function(res) {
          //     if (res.confirm) {
                // wx.reLaunch({
                //   url: '../mine/mine?origin=1',
                // })
          //     }
          //   }
          // }) 
        // }
      // }, 800)
    // }

    // if (app.globalData.hasLogin === true) {
    //   that.indexInit(apply_time);
    // }

    var items = [
      {},
    ];
    var entry_time = 0;
      items.forEach((element) => {
        if (element.visit_status === 1) { // 申请中
          element.background = '#f5a623';
          element.class = 'linear_orange';
        } else if (element.visit_status === 2) { // 已通过
          element.background = '#76C81B';
          element.class = 'linear_blue';
        } else if (element.visit_status === 3) { // 已拒绝
          element.background = '#ec4412';
          element.class = 'linear_red';
        }
        entry_time = util.formatDate(element.entry_time * 1000); // 日期转化
        element.day = new Date(element.entry_time * 1000).getDate();
        element.entry_date = util.formatDateThree(element.entry_time * 1000);
        that.data.dayStyle.unshift({
          'month': 'current',
          'day': element.day,
          'color': '#FFFFFF',
          'background': element.background
        })
        that.data.dayStyle.unshift({
          'month': 'current',
          'day': new Date().getDate(),
          'color': that.data.today_color,
          background: that.data.today_bgcolor
        });
        that.data.itemsMonths.unshift(element);
      that.setData({ // 重新渲染数据
        dayStyle: that.data.dayStyle,
        itemsMonths: that.data.itemsMonths,
        history_record: [],
      })
      console.log(that.data.history_record);
      if (nowDay) {
        console.log(nowDay);
        var entry_time_1 = parseInt(nowDay.getTime() / 1000);
        var leave_time_1 = parseInt((nowDay.getTime() + 24 * 60 * 60 * 1000 - 1) / 1000);
        that.get_event_day(entry_time_1, leave_time_1);// 先查当前的一天
      }
      wx.hideLoading();
      console.log(that.data.dayStyle);
      console.log(that.data.itemsMonths);
    }
  },

  indexInit: function (apply_time) {
    var that = this;
    var date = new Date(),
        y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);
    var nowDay = new Date(y, m, d);

    var entry_time = parseInt(firstDay.getTime() / 1000);
    var leave_time = parseInt((lastDay.getTime() + 24 * 60 * 60 * 1000 - 1) / 1000);
    
    if (apply_time) {
      var date_a = new Date(apply_time * 1000),
        y_a = date_a.getFullYear(),
        m_a = date_a.getMonth(),
        d_a = date_a.getDate();
      var firstDay = new Date(y_a, m_a, 1);
      var lastDay = new Date(y_a, m_a + 1, 0);
      nowDay = new Date(y_a, m_a, d_a);
      entry_time = parseInt(firstDay.getTime() / 1000);
      leave_time = parseInt((lastDay.getTime() + 24 * 60 * 60 * 1000 - 1) / 1000);
      that.equalDay(d_a, (m_a + 1), y_a);
      that.setData({
        curYear: y_a, // 年份
        curMonth: m_a + 1,// 月份 1-12
        day: d_a,
      })
    }  
    that.get_event(entry_time, leave_time, nowDay, apply_time);
  },

  getHistory: function () {
    var that = this;
    wx.navigateTo({
      url: '../history/history',
    })
  },

  modify_apply: function () {
    var that = this;
    wx.navigateTo({
      url: '../modify/modify',
    })
  },

  bindchange: function(e) {
    var that = this;
    if (e.detail.source === 'touch') { //防止swiper控件卡死问题
      if (e.detail.current == 0 && that.data.preIndex > 1) {//卡死时，重置current为正确索引
        that.setData({
          preIndex: that.data.preIndex // no understand
        });
      } else { // 正常轮转时，记录正确页码索引
        that.setData({ 
          preIndex: e.detail.current 
        });
      }
    }
  },

  monthDays: function (event) {
    var that = this;
    that.setData({ //查询之前有个默认的当前日期，在数组中
      dayStyle: [
        {
          month: 'current',
          day: new Date().getDate(),
          color: that.data.today_color,
          background: that.data.today_bgcolor,
        }
      ],
      itemsMonths: [],
      history_record: [],
      no_record: true,
    })
    var currentDay = new Date().getDate();
    
    var currentMonth = event.detail.currentMonth - 1;
    var currentYear = event.detail.currentYear;
    wx.setStorageSync("clickDay", currentDay);
    wx.setStorageSync("clickMonth", event.detail.currentMonth);
    wx.setStorageSync("clickYear", currentYear);
    
    var firstDay = new Date(currentYear, currentMonth, 1);
    var lastDay = new Date(currentYear, currentMonth + 1, 0);
    var nowDay = new Date(currentYear, currentMonth, currentDay);
    // console.log(nowDay);
    // console.log(firstDay);
    // console.log(lastDay);
    var entry_time = parseInt(firstDay.getTime() / 1000);
    var leave_time = parseInt((lastDay.getTime() + 24 * 60 * 60 * 1000 - 1) / 1000);
    // console.log(entry_time);
    // console.log(new Date(entry_time * 1000));
    // console.log(typeof (entry_time));
    // console.log(leave_time);
    // console.log(new Date(leave_time * 1000));
    // console.log(typeof (leave_time));
    if (event.detail.currentDay) {
      currentDay = event.detail.currentDay;
    }
    that.equalDay(currentDay, event.detail.currentMonth, currentYear);
    that.get_event(entry_time, leave_time, nowDay);
  },

  next: function (event) { // 点击下个月事件
    var that = this;
    console.log(event.detail);
    // var clickDay = new Date().getDate();
    // var clickMonth = event.detail.currentMonth;
    // var clickYear = event.detail.currentYear;
    // console.log(clickDay);
    // console.log(clickMonth);
    // console.log(clickYear);
    // that.daysSearch(clickDay, clickMonth, clickYear);
    that.monthDays(event);
  },

  prev: function (event) { // 点击上个月事件
    var that = this;
    // console.log(event.detail);
    that.monthDays(event);
  },

  dateChange: function (event) { // 点击日历标题日期选择器事件
    var that = this;
    // console.log(event.detail);
    that.monthDays(event);
  },

  daysSearch: function (clickDay, clickMonth, clickYear) {
    var that = this;
    that.data.dayStyle.push({ //查询之前把当前的日期投到数组中
          month: 'current',
          day: new Date().getDate(),
          color: that.data.today_color,
          background: that.data.today_bgcolor
    })
    that.setData({
      dayStyle: that.data.dayStyle
    })
    var entry_time = (parseInt((new Date(clickYear, clickMonth - 1, clickDay).getTime()) / 1000)); //查询开始时间
    var entry_time1 = new Date(entry_time * 1000);
    var leave_time = (parseInt(((new Date(clickYear, clickMonth - 1, clickDay)).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000)); //查询结束时间
    var leave_time1 = new Date(leave_time * 1000);
    console.log(entry_time);
    console.log(typeof (entry_time));
    console.log(entry_time1);
    console.log(typeof (leave_time));
    console.log(leave_time);
    console.log(leave_time1);

    that.get_event_day(entry_time, leave_time); // 点击查看某天的
  },

  //给点击的日期设置一个背景颜色， 
  // 未实现日历上滑到点击的日期，显示点击日期的日程
  dayClick: function(event) {
    var that = this;
    // console.log(event);
    let clickDay = event.detail.day;
    let clickMonth = event.detail.month;
    let clickYear = event.detail.year;
    let changeDay = `dayStyle[0].day`;
    let changeBg = `dayStyle[0].background`;
    let changeColor = `dayStyle[0].color`;
    let changeDay1 = `dayStyle[1].day`;
    let changeBg1 = `dayStyle[1].background`;
    let changeColor1 = `dayStyle[1].color`;
    if (clickDay == new Date().getDate()) {
      that.setData({
        [changeDay]: clickDay,
        today_color: '#FFFFFF',
        today_bgcolor: '#207CE9',
      })
    } else {
      that.setData({
        [changeDay]: clickDay,
        [changeBg]: "#207ce9",
        [changeColor]: "#FFFFFF",
        today_color: '#207CE9',
        today_bgcolor: '#D4E8FF',
      })
    }
    
    // console.log("clickDay--" + clickDay);
    wx.setStorageSync("clickYear", clickYear);
    wx.setStorageSync("clickMonth", clickMonth);
    // console.log(clickMonth);
    wx.setStorageSync("clickDay", clickDay);
    var week = (new Date(clickYear + '-' + clickMonth + '-1')).getDay();
    // console.log("week--" + week);
    // that.sliderMove(week, clickDay);

    that.daysSearch(clickDay, clickMonth, clickYear);  
    that.equalDay(clickDay, clickMonth, clickYear);
  },

  equalDay: function (clickDay, clickMonth, clickYear) {
    var that = this;
    var date_time = new Date();
    var day = date_time.getDate();
    var month = date_time.getMonth() + 1;
    var year = date_time .getFullYear();
    // console.log(day);
    // console.log(clickDay);
    // console.log(month);
    // console.log(clickMonth);
    // console.log(typeof (day));
    // console.log(year);
    // console.log(clickYear); 
    if (clickDay == day && clickMonth == month && clickYear == year) {
      that.setData({
        change_date: '今日',
        today_schedule: true,
      })
    } else {
      that.setData({
        change_date: clickMonth + '月' + clickDay + '日',
        today_schedule: true,
      })
    }
  },

  clickHistory: function() {
    var that = this;
    wx.navigateTo({
      url: '../history/history'
    })
  },

  see_more: function () {
    var that = this;
    var host = app.globalData.host;
    var data = {}; 
  },

  get_event: function (entry_time, leave_time, nowDay, apply_time) {
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
      success: function (respon) {
        if (respon.statusCode === 200) {
          if (respon.data.error_code === 0) {  
            console.log(respon)
            var items = [];
            items = respon.data.data; // 是个数组
            console.log(respon.data.data);
            var entry_time = 0;
            if (!respon.data.data) { // no found
              // no found deal
              that.setData({
                no_record: true
              })
              wx.hideLoading();
            } else {
              items.forEach((element)=>{
                if (element.visit_status === 1) { // 申请中
                  element.background = '#f5a623';
                  element.class = 'linear_orange';
                } else if (element.visit_status === 2) { // 已通过
                  element.background = '#76C81B';
                  element.class = 'linear_blue';
                } else if (element.visit_status === 3) { // 已拒绝
                  element.background = '#ec4412';
                  element.class = 'linear_red';
                }
                entry_time = util.formatDate(element.entry_time * 1000); // 日期转化
                element.day = new Date(element.entry_time * 1000).getDate();
                element.entry_date = util.formatDateThree(element.entry_time * 1000);
                that.data.dayStyle.unshift({
                  'month': 'current',
                  'day': element.day,
                  'color': '#FFFFFF',
                  'background': element.background
                })
                that.data.dayStyle.unshift({
                  'month': 'current',
                  'day': new Date().getDate(),
                  'color': that.data.today_color,
                  background: that.data.today_bgcolor
                });
                that.data.itemsMonths.unshift(element);
              })
              that.setData({ // 重新渲染数据
                dayStyle: that.data.dayStyle,
                itemsMonths: that.data.itemsMonths,
                history_record: [],
              })
              console.log(that.data.history_record);
              if (nowDay) {
                console.log(nowDay);
                var entry_time_1 = parseInt(nowDay.getTime() / 1000);
                var leave_time_1 = parseInt((nowDay.getTime() + 24 * 60 * 60 * 1000 - 1) / 1000);
                that.get_event_day(entry_time_1, leave_time_1);// 先查当前的一天
              }
              wx.hideLoading();
              console.log(that.data.dayStyle);
              console.log(that.data.itemsMonths);
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
            content: respon.data.message + '网络错误，请重试',
            showCancel: false,
          })
        }
      },
      fail: function (respon) {
        console.log(respon);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: res.errMsg + '网络错误，请重试',
          showCancel: false
        })
      }
    })
  },

  get_event_day: function (entry_time, leave_time) {
    var that = this;
    console.log(that.data.itemsMonths);
    that.setData({
      history_record: []
    })
    that.data.itemsMonths.forEach(function(element) {
      if (entry_time <= element.entry_time & element.leave_time <= leave_time) {
        that.data.history_record.unshift(element);
      }
    })
    if (that.data.history_record.length == 0) {
      that.setData({ // 重新渲染数据
        no_record: true,
      })
    } else {
      that.setData({
        no_record: false,
        history_record: that.data.history_record
      })
    }
    console.log(that.data.history_record);
  },

  get_event_day_copy: function (entry_time, leave_time) {
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
          console.log(res.data);
          if (res.data.error_code === 0) {
            console.log(res.data)
            var items = []; // 未清空
            console.log(res.data.data);
            if (!res.data.data) { // no found
              that.setData({ // 重新渲染数据
                no_record: true,
                history_record: []
              })
              wx.hideLoading();
            } else {
              console.log(res.data.data);
              items = res.data.data; // 是个数组
              that.data.history_record = [];
              items.forEach((element)=> {
                if (element.visit_status === 1) { // 申请中
                  element.class = 'linear_orange';
                } else if (element.visit_status === 2) { // 已通过
                  element.class = 'linear_blue';
                } else if (element.visit_status === 3) { // 已拒绝
                  element.class = 'linear_red';
                }
                element.entry_date = util.formatDateThree(element.entry_time * 1000); // 日期转化
                
                that.data.history_record.unshift(element);
              });
              that.setData({ // 重新渲染数据
                // history_record: items,
                no_record: false,
                preIndex: 0,
                history_record: that.data.history_record
              })
              wx.hideLoading();
              console.log(that.data.history_record)
            }
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
  },

  deleteRecord: function (e) {
    var that = this;
    console.log(e);
    var id = e.currentTarget.dataset.id; // 获取当前长按id
    var time = e.currentTarget.dataset.time;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          that.delectEvent(id, time);
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },

  delectEvent: function (id, time) {
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
            duration: 1500
          })

          var dateTime = new Date(time*1000);
          console.log(dateTime);
          var clickDay = dateTime.getDate();
          var clickMonth = dateTime.getMonth() + 1;
          var clickYear = dateTime.getFullYear();
          console.log(clickYear+'-'+clickMonth+'-'+clickDay);
          // that.daysSearch(clickDay, clickMonth, clickYear); // 按天刷新
          var event = {
            detail:{
              currentYear: clickYear, 
              currentMonth: clickMonth,
              currentDay: clickDay,
            }
          }
          // that.setData({
          //   itemsMonths: [],
          //   history_record: [],
          // })
          that.monthDays(event); // 按月刷新
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

  go_apply: function () {
    var that = this;
    wx.navigateTo({
      url: '../newApply/newApply',
    })
  },

  sliderMove: function (week, clickDay) {
    var that = this;
    // console.log("int--" + int)
    switch (week) {
      case 0:
        if (clickDay >= 1 && clickDay <= 7) {
          that.marginTop80();
        } else if (clickDay >= 8 && clickDay <= 14) {
          that.marginTop50();
        } else if (clickDay >= 15 && clickDay <= 21) {
          that.marginTop10();
        } else if (clickDay >= 22 && clickDay <= 28) {
          that.marginTop60();
        } else if (clickDay >= 29 && clickDay <= 31) {
          that.marginTop110();
        } 
        break;
      case 1:
        if (clickDay >= 1 && clickDay <= 6) {
          that.marginTop80();
        } else if (clickDay >= 7 && clickDay <= 13) {
          that.marginTop50();
        } else if (clickDay >= 14 && clickDay <= 20) {
          that.marginTop10();
        } else if (clickDay >= 21 && clickDay <= 27) {
          that.marginTop55();
        } else if (clickDay >= 28 && clickDay <= 31) {
          that.marginTop110();
        }    
        break;
      case 2:
        if (clickDay >= 1 && clickDay <= 5) {
          that.marginTop80();
        } else if (clickDay >= 6 && clickDay <= 12) {
          that.marginTop50();
        } else if (clickDay >= 13 && clickDay <= 19) {
          that.marginTop10();
        } else if (clickDay >= 20 && clickDay <= 26) {
          that.marginTop60();
        } else if (clickDay >= 27 && clickDay <= 31) {
          that.marginTop110();
        }   
        break;
      case 3:
        if (clickDay >= 1 && clickDay <= 4) {
          that.marginTop80();
        } else if (clickDay >= 5 && clickDay <= 11) {
          that.marginTop50();
        } else if (clickDay >= 12 && clickDay <= 18) {
          that.marginTop10();
        } else if (clickDay >= 19 && clickDay <= 25) {
          that.marginTop60();
        } else if (clickDay >= 26 && clickDay <= 31) {
          that.marginTop110();
        }   
        break;
      case 4:
        if (clickDay >= 1 && clickDay <= 3) {
          that.marginTop80();
        } else if (clickDay >= 4 && clickDay <= 10) {
          that.marginTop40();
        } else if (clickDay >= 11 && clickDay <= 17) {
          that.marginTop10();
        } else if (clickDay >= 18 && clickDay <= 24) {
          if (that.data.platform == 'ios') {
            that.marginTop60();
            console.log("ios");
          } else {
            that.marginTop55();
            console.log("android - and - devtools");
          }
          
        } else if (clickDay >= 25 && clickDay <= 31) {
          that.marginTop110();
        }   
        break;
      case 5:
        if (clickDay >= 1 && clickDay <= 2) {
          that.marginTop80();
        } else if (clickDay >= 3 && clickDay <= 9) {
          that.marginTop50();
        } else if (clickDay >= 10 && clickDay <= 16) {
          that.marginTop10();
        } else if (clickDay >= 17 && clickDay <= 23) {
          that.marginTop60();
        } else if (clickDay >= 24 && clickDay <= 31) {
          that.marginTop110();
        }   
        break;
      case 6:
        if (clickDay >= 1 && clickDay < 2) {
          that.marginTop80();
          console.log("1--")
        } else if (clickDay >= 2 && clickDay <= 8) {
          that.marginTop40();
          console.log("2--")
        } else if (clickDay >= 9 && clickDay <= 15) {
          that.marginTop10();
          console.log("9--")
        } else if (clickDay >= 16 && clickDay <= 22) {
          that.marginTop60();
          console.log("16--")
        } else if (clickDay >= 23 && clickDay <= 29) {
          that.marginTop110();
          console.log("23--")
        } else if (clickDay >= 30 && clickDay <= 31) {
          that.marginTop160();
          console.log("30--")
        }
        break;
      default:
        //unknow status
        break;
    }
  },

  marginTop80: function () {
    var that = this;
    that.setData({
      marginTop: 80,
    })
  },

  marginTop50: function () {
    var that = this;
    that.setData({
      marginTop: 50,
    })
  },
  marginTop40: function () {
    var that = this;
    that.setData({
      marginTop: 40,
    })
  },

  marginTop10: function () {
    var that = this;
    that.setData({
      marginTop: -10,
    })
  },

  marginTop60: function () {
    var that = this;
    that.setData({
      marginTop: -60,
    })
  },

  marginTop55: function () {
    var that = this;
    that.setData({
      marginTop: -50,
    })
  },

  marginTop110: function () {
    var that = this;
    that.setData({
      marginTop: -95,
      // marginTop: -110
      // transition: 2
    })
  },

  marginTop160: function () {
    var that = this;
    that.setData({
      marginTop: -135,
      // marginTop: -160
      // transition: 2
    })
  },

  getImageInfo: function (imageUrl) {
    var that = this;
    wx.getImageInfo({
      src: imageUrl,
      success: function (img) {
        console.log(img);
        console.log(img.width);
        console.log(img.height);
        that.base64Canvas('myCanvas', imageUrl, img.width, img.height);
      }
    })
  },

  base64Canvas: function (canvasID, imgPath, imgWidth, imgHeight) {
    var that = this;
    var canvas = wx.createCanvasContext(canvasID);
    canvas.drawImage(imgPath, 0, 0, imgWidth, imgHeight);
    canvas.draw(false, () => {
      wx.canvasGetImageData({
        canvasId: canvasID,
        x: 0,
        y: 0,
        width: imgWidth,
        height: imgHeight,
        success(res) {
          let pngData = upng.encode([res.data.buffer], res.width, res.height);
          let base64 = wx.arrayBufferToBase64(pngData);
          console.log(base64);
          let tempImg = 'data:image/png;base64,' + base64;
          that.setData({
            imgTemp: tempImg
          })
          console.log(that.data.imgTemp)
        }
      })
    })
  },

  //删除事件
  del: function (e) {
    var that = this;
    that.data.items.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      items: that.data.items
    })
  },

  onReady: function () {
    console.log("on Ready -- start");
    var that = this;
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () {  // 做了个延时重试一次，作为保底。
          wx.hideTabBar()
        }, 500)
      }
    })

    that.animation = wx.createAnimation();
  },

  onShow: function () {
    wx.hideTabBar();
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () { // 下拉刷新
    var that = this;
    that.setData({
      itemsMonths: [],
      history_record: [],
      dayStyle: [
        {
          month: 'current',
          day: new Date().getDate(),
          color: that.data.today_color,
          background: that.data.today_bgcolor
          // background: '#FFFFFF'
        }
      ],
      curYear: new Date().getFullYear(),
      curMonth: new Date().getMonth() + 1,
      day: new Date().getDate(),
      change_date: '今日',
      marginTop: 80
    })
    that.indexInit();
    wx.stopPullDownRefresh(); // 放到最后
  },

  onReachBottom: function () {

  },

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