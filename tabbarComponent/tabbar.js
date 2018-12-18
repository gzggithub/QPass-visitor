// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
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
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
