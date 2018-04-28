// forum.js
const util = require('../../utils/util')
const app = getApp()

Page({
    data: {
        loading: true,
        list: []
    },

    // 进入某个版块
    viewList: function (e) {
        var board_id = e.currentTarget.dataset.id
        var board_name = e.currentTarget.dataset.name
        wx.navigateTo({
            url: '../list/list?id=' + board_id + '&name=' + board_name,
        })
    },

    // 下拉刷新获取所有版块的数据
    onPullDownRefresh: function() {
        var that = this
        wx.request({
            url: app.globalData.url,
            method: 'POST',
            data: {
                r: 'forum/forumlist',
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {

                console.log(res.data)

                // 请求出错的处理
                if (res.data.rs == 0) {
                    wx.stopPullDownRefresh() 
                    wx.showToast({
                        title: res.data.errcode,
                        icon: 'none',
                        duration: 2000,
                        mask: true,
                        success: () => {}
                    });
                    return
                }

                wx.stopPullDownRefresh()
                that.setData({
                    loading: false,
                    list: res.data.list
                })
            }
        })
    },

    // 生命周期函数
    onLoad: function (options) {
        wx.startPullDownRefresh()
    }
})
