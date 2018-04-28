// list.js
const util = require('../../utils/util')
const app = getApp()

// bottom func 运行的标志，防止多次触发底部函数
var bottomRunning = false

Page({
    /**
     * 某版块信息
     * info {
     *   title: '',
     *   icon: '',
     *   topicList: []
     * }
     */
    data: {
        loading: true,
        board_id: null,
        page: 1,
        hasNext: true,
        info: {}
    },

    // 处理请求返回的数据
    dealData: function (res) {
        var data = res.data
        var info = {
            title: data.forumInfo.title,
            icon: data.forumInfo.icon,
            topicList: data.list
        }
        return info
    },

    // 帖子详情
    viewDetail: function (e) {
        var topic_id = e.currentTarget.dataset.topicid
        wx.navigateTo({
            url: '../detail/detail?topicId=' + topic_id,
        })
    },

    // 下拉刷新获取所有版块的数据
    onPullDownRefresh: function() {
        var that = this
        wx.request({
            url: app.globalData.url,
            method: 'POST',
            data: {
                r: 'forum/topiclist',
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                page: 1,
                pageSize: 20,
                boardId: that.data.board_id
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

                // 处理数据
                var result = that.dealData(res)

                console.log(result)

                wx.stopPullDownRefresh()
                that.setData({
                    loading: false,
                    page: 1,
                    hasNext: true,
                    info: result
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
                r: 'forum/topiclist',
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                page: nextPage,
                pageSize: 20,
                boardId: that.data.board_id
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

                // 处理返回的数据
                var result = that.dealData(res)

                var newList = that.data.info.topicList.concat(result.topicList)

                result.topicList = util.unique(newList)

                wx.stopPullDownRefresh()
                that.setData({
                    loading: false,
                    page: nextPage,
                    hasNext: res.data.has_next,
                    info: result
                })
            }
        })

        setTimeout(function(){
            bottomRunning = false
        }, 3000)
    },

    // 生命周期函数
    onLoad: function (options) {
        this.setData({
            board_id: options.id
        })

        wx.setNavigationBarTitle({
            title: options.name
        })

        wx.startPullDownRefresh()
    }
})
