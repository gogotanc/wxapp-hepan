// my.js 用于展示用户收藏、评论、发布过的主题列表
const util = require('../../utils/util')
const app = getApp()

// bottom func 运行的标志，防止多次触发底部函数
var bottomRunning = false

Page({
    data: {
        loading: true,
        type: null,
        page: 1,
        hasNext: true,
        list: []
    },

    viewDetail: function (e) {
        console.log(e)
        var topicId = e.currentTarget.dataset.topicid

        wx.navigateTo({
            url: '../detail/detail?topicId=' + topicId
        })
    },

    // 下拉刷新获取所有版块的数据
    onPullDownRefresh: function() {
        var that = this
        wx.request({
            url: app.globalData.url,
            method: 'POST',
            data: {
                r: 'user/topiclist',
                type: that.data.type,
                uid: app.globalData.userInfo.uid,
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                page: 1,
                pageSize: 20,
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
                    page: 1,
                    hasNext: res.data.has_next,
                    list: res.data.list
                })
            }
        })
    },

    // 触底加载更多
    onReachBottom: function () {
        var that = this

        // 没有内容了
        if (!that.data.hasNext) {
            wx.showToast({
                title: '已经到底咯。',
                icon: 'none',
                duration: 1500
            })
            return
        }

        // 防止多次触发
        if (bottomRunning == true) {
            wx.showToast({
                title: '加载中。。。',
                icon: 'none',
                duration: 800
            })
            return
        }
        bottomRunning = true

        var currentPage = that.data.page
        var nextPage = currentPage + 1
        wx.request({
            url: app.globalData.url,
            method: 'POST',
            data: {
                r: 'user/topiclist',
                type: that.data.type,
                uid: app.globalData.userInfo.uid,
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                page: nextPage,
                pageSize: 20,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res)

                // 请求出错的处理
                if (res.data.rs == 0) {
                    wx.stopPullDownRefresh()
                    wx.showToast({
                        title: res.data.errcode,
                        icon: 'none',
                        duration: 1400,
                        mask: true,
                        success: () => { }
                    });
                    return
                }

                // 添加新获取的数据
                var newList = that.data.list.concat(res.data.list)

                wx.stopPullDownRefresh()
                that.setData({
                    loading: false,
                    page: nextPage,
                    hasNext: res.data.has_next,
                    list: util.unique(newList)
                })
            }
        })

        setTimeout(function(){
            bottomRunning = false
        }, 3000)
    },

    // 页面加载
    onLoad: function (options) {
        console.log(options)
        this.setData({
            type: options.type
        })

        // 设置窗口标题
        var title = '清水河畔'
        var type = options.type
        if (type == 'topic') {
            title = '发表的主题'
        } else if (type == 'favorite') {
            title = '收藏的主题'
        } else if (type == 'reply') {
            title = '评论过的主题'
        }
        wx.setNavigationBarTitle({
            title: title
        })

        // 下拉刷新获取数据
        wx.startPullDownRefresh()
    }
})