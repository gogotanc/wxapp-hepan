//index.js
const app = getApp()
const req = require('../../utils/request')
const utils = require('../../utils/util')

// 防止多次提示已经到底了
var isBottomFuncRunning = false

Page({
    data: {
        display: false,
        // 1: 最新回复 2: 最近发表 3: 今日热门
        selectedTab: 1,

        dataNewReply: null,
        dataNewPublish: null,
        dataHot: null,
    },

    // 分享
    onShareAppMessage: function (res) {
        return {
            title: '清水河畔小程序 - 水水更健康',
            path: '/pages/index/index'
        }
    },

    // tab 点击事件处理
    tapTab: function (e) {
        var that = this
        var tabId = e.currentTarget.dataset.tabid
        var current = that.data.selectedTab

        if (tabId == current) {
            return
        }

        that.setData({
            selectedTab: tabId
        })

        if (tabId == 1 && that.data.dataNewReply == null) {
            wx.startPullDownRefresh()
        } else if (tabId == 2 && that.data.dataNewPublish == null) {
            wx.startPullDownRefresh()
        } else if (tabId == 3 && that.data.dataHot == null) {
            wx.startPullDownRefresh()
        }
    },

    // 跳转到帖子详情页面
    viewDetail: function (e) {
        var topicId = e.currentTarget.dataset.topicid
        wx.navigateTo({
            url: '../detail/detail?topicId=' + topicId
        })
    },

    // 下拉刷新事件
    onPullDownRefresh: function() {
        var that = this
        var tabId = that.data.selectedTab

        if ( typeof tabId === 'undefined' || tabId == 1 ) {
            // 刷新最新回复的数据
            wx.request({
                url: app.globalData.url,
                method: 'POST',
                data: {
                    r: 'forum/topiclist',
                    accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                    accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                    page: '1',
                    pageSize: '30',
                    sortby: 'all',
                    // filterType: 'sortid',
                    // topOrder: '0'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    wx.stopPullDownRefresh()
                    that.setData({
                        display: true,
                        dataNewReply: res.data.list
                    })
                }
            })
        } else if (tabId == 2) {
            // 刷新最新发表的数据
            wx.request({
                url: app.globalData.url,
                method: 'POST',
                data: {
                    r: 'forum/topiclist',
                    accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                    accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                    page: '1',
                    pageSize: '30',
                    sortby: 'publish',
                    // filterType: 'sortid',
                    // topOrder: '0'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    wx.stopPullDownRefresh()
                    that.setData({
                        display: true,
                        dataNewPublish: res.data.list
                    })
                }
            })
        } else if (tabId == 3) {
            // 刷新今日热门的数据
            wx.request({
                url: app.globalData.url,
                method: 'POST',
                data: {
                    r: 'portal/newslist',
                    accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                    accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                    moduleId: '2'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    wx.stopPullDownRefresh()
                    that.setData({
                        display: true,
                        dataHot: res.data.list
                    })
                }
            })
        } else {
            wx.stopPullDownRefresh()
        }
    },

    // 触底触发的函数，提示已经到底了
    onReachBottom: function () {

        if (isBottomFuncRunning) {
            return
        }
        isBottomFuncRunning = true

        wx.showToast({
            title: '已经到底咯。',
            icon: 'none',
            duration: 1000
        })

        setTimeout(() => {
            isBottomFuncRunning = false
        }, 5000);
    },

    // 生命周期函数
    onLoad: function () {
        wx.startPullDownRefresh()
    }
})
