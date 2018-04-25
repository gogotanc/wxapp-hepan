//person.js
const app = getApp()

Page({
    data: {
        loginFlag: false,
        userInfo: {}
    },

    // 用户退出登录
    logout: function () {
        var that = this
        wx.showModal({
            title: '提示',
            content: '确定要退出吗？',
            confirmColor: '#3594f2',
            success: function(res) {
                if (res.confirm) {
                    console.log('确认退出')
                    app.globalData.loginFlag = false
                    app.globalData.userInfo = {}

                    // 清除缓存
                    wx.clearStorage({
                        key: 'loginFlag'
                    })
                    wx.clearStorage({
                        key: 'userInfo'
                    })

                    that.setData({
                        loginFlag: app.globalData.loginFlag,
                        userInfo: app.globalData.userInfo
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    // 提交登录的表单
    submitForm: function (e) {
        var that = this
        let username = e.detail.value.username
        let password = e.detail.value.password
        // 登录请求
        wx.request({
            url: 'https://bbs.gogotanc.cn/login',
            method: 'POST',
            data: {
                username: username,
                password: password
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                console.log(res.data)
                var code = res.data.rs
                if (code == 0) {
                    // 登录失败
                    wx.showToast({
                        title: res.data.errcode,
                        icon: 'none',
                        duration: 1000,
                    })
                } else {
                    // 登录成功
                    app.globalData.userInfo = res.data
                    app.globalData.loginFlag = true
                    that.setData({
                        loginFlag: app.globalData.loginFlag,
                        userInfo: app.globalData.userInfo
                    })

                    // 本地缓存用户登录信息
                    wx.setStorage({
                        key: 'loginFlag',
                        data: true
                    })
                    wx.setStorage({
                        key: 'userInfo',
                        data: app.globalData.userInfo
                    })

                    wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 1000,
                    })
                }
            }
        })
    },

    // 生命周期函数
    onLoad: function () {
        this.setData({
            loginFlag: app.globalData.loginFlag,
            userInfo: app.globalData.userInfo
        })
    }
})
