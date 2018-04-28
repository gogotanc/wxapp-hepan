// reply.js
const app = getApp()

Page({
    data: {
        tid: '0',
        rid: '0',
        str: '开始你的表演。'
    },

    // 提交评论
    submitForm: function (e) {
        console.log(e)
        var tid = this.data.tid
        var rid = this.data.rid
        var content = e.detail.value.content
        console.log(tid)
        console.log(rid)
        console.log(content)

        // 评论内容
        var content = [
            {
                "infor": content,
                "type": 0
            }
        ]

        // json 数据
        var json = {
            "body": {
                "json": {
                    "content": JSON.stringify(content),
                    "contentList": content,
                    "fid": 0,
                    "isAnonymous": 0,
                    "isOnlyAuthor": 0,
                    "isQuote": rid == '0' ? '0' : '1',
                    "replyId": rid,
                    "tid": tid,
                    "typeId": 0
                }
            }
        }

        var jsonStr = JSON.stringify(json)

        console.log(jsonStr)

        wx.request({
            url: app.globalData.url,
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: {
                r: 'forum/topicadmin',
                accessToken: app.globalData.loginFlag ? app.globalData.userInfo.token : '',
                accessSecret: app.globalData.loginFlag ? app.globalData.userInfo.secret : '',
                act: 'reply',
                json: jsonStr
            },
            success: function (res) {

                console.log(res)

                wx.showToast({
                    title: res.data.head.errInfo,
                    icon: 'none',
                    duration: 1000
                })

                if (res.data.rs == 1) {
                    // 回复成功跳转
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }, 1000);
                }
            }
        })
    },

    // 返回上一页
    goBack: function () {
        wx.navigateBack()
    },

    // 生命周期函数
    onLoad: function (options) {
        console.log(options)
        this.setData({
            tid: options.tid || '0',
            rid: options.rid || '0',
            str: options.str || '开始你的表演。'
        })
    }
})
