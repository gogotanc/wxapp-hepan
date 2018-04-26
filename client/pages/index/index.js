//index.js
const app = getApp()
const req = require('../../utils/request')
const utils = require('../../utils/util')

// bottom func 运行的标志，防止多次触发底部函数
var bottomRunning = false

Page({
    data: {
        display: false,
        page: 1,
        dataNewReply: null,
        dataNewPublish: null,
        dataHot: null,
        isBottom: false,
        selectedTab: 1
    },

    // 分享
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '清水河畔小程序',
            path: '/pages/index/index',
            imageUrl: '../../images/paper.png'
        }
    },

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
        console.log(e)
        var topicId = e.currentTarget.dataset.topicid
        console.log(topicId)
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
            console.log(tabId)
            wx.request({
                url: app.globalData.url,
                method: 'POST',
                data: {
                    r: 'forum/topiclist',
                    accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                    accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                    // page: that.data.page,
                    // pageSize: '30',
                    sortby: 'all',
                    // filterType: 'sortid',
                    // topOrder: '0'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    console.log(res.data.list)
                    wx.stopPullDownRefresh()
                    that.setData({
                        display: true,
                        page: 1,
                        dataNewReply: res.data.list,
                        isBottom: false
                    })
                }
            })
        } else if (tabId == 2) {
            // 刷新最新发表的数据
            console.log(tabId)
            wx.request({
                url: app.globalData.url,
                method: 'POST',
                data: {
                    r: 'forum/topiclist',
                    accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                    accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                    // page: that.data.page,
                    // pageSize: '30',
                    sortby: 'publish',
                    // filterType: 'sortid',
                    // topOrder: '0'
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                    console.log(res.data.list)
                    wx.stopPullDownRefresh()
                    that.setData({
                        display: true,
                        page: 1,
                        dataNewPublish: res.data.list,
                        isBottom: false
                    })
                }
            })
        } else if (tabId == 3) {
            // 刷新今日热门的数据
            console.log(tabId)
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
                    console.log(res.data.list)
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

    // 上拉触底
    onReachBottom: function () {

        if (bottomRunning == true) {
            return
        }

        bottomRunning = true
        var that = this

        console.log('bottom func')

        this.setData({ isBottom: true })

        setTimeout(function(){
            bottomRunning = false
        },5000)
    },

    // 上拉触底
    //onReachBottom: function () {
    //    console.log('bottom')

    //    var that = this
    //    wx.request({
    //        url: 'http://bbs.uestc.edu.cn/mobcent/app/web/index.php',
    //        data: {
    //            r: 'forum/topiclist',
    //            accessToken: '365e95784d1318463aaf3fd7f5410',
    //            accessSecret: 'e058901c9e9a88526673a00d5f89b',
    //            page: that.data.page,
    //            pageSize: '10',
    //            sortBy: 'new',
    //            filterType: 'sortid',
    //            topOrder: '0'
    //        },
    //        header: {
    //            'content-type': 'application/x-www-form-urlencoded'
    //        },
    //        success: function(res) {
    //            var list = that.data.dataNew
    //            var newList = list.concat(res.data.list)
    //            var uniqueList = utils.unique(newList)
    //            console.log(uniqueList)
    //            var page = that.data.page + 1
    //            that.setData({
    //                page: page,
    //                dataNew: uniqueList
    //            })
    //        }
    //    })
    //},

    // 生命周期函数
    onLoad: function () {
        wx.startPullDownRefresh()
    }
})
