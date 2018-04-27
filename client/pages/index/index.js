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
        replyPage: 1,
        moreReply: true,

        dataNewPublish: null,
        publishPage: 1,

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
                    pageSize: '20',
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
                    pageSize: '20',
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

    // 加载更多
    onReachBottom: function () {

        var that = this
        var tabId = that.data.selectedTab

        if ( tabId == 3 ) {
            // 今日热门没有更多
            return
        }

        if (isBottomFuncRunning) {
            wx.showToast({
                title: '拼命加载中。',
                icon: 'none',
                duration: 800
            })
            return
        }
        isBottomFuncRunning = true

        if ( tabId == 1 ) {
            // 加载更多最新回复的数据
            var nextPage = that.data.replyPage + 1;
            wx.request({
                url: app.globalData.url,
                method: 'POST',
                data: {
                    r: 'forum/topiclist',
                    accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                    accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                    page: nextPage,
                    pageSize: '20',
                    sortby: 'all',
                    // filterType: 'sortid',
                    // topOrder: '0'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {

                    console.log(res.data.list)

                    // 处理返回的数据
                    var newList = utils.unique(that.data.dataNewReply.concat(res.data.list))

                    that.setData({
                        display: true,
                        replyPage: nextPage,
                        dataNewReply: newList
                    })
                }
            })
        } else if (tabId == 2) {
            // 加载更多最新发表的数据
            var nextPage = that.data.publishPage + 1;
            wx.request({
                url: app.globalData.url,
                method: 'POST',
                data: {
                    r: 'forum/topiclist',
                    accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                    accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                    page: nextPage,
                    pageSize: '20',
                    sortby: 'publish',
                    // filterType: 'sortid',
                    // topOrder: '0'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {

                    console.log(res.data.list)

                    // 处理返回的数据
                    var newList = utils.unique(that.data.dataNewPublish.concat(res.data.list))

                    that.setData({
                        display: true,
                        publishPage: nextPage,
                        dataNewPublish: newList
                    })
                }
            })
        }

        // 5 秒内只能请求一次
        setTimeout(() => {
            isBottomFuncRunning = false
        }, 5000);
    },

    // 生命周期函数
    onLoad: function () {
        wx.startPullDownRefresh()
    }
})
