// list.js
const util = require('../../utils/util')
const app = getApp()

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
                    info: result
                })
            }
        })
    },

    // 生命周期函数
    onLoad: function (options) {
        this.setData({
            board_id: options.id
        })
        wx.startPullDownRefresh()
    }
})
