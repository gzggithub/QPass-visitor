// pages/apply/newApply/newApply.js
const app = getApp();
const util = require('../../utils/util.js');
const upng = require('../../utils/UPNG.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageInfo: '18',
    face_image: '../../image/group_13.png',
    face_copy: '',
    apply_start: true,
    apply_start_first: true,
    apply_next: false,
    no_net_recognition_suc: false,
    no_recognition_suc: false,
    recognition_suc: false,
    recognition_suc_next_rest: false,
    recognition_suc_next: false,
    apply_restart_suc: false,
    restart_recognition_suc_one: false,
    apply_restart: false,
    apply_clear_restart: false,
    image_size: false,
    image_size_canvas: false,
    hiddenmodalput: true,
    canvasWidth: 0,
    canvasHeight: 0,
    canvasOneWidth: 0,
    canvasOneHeight: 0,
    imgHeight: 0,
    opacity: 0,
    example_opacity: 1,
    token: '',
    getUsers: false,
    getUsersOne: false,
    hasUserInfo: false,
    disabled: false,
    start: true,
    winHeight: app.globalData.windowHeight,
    example_width: 273,
    imageTempPath: '',
    img: '',
    platform: wx.getSystemInfoSync().platform
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("newApply--onload--");

    if (wx.getStorageSync('hasLogin')) {
      app.globalData.hasLogin = wx.getStorageSync('hasLogin');
    } else {
      setTimeout(function () {
        if (app.globalData.hasLogin === false) { // 判断是否登录
          console.log("apply-- if login --11");
          wx.showModal({
            title: '提示',
            content: '请先登录，谢谢',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../mine/mine?origin=2',
                })
              }
            }
          });
        }
      }, 800);
    }
    
    if (app.globalData.hasLogin === true) {
      that.getUsers();
    }
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
          if (res.data.status === 1) {
            var status = res.data.status;
            var face_token_path = host + '/' + res.data.user_id + '/' + res.data.face_token_1 + '.jpg';
            var face_token_path_copy = res.data.face_token_1;
            var real_name = res.data.real_name;
            console.log(res.data.birthday)
            var birthday = util.formatDate(res.data.birthday * 1000);
            var gender = res.data.gender;
            var IdCard = res.data.id_number;
            var phone_number = res.data.phone_number;
            var email = res.data.email;
            app.globalData.status = status;
            app.globalData.face_image = face_token_path;
            app.globalData.face_copy = face_token_path_copy;
            wx.setStorageSync('status', status);
            wx.setStorageSync('face', face_token_path);
            wx.setStorageSync('real_name', real_name);
            wx.setStorageSync('gender', gender);
            wx.setStorageSync('birthday', birthday);
            wx.setStorageSync('IdCard', IdCard);
            wx.setStorageSync('phone_number', phone_number);
            wx.setStorageSync('email', email);
            console.log("3232");
            console.log(face_token_path);

            that.setData({
              example_width: 100,
              face_image: face_token_path,
              face_copy: face_token_path_copy,
              recognition_suc_next_rest: true,
              restart_recognition_suc_one: true,
              apply_restart: true,
              apply_start_first: false,
              example_opacity: 0,
              opacity: 0,
              start: true,
            })
            wx.hideLoading();
          } else {
            that.setData({
              face_image: '../../image/group_13.png',
              recognition_suc_next_rest: false,
              apply_restart: false,
              apply_start_first: true,
              example_opacity: 1,
              start: false
            })
            wx.hideLoading();
          } 
        } else {
          var content = res.errMsg;
          that.commonFailDeal(content);
        }
      },
      fail: function (res) {
        console.log(res);
        var content = res.errMsg + '重试';
        that.commonFailDeal(content);
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
    wx.hideLoading();
  },

  confirmEvent: function () {
    var that = this;
    that.setData({
      getUsers: false
    })
  },

  confirmM: function (e) {
    var that = this;
    that.setData({
      hiddenmodalput: true
    })
    that.imageDeal();
  },

  clickNextRest: function () {
    var that = this;
    that.setData({
      disabled: true
    })
    var change = true;
    that.sucNavigateToRest(change);
  },

  sucNavigateToRest: function (change) {
    var that = this;
    wx.navigateTo({ // 成功，点击下一步，保存、更新成功后跳转
      url: '../newApply/identityInformation/identityInformation?face_copy=' + that.data.face_copy + '&change=' + change,
      success: function () {
        setTimeout(function () {
          that.buttonDisabled();
        }, 500)
      }
    });
  },

  clickstart: function () { // start button
    var that = this;
    that.setData({
      hiddenmodalput: false
    })
  },

  clickrestart: function () {
    var that = this;
    var ctx = wx.createCanvasContext('myFirstCanvas');
    ctx.clearRect(0, 0, 100, 100);
    ctx.draw();

    that.setData({
      imageTempPath: '',
      opacity: 0,
      no_net_recognition_suc: false,
      no_recognition_suc: false,
      recognition_suc: false
    })

    that.imageDeal();
  },

  imageDeal: function () { //chooseImage
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilesSize = res.tempFiles[0].size; //获取图片的大小，单位B 
        var tempFilePaths = res.tempFilePaths[0];
        if (tempFilesSize < 8192) {
          wx.showModal({
            title: '提示',
            content: '图片太小，请重拍',
            showCancel: false,
            success: function (resf) {
              if (resf.confirm) {
                that.setData({
                  restart_recognition_suc_one: true
                })
              }
            }
          })
        } else if (tempFilesSize > 8192 && tempFilesSize <= 2097152) { //图片小于或者等于2M时 可以执行获取图片
          that.setData({
            image_size: true,
            image_size_canvas: false,
            face_image: tempFilePaths,
            imgHeight: 100
          })
          that.commonImage(tempFilePaths);
        } else { //图片大于2M，弹出一个提示框，压缩图片 
          wx.showLoading({
            title: 'loading',
          })
          that.setData({
            image_size: false,
            image_size_canvas: true,
          })
          that.imgInfo(tempFilePaths);
        }
        that.setData({
          apply_start: false,
          apply_next: true,
        });
      }
    });
  },

  imgInfo: function (tempFilePaths) { // compressImage
    var that = this;
    var path = tempFilePaths;
    wx.getImageInfo({
      src: path,
      success: function (resIm) {
        console.log(resIm);
        // copy
        var picWOne = resIm.width;
        var picHOne = resIm.height;
        var imgRateOne = 1;

        if (picWOne / picHOne > 1.339) {
          imgRateOne = app.globalData.windowWeight * 2 / picWOne;
        } else {
          imgRateOne = 280 * 2 / picHOne;
        }
        picWOne = Math.trunc(resIm.width * imgRateOne);
        picHOne = Math.trunc(resIm.height * imgRateOne);
        that.setData({
          canvasOneWidth: picWOne,
          canvasOneHeight: picHOne
        })

        var contextOne = wx.createCanvasContext('myCanvasCopy');
        contextOne.drawImage(path, 0, 0, picWOne, picHOne);
        contextOne.draw(false, function () {
          if (that.data.platform === 'ios') {
            that.canvasToTempFilePaths();
          } else {
            setTimeout(function () {
              that.canvasToTempFilePaths();
            }, 800)
          }
        });

        var picW = resIm.width;
        var picH = resIm.height;

        var imgRate = 1;
        if (picW / picH > 1.339) {
          imgRate = app.globalData.windowWeight / picW;
        } else {
          imgRate = 280 / picH;
        }
        console.log("Rate -- " + imgRate);
        picW = Math.trunc(resIm.width * imgRate);
        picH = Math.trunc(resIm.height * imgRate);
        that.setData({
          canvasWidth: picW,
          canvasHeight: picH
        }) //设置canvas尺寸

        var context = wx.createCanvasContext('myCanvas');
        context.drawImage(path, 0, 0, picW, picH);
        context.draw(false, function () {
          if (that.data.platform === 'ios') {
            that.canvasToTempFilePaths();
          } else {
            setTimeout(function () {
              that.canvasToTempFilePaths();
            }, 800)
          }
        });
      },
      fail: function (res) {
        wx.hideLoading();
        that.notNetWorkDeal();
      }
    })
  },

  canvasToTempFilePaths: function () { // get image's temporary path after compressing Image
    var that = this;
    wx.canvasToTempFilePath({
      fileType: 'jpg',
      quality: 0.6,
      canvasId: 'myCanvasCopy',
      success: function (resPath) { // 获得图片临时路径
        var tempFilePaths = resPath.tempFilePath;
        that.commonImage(tempFilePaths);
      }
    })
  },

  commonImage: function (tempFilePaths) {
    var that = this;
    var tempFilePaths = tempFilePaths;
    that.imageInfo(tempFilePaths);
  },

  imageInfo: function (tempFilePaths) {
    var that = this;
    var tempFilePaths = tempFilePaths;
    wx.getImageInfo({
      src: tempFilePaths,
      success(img) {
        console.log(img);
        var img = img;
        that.base64Image(tempFilePaths, img)
      },
      fail: function (img) {
        wx.hideLoading();
        that.notNetWorkDeal();
      }
    })
  },

  notNetWorkDeal: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请连接网络，重试',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.notNetDealDetail();
        }
      }
    })
  },

  notNetDealDetail: function () {
    var that = this;
    that.setData({
      face_image: '../../image/group_13.png',
      no_net_recognition_suc: false,
      no_recognition_suc: false,
      recognition_suc: false,
      apply_start: true,
      apply_next: false,
      recognition_suc_next: false,
      apply_restart_suc: true,
      restart_recognition_suc_one: false,
      apply_restart: false,
      apply_clear_restart: false,
      disabled: false,
      opacity: 0
    })
  },

  requestTimeoutDeal: function () { // timeout deal
    var that = this;
    that.setData({
      no_net_recognition_suc: true,
      no_recognition_suc: false,
      recognition_suc: false,
      apply_start: false,
      recognition_suc_next: false,
      restart_recognition_suc_one: true,
      apply_restart: false,
      apply_clear_restart: true
    })
  },

  base64Image: function (tempFilePaths, img) {
    var that = this;
    var tempFilePaths = tempFilePaths;
    var img = img;
    wx.getFileSystemManager().readFile({ //只能转本地图片为base64
      filePath: tempFilePaths, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: function (res) { //成功的回调
        // console.log('data:image/png;base64,' + res.data);
        console.log("temp -- ");
        var temp = res.data;
        console.log(that.data.token)
        // that.reverseImgData(resTemp)
        that.detectNetwork(temp, tempFilePaths, img);
      }
    })
  },

  detectNetwork: function (temp, tempFilePaths, img) {
    var that = this;
    var temp = temp;
    var tempFilePaths = tempFilePaths;
    var img = img;
    wx.getNetworkType({
      success: function (net) {
        console.log(net.networkType);
        if (net.networkType == 'none') {
          wx.showToast({
            title: '网络未连接',
            duration: 2000
          })
        } else {
          wx.showLoading({
            title: '检测中...',
          })
          that.detectFace(temp, tempFilePaths, img)
        }
      }
    })
  },

  detectFace: function (temp, tempFilePaths, img) {
    var that = this;
    var host = app.globalData.host;
    wx.request({
      url: host + '/api/detectFace',
      method: 'POST',
      data: {
        'image': temp,
        'image_type': 'BASE64',
        'face_type': '',
        'max_face_num': '',
        'face_field': '',
        'group_id_list': 'TEST_3',
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (resData) {
        if (resData.statusCode === 200) {
          if (resData.data.result != null && resData.data.error_code === 0) {
            var ctx = wx.createCanvasContext('myFirstCanvas');
            var ctxSe = wx.createCanvasContext('mySecondCanvas');
            var location = resData.data.result.face_list[0].location;
            var x = 0;
            var y = 0;
            var width = 0;
            var height = 0;
            if (that.data.platform === 'ios') {
              ctxSe.drawImage(tempFilePaths, (location.left - 30), (location.top - 30), (location.width + 60), (location.height + 60), 0, 0, (location.width + 60), (location.height + 60));
              ctxSe.draw(false, () => {
                x = 0;
                y = 0;
                width = (location.width + 60);
                height = (location.height + 60);
                that.canvasGetBase64Data(x, y, width, height);
              })
            } else {
              ctxSe.drawImage(tempFilePaths, 0, 0, img.width, img.height);
              ctxSe.draw(false, () => {
                x = (location.left - 30);
                y = (location.top - 30);
                width = (location.width + 60);
                height = (location.height + 60)
                setTimeout(function () {
                  that.canvasGetBase64Data(x, y, width, height);
                }, 800)
              })
            }
          } else if (resData.data.error_code === 222202) {
            wx.hideLoading();
            that.setData({ //未识别到人脸
              no_net_recognition_suc: false,
              no_recognition_suc: true,
              recognition_suc: false,
              apply_start: false,
              recognition_suc_next: false,
              restart_recognition_suc_one: true,
              restart_recognition_suc_two: true,
              apply_restart: false,
              apply_clear_restart: true
            })
          } else if (resData.data.error_code === 14) {
            wx.hideLoading();
            wx.showModal({
              title: '错误提示',
              content: resData.data.error_msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    apply_restart_suc: true,
                    restart_recognition_suc_one: true,
                    apply_clear_restart: true
                  })
                }
              }
            })
          } else {
            wx.hideLoading();
            wx.showModal({
              title: '错误提示',
              content: resData.data.error_msg + ',请重试',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    restart_recognition_suc_one: true
                  })
                }
              }
            })
          }
        } else if (resData.statusCode === 502) {
          wx.hideLoading();
          wx.showModal({
            title: '错误提示',
            content: resData.data.message + ',请重试！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) { }
            }
          })
          that.setData({
            apply_start: true,
            apply_next: false,
            no_net_recognition_suc: false,
            no_recognition_suc: false,
            recognition_suc: false,
            apply_restart_suc: false,
            restart_recognition_suc_one: false,
            apply_restart: false,
            apply_clear_restart: false
          })
        } else if (resData.statusCode === 403) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: resData.data.message,
            showCancel: false,
            success: function (res) {
              console.log(res)
              if (res.confirm) {
                that.setData({
                  getUsers: true,
                  face_image: "../../image/group_13.png",
                  apply_start: true,
                  apply_next: false,
                  no_net_recognition_suc: false,
                  no_recognition_suc: false,
                  recognition_suc: false,
                  recognition_suc_next: false,
                  apply_restart_suc: false,
                  restart_recognition_suc_one: false,
                  recognition_suc_next: false,
                  apply_restart: false,
                  apply_clear_restart: false
                })
              }
            }
          })
        } else if (resData.statusCode === 413) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: resData.statusCode + ' ' + resData.errMsg,
            showCancel: false,
            success: function (res) {
              console.log(res)
              if (res.confirm) {
                that.setData({
                  face_image: "../../image/group_13.png",
                  apply_start: true,
                  apply_next: false,
                  no_net_recognition_suc: false,
                  no_recognition_suc: false,
                  recognition_suc: false,
                  recognition_suc_next: false,
                  restart_recognition_suc_one: false,
                  apply_restart: false
                })
              }
            }
          })
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: resData.statusCode + ' ' + resData.errMsg,
            showCancel: false,
            success: function (res) {
              console.log(res)
              if (res.confirm) {
                that.setData({
                  face_image: '../../image/group_13.png',
                  apply_start: true,
                  apply_next: false,
                  recognition_suc_next: false,
                  restart_recognition_suc_one: false
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res);
        wx.showModal({
          title: '错误提示',
          content: res.errMsg + ',请重试',
          showCancel: false,
          success: function (t) {
            that.setData({
              no_net_recognition_suc: true,
              no_recognition_suc: false,
              recognition_suc: false,
              apply_start: false,
              recognition_suc_next: false,
              apply_restart_suc: true,
              restart_recognition_suc_one: true,
              apply_clear_restart: true,
            })
          }
        })
      }
    })
  },

  canvasGetBase64Data: function (x, y, width, height) {
    var that = this;
    console.log(location);
    wx.canvasGetImageData({ // 2. 获取图像数据， API 1.9.0
      canvasId: 'mySecondCanvas',
      x: x,
      y: y,
      width: width,
      height: height,
      success(resTemp) {
        console.log(resTemp)
        if (app.globalData.deviceOrientation != 'portrait' && that.data.platform === 'ios') {
          resTemp = that.reverseImgData(resTemp); // 兼容处理：ios获取的图片上下颠倒
        }
        var pngData = upng.encode([resTemp.data.buffer], resTemp.width, resTemp.height); // 3. png编码
        var base64 = wx.arrayBufferToBase64(pngData); // 4. base64编码
        app.globalData.temp = base64;
        let tempImg = 'data:image/png;base64,' + base64;
        that.setData({ // 此处渲染数据特别慢，有问题
          opacity: 1,
          imageTempPath: tempImg
        })
        that.detectFaceSuc();
        wx.hideLoading();
      }
    })

  },

  detectFaceSuc: function () {
    var that = this;
    that.setData({ // crash 掉了
      no_net_recognition_suc: false,
      no_recognition_suc: false,
      recognition_suc_next_rest: false,
      apply_start_first: false,
      recognition_suc_next: true,
      recognition_suc: true,
      restart_recognition_suc_one: true,
      apply_restart: true,
      apply_restart_suc: true,
      apply_clear_restart: false,
      apply_show: true,
      pageInfo: '33',
      disabled: false
    })
  },

  //ios图片处理
  reverseImgData(res) {
    var w = res.width
    var h = res.height
    let con = 0
    for (var i = 0; i < h / 2; i++) {
      for (var j = 0; j < w * 4; j++) {
        con = res.data[i * w * 4 + j]
        res.data[i * w * 4 + j] = res.data[(h - i - 1) * w * 4 + j]
        res.data[(h - i - 1) * w * 4 + j] = con
      }
    }
    return res;
  },

  clickNext: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...'
    })
    that.setData({
      disabled: true
    })
    that.addFace();
  },

  addFace: function () {
    var that = this;
    var temp = app.globalData.temp;
    var host = app.globalData.host;
    wx.request({
      url: host + '/api/addFace',
      method: 'POST',
      data: {
        "image": temp,
        "image_type": "BASE64",
        "user_info": that.data.realName // 名字没有输入呢
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (response) {
        if (response.statusCode === 200) {
          if (response.data.error_code === 0) {
            app.globalData.face_token = response.data.result.face_token;
            wx.hideLoading();
            that.sucNavigateTo();
          } else if (response.data.error_code === 223105) {
            wx.hideLoading();
            var content = '人脸已存在，请重拍';
            that.commonTip(content);
          } else if (response.data.error_code === 222202) {
            wx.hideLoading();
            that.noFace();
          } else if (response.data.error_code === 222210) {
            wx.hideLoading();
            var content = '照片数超限制';
            that.commonTip(content);
          } else if (response.data.error_code === null || response.data.curl_error_code === 6) {
            wx.hideLoading();
            that.requesrOk_error(response);
          } else {
            wx.hideLoading();
            that.requesrOk_error(response);
          }
        } else {
          wx.hideLoading();
          var content = response.statusCode + response.errMsg + '请稍后重试';
          that.commonTip(content);
        }
      },
      fail: function (response) {
        console.log(response);
        wx.hideLoading();
        that.requestFailDeal(response);
      }
    })
  },

  sucNavigateTo: function () {
    var that = this;
    wx.navigateTo({ // 成功，点击下一步，保存、更新成功后跳转
      url: '../newApply/identityInformation/identityInformation',
      success: function () {
        setTimeout(function () {
          that.buttonDisabled();
        }, 500)
      }
    });
  },

  commonTip: function (content) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.buttonDisabled();
        }
      }
    })
  },

  buttonDisabled: function () {
    var that = this;
    that.setData({
      disabled: false
    })
  },

  noFace: function () {
    var that = this;
    that.setData({ //未识别到人脸
      no_net_recognition_suc: false,
      no_recognition_suc: true,
      recognition_suc: false,
      apply_restart_suc: true,
      restart_recognition_suc_one: true,
      restart_recognition_suc_two: true,
      apply_start: false,
      recognition_suc_next: false,
      apply_restart: false,
      apply_clear_restart: true,
      disabled: false,
      opacity: 0
    })
  },

  requesrOk_error: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '网络错误请稍后重试',
      showCancel: false,
    })
    that.rephoto();
  },

  rephoto: function () { //  重拍
    var that = this;
    that.setData({
      no_net_recognition_suc: false,
      no_recognition_suc: false,
      recognition_suc: false,
      apply_start: false,
      recognition_suc_next: false,
      apply_restart_suc: true,
      restart_recognition_suc_one: true,
      apply_restart: false,
      apply_clear_restart: true,
      disabled: false
    })
  },

  requestFailDeal: function (response) {
    var that = this;
    wx.showModal({
      title: "错误提示",
      content: response.errMsg + '请重试',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.requestFailDealDetail();
        }
      }
    })
  },

  requestFailDealDetail: function () {
    var that = this;
    that.setData({
      no_net_recognition_suc: true,
      no_recognition_suc: false,
      recognition_suc: false,
      apply_start: false,
      recognition_suc_next: false,
      apply_restart_suc: true,
      restart_recognition_suc_one: true,
      apply_clear_restart: true,
      disabled: false
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
    wx.stopPullDownRefresh(); // 放到最后
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
  },
})