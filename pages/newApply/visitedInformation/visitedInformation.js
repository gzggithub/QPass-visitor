// pages/apply/visitedInformation/visitedInformation.js
var app = getApp();
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageInfo: '85',
    visitors: '',
    interviewee_id: 62,
    company: '',
    department: '',
    job: '',
    visit_purpose: '',
    date1: util.formatDate(Date.now()),
    date2: util.formatDate(Date.now() + 60 * 60 * 1000),
    now: 0,
    create_on: 0,
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    dateTimeArray2: null,
    dateTime2: null,
    startYear: 2000,
    endYear: 2100,
    dateTimeNew: '',
    dateTimeNewLeave: '',
    detailInfo: null,
    finish_suc: true,
    no_exist: false,
    border_bottom: '',
    exist: false,
    entry_time: 0,
    leave_time: 0,
    platform: app.globalData.systemInfo.platform,
    get_access_token: '',
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    var that = this;
    var clickYear = wx.getStorageSync("clickYear");
    var clickMonth = wx.getStorageSync("clickMonth");
    var clickDay = wx.getStorageSync("clickDay");
    var now = Date.now();
    if (clickYear) {
      now = (new Date()).setUTCFullYear(clickYear, clickMonth - 1, clickDay);// 不知道在ios和Android手机上支持不支持
      console.log(now);
    }
    var date1 = util.formatDate(now);
    var date2 = util.formatDate(now + 60 * 60 * 1000);
    
    var obj = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear); // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear, date1);
    var obj2 = dateTimePicker.dateTimePicker2(that.data.startYear, that.data.endYear, date2);
      
    var lastArray = obj1.dateTimeArray.pop(); // 精确到分的处理，将数组的秒去掉
    var lastTime = obj1.dateTime.pop();
    var lastArray2 = obj2.dateTimeArray.pop(); // 精确到分的处理，将数组的秒去掉
    var lastTime2 = obj2.dateTime.pop();
    console.log(options);
    var detail_info = JSON.parse(options.jsonStr); //传过来的参数，不能删
    console.log(detail_info);

    // var dateLastest = util.formatDate(parseInt(Date.now() / 1000));
    var dateLastest = util.formatDate(parseInt(Date.now()));
    console.log('now--' + dateLastest)
    that.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,

      dateTimeArray2: obj2.dateTimeArray,
      dateTime2: obj2.dateTime,

      detailInfo: detail_info,
      now: now
    }); 
    // console.log('dateTime--' + that.data.dateTime);
    // console.log('dateTimeArray--' + that.data.dateTimeArray);
    // console.log('dateTimeArray1--' + that.data.dateTimeArray1);
    // console.log('dateTime1--' + that.data.dateTime1);

    // console.log('dateTimeArray2--' + that.data.dateTimeArray2);
    // console.log('dateTime2--' + that.data.dateTime2);
  },

  bindVisitorsEvent: function(e) {
    var that = this;
    if (e.detail.value === '' || e.detail.value === null || e.detail.value === undefined) {
      that.setData({
        visitors: e.detail.value,
        finish_suc: false,
      })
    } else {
      that.setData({
        visitors: e.detail.value,
        finish_suc: false,
        no_exist: true,
        exist: false,
      })
    }
    
    console.log(that.data.visitors);
    that.query_name(e.detail.value);
  },

  bindCompanyEvent: function(e) {
    var that = this;
    that.setData({
      company: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.company);
  },

  bindDepartmentEvent: function(e) {
    var that = this;
    that.setData({
      department: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.department);
  },

  bindJobEvent: function(e) {
    var that = this;
    that.setData({
      job: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.job);
  },

  bindVisitPurposeEvent: function(e) {
    var that = this;
    that.setData({
      visit_purpose: e.detail.value,
      finish_suc: false
    })
    console.log(that.data.visit_purpose);
  },

  formSubmit: function(e) { // 判断输入的信息合法性
    var that = this;
    
    var visitors = that.data.visitors;
    var company = that.data.company;
    var department = that.data.department;
    var job = that.data.job;
    var visit_purpose = that.data.visit_purpose;

    var entry_time = 0;
    var leave_time = 0;
    var entry_time_one = 0;
    var leave_time_one = 0;
    var now = that.data.now;
    if (!that.data.dateTimeNew) { // hava a problem
      entry_time = parseInt(now / 1000);
      entry_time_one = parseInt(now);
    } else {
      entry_time = parseInt(that.data.dateTimeNew / 1000);
      entry_time_one = parseInt(that.data.dateTimeNew);
    }

    if (!that.data.dateTimeNewLeave) {
      leave_time = parseInt((now + 1 * 60 * 60 * 1000) / 1000);
      leave_time_one = parseInt(now + 1 * 60 * 60 * 1000);
    } else {
      leave_time = parseInt(that.data.dateTimeNewLeave / 1000);
      leave_time_one = parseInt(that.data.dateTimeNewLeave);
    }

    var entry_leave_one = (leave_time_one) - (entry_time_one);

    that.setData({
      entry_time: entry_time,
      leave_time: leave_time
    })

    var entry_time_1 = new Date(entry_time * 1000);
    var leave_time_1 = new Date(leave_time * 1000);
    var currentDay = entry_time_1.getDate();
    var currentMonth = entry_time_1.getMonth();
    var currentYear = entry_time_1.getFullYear();
    var currentPreDayTime = new Date();
    var currentPreDay = currentPreDayTime.getDate();
    var currentPreMonth = currentPreDayTime.getMonth();
    var currentPreYear = currentPreDayTime.getFullYear();
    var currentPreDayDateTime = (parseInt((new Date(currentPreYear, currentPreMonth, currentPreDay).getTime()) / 1000));

    var currentParseStar = (parseInt((new Date(currentYear, currentMonth, currentDay).getTime())));
    var currentParseEnd = (parseInt((new Date(currentYear, currentMonth, currentDay).getTime() + 24 * 60 * 60 * 1000 - 1)));

    if (visitors === '') {
      wx.showToast({
        title: '请输入受访人姓名',
        icon: 'none',
        duration: 1500,
        mask: true
      })
      return false;
    } else if (visit_purpose === '') {
      wx.showToast({
        title: '请输入来访目的',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (entry_time < currentPreDayDateTime && leave_time < currentPreDayDateTime) {
      wx.showToast({
        title: '申请访问时间不能晚于当前日期',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (entry_time >= leave_time) {
      wx.showToast({
        title: '访问时间不能晚于离开时间',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (currentParseStar >= leave_time_one || leave_time_one >= currentParseEnd) {
      wx.showToast({
        title: '访问时间和离开时间需同一天',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (entry_leave_one < 1800000) {
      wx.showToast({
        title: '访问时间段至少30分钟',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    // console.log(e)
    var form_id = e.detail.formId; // 在开发工具中没有值，手机端会有值并且button要写在form标签内
    // console.log(form_id)
    that.testSubmit(form_id);
    that.visitors();
    return true;
  },

  // clickNext: function() {
  //   var that = this;
  //   if (that.formSubmit()) {
  //     that.visitors();
  //   }
  // },

  query_name: function (visit_name) {
    var that = this;
    var host = app.globalData.host;
    var data = {
      'name': visit_name
    }
    wx.request({
      url: host + '/api/query/name',
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (res.data.error_code === 0 && res.data.data.length != 0) {
            var name_array = res.data.data[0];
            console.log(name_array)
            if (that.data.visitors === name_array.real_name) {
              var interviewee_id = name_array.id;
              that.search_name(interviewee_id);
              that.setData({
                interviewee_id: interviewee_id,
                finish_suc: false,
                no_exist: false,
                border_bottom: '',
                exist: true,
              })
                console.log(that.data.interviewee_id);
            } else {
              that.setData({
                finish_suc: true,
                no_exist: true,
                border_bottom: 'none',
                exist: false,
                company: '',
                department: '',
                job: '',
              })
            }
          } else {
            that.setData({
              finish_suc: true,
              no_exist: true,
              border_bottom: 'none',
              exist: false,
              company: '',
              department: '',
              job: '',
            })
          }
        }
      },
      fail: function (res) {
        console.log(res);
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
    var data = {};
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
            setTimeout(function() {
              that.setData({
                job: visitor_info.title
              })
            }, 300) 
          }

        } else {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: '网络错误，请重试',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
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
            content: '网络错误，请重试',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
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
            that.setData({
              department: department,
            })
          }
        } else {
          console.log(res);
          wx.showModal({
            title: '提示',
            content: '网络错误，请重试',
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          content: '网络错误，请重试',
          showCancel: false
        })
      }
    })
  },

  visitors: function () {
    var that = this;
    var host = app.globalData.host;
    var create_on = parseInt(Date.now() / 1000);
    wx.showLoading({
      title: '保存中...',
      success: function () {
        that.setData({
          finish_suc: true,
          create_on: create_on
        })
      }
    })
   
    var data = {
      'interviewee_id': that.data.interviewee_id,
      'come_from': that.data.detailInfo.company,
      'department': that.data.detailInfo.department,
      'title': that.data.detailInfo.job,
      'purpose': that.data.visit_purpose,
      'entry_time': that.data.entry_time,
      'leave_time': that.data.leave_time,
      'created_on': create_on,
      'visit_status': 1,
      'visitor_id': 0,
      'reject_reason': '', // 不传会导致cms断掉
      'remark': '' // 不传会导致cms断掉
    }
    wx.request({
      url: host + '/api/event',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (respon) {
        console.log(respon);
        if (respon.statusCode === 200) {
          if (respon.data.error_code == 0) {
            wx.navigateTo({
              url: '../applySuccess/applySuccess?entry_time=' + that.data.entry_time,
              success: function () {
                setTimeout(function () {
                  that.setData({
                    finish_suc: false
                  })
                }, 800)
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
            content: respon.statusCode + ' ' + respon.errMsg,
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

  get_access_token: function () {
    var that = this;
    
  },

  testSubmit: function (form_id) {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5dd469c7c6d51aa6&secret=f5da142b301c9a03854b5688bc93e526',
      data: {},
      method: 'POST',
      success: function (res) {
        console.log(res)

        let openid = wx.getStorageSync('openId');
        let _access_token = res.data.access_token;
        let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
        let _jsonData = {
          access_token: _access_token,
          touser: openid,
          template_id: 'K3ZuKWE5ZQxIo6WB31wmsVxQyNgoNe_LCKxRL4hBKAM',
          form_id: form_id,
          page: "pages/index/index?entry_time=" + that.data.entry_time,
          data: {
            "keyword1": { "value": that.data.visitors, "color": "#173177" },
            "keyword2": { "value": that.data.detailInfo.company, "color": "#173177" },
            "keyword3": { "value": that.data.visit_purpose, "color": "#173177" },
            "keyword4": { "value": util.formatDateOne(that.data.entry_time * 1000) + '-' + util.formatDateTwo(that.data.leave_time * 1000), "color": "#173177" },
            "keyword5": { "value": '审核中', "color": "#173177" },
            "keyword6": { "value": util.formatDateOne(that.data.create_on * 1000), "color": "#173177" },
          }
        }
        wx.request({
          url: url,
          data: _jsonData,
          method: 'POST',
          success: function (res) {
            console.log(res)
          },
          fail: function (err) {
            console.log('request fail ', err);
          },
          complete: function (res) {
            console.log("request completed!");
          }

        })
      }
    })
   
  },

  changeDate(e) {
    this.setData({
      date: e.detail.value
    }); 
  },

  changeTime(e) {
    this.setData({
      time: e.detail.value
    });
  },

  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    });
  },

  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },

  changeDateTimeColumn(e) {
    var that = this;
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },

  changeDateTimeColumn1(e) {
    var that = this;
    console.log(e);
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
  
    arr[e.detail.column] = e.detail.value;
    var arrBind = []; //联动数据处理
    console.log(arrBind);
    console.log("arrBind-1");
    arr.forEach((element, index)=>{
      if (index == 3) {
        element = element + 1;
      }
      console.log(element);
      arrBind.push(element);
    })
    console.log(arrBind);
    console.log("arrBind");
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,

      dateTimeArray2: dateArr,
      dateTime2: arrBind,
    });
    var mark = '/';
    var dataTimeNewTwo = this.data.dateTimeArray1[0][this.data.dateTime1[0]] + mark + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + mark  + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + " " + this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ":" + this.data.dateTimeArray1[4][this.data.dateTime1[4]];

    var dataTimeNewTwo2 = this.data.dateTimeArray2[0][this.data.dateTime2[0]] + mark + this.data.dateTimeArray2[1][this.data.dateTime2[1]] + mark  + this.data.dateTimeArray2[2][this.data.dateTime2[2]] + " " + this.data.dateTimeArray2[3][this.data.dateTime2[3]] + ":" + this.data.dateTimeArray2[4][this.data.dateTime2[4]];

    var dateBindChange = new Date(dataTimeNewTwo).getTime(); // 有ios兼容性，换成 2018/06/06 格式的
    var dateLastest = util.formatDate(dateBindChange);

    var dateBindChange2 = new Date(dataTimeNewTwo2).getTime();
    var dateLastest2 = util.formatDate(dateBindChange2);

    this.setData({
      dateTimeNew: dateBindChange,
      dateTimeNewLeave: dateBindChange2
    })
  },

  changeDateTime2(e) {
    this.setData({
      dateTime2: e.detail.value
    });
  },

  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2,
      dateArr = this.data.dateTimeArray2;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr,
    });
    var mark = '/';
    var dataTimeNewTwo = this.data.dateTimeArray2[0][this.data.dateTime2[0]] + mark + this.data.dateTimeArray2[1][this.data.dateTime2[1]] + mark + this.data.dateTimeArray2[2][this.data.dateTime2[2]] + " " + this.data.dateTimeArray2[3][this.data.dateTime2[3]] + ":" + this.data.dateTimeArray2[4][this.data.dateTime2[4]];
    console.log(dataTimeNewTwo);

    var dateBindChange =new Date(dataTimeNewTwo).getTime();
    var dateLastest = util.formatDate(dateBindChange);
    this.setData({
      dateTimeNewLeave: dateBindChange
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