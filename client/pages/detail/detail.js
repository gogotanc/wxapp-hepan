// detail.js
const util = require('../../utils/util')
const app = getApp()

// bottom func 运行的标志，防止多次触发底部函数
var bottomRunning = false

Page({
    data: {
        display: false,
        hasNext: true,
        page: 1,
        pageSize: 30,
        order: 0,
        topicId: null,
        topic: {},
        reply: []
    },

    showImage: function (e) {
        var url = e.currentTarget.dataset.url
        wx.previewImage({
            // 当前显示图片的http链接
            current: url,
            // 需要预览的图片http链接列表
            urls: [url]
          })
    },

    // 处理返回数据
    dealData: function (res) {

        // 用于处理表情的正则表达式
        var rep = /\[.*\]/g

        // 处理评论数据
        var reply_data = []
        /*
        评论数据格式
        reply = [reply_item, reply_item, ...]
        reply_item = {
            reply_id: '',
            icon: '',
            author: '',
            time: '',
            is_quote: '',
            quote_content: '',
            content: []
        }
        */
        var arr = res.data.list
        for (var j = 0; j < arr.length; j++) {
            var reply = arr[j]
            var contents = arr[j].reply_content
            var content = []
            for (var i = 0; i < contents.length; i++) {
                var tmp = contents[i]
                if (tmp.type == 0) {
                    // 替换表情包
                    tmp.infor = tmp.infor.replace(rep, '[表情]')
                }
                content.push(tmp)
            }
            var reply_item = {
                reply_id: reply.reply_posts_id,
                icon: reply.icon,
                author: reply.reply_name,
                time: util.formatTime(new Date(parseInt(reply.posts_date))),
                is_quote: reply.is_quote == 1 ? true : false,
                quote_content: reply.quote_content,
                content: content
            }
            reply_data.push(reply_item)
        }
        // 处理评论数据 end

        /* 
        topic 包含的内容
        topic = {
            title: '帖子的名称',
            icon: '',
            author: '',
            time: '',
            comments: 34,
            content: [],
        }
        */

        // 处理 topic 数据
        var tmpTopic = res.data.topic
        var topic = {}

        if (typeof tmpTopic != 'undefined') {
            var tmpContent = tmpTopic.content
            var content = []

            for (var i = 0; i < tmpContent.length; i++) {
                var tmp = tmpContent[i]
                if (tmp.type == 0) {
                    // 替换表情包
                    tmp.infor = tmp.infor.replace(rep, '[表情]')
                }
                content.push(tmp)
            }
            topic = {
                title: tmpTopic.title,
                icon: tmpTopic.icon,
                author: tmpTopic.user_nick_name,
                time: util.formatTime(new Date(parseInt(tmpTopic.create_date))),
                content: content
            }
        }
        // 处理 topic 数据 end

        return {
            topic: topic,
            reply: reply_data,
            hasNext: res.data.has_next == 0 ? false : true
        }
    },

    // 下拉刷新事件
    onPullDownRefresh: function() {
        var that = this
        wx.request({
            url: app.globalData.url,
            method: 'POST',
            data: {
                r: 'forum/postlist',
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                topicId: that.data.topicId,
                page: 1,
                pageSize: that.data.pageSize,
                order: that.data.order
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                console.log(res)

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

                // 处理返回的数据
                var data = that.dealData(res)

                wx.stopPullDownRefresh()
                that.setData({
                    display: true,
                    page: 1,
                    hasNext: data.hasNext,
                    reply: data.reply,
                    topic: data.topic
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
                title: '已经到底了。',
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
                r: 'forum/postlist',
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                topicId: that.data.topicId,
                page: nextPage,
                pageSize: that.data.pageSize,
                order: that.data.order
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
                var data = that.dealData(res)

                var newComments = that.data.reply.concat(data.reply)
                wx.stopPullDownRefresh()
                that.setData({
                    page: nextPage,
                    hasNext: data.hasNext,
                    reply: util.uniqueComment(newComments)
                })
            }
        })

        setTimeout(function(){
            bottomRunning = false
        }, 3000)
    },

    // 生命周期函数
    onLoad: function (options) {
        this.setData({ topicId: options.topicId })
        wx.startPullDownRefresh()
    }
})
