//app.js

const URL = 'https://bbs.gogotanc.cn'
// const URL = 'https://bbs.gogotanc.cn'

App({
    onLaunch: function () {
        let that = this
        that.checkLogin()
    },

    checkLogin: function () {
        let that = this
        var flag = wx.getStorageSync("loginFlag")
        if (flag) {
            wx.getStorage({
                key: 'userInfo',
                success: function(res){
                    console.log('获取缓存的用户信息成功')
                    that.globalData.userInfo = res.data
                    that.globalData.loginFlag = flag
                },
                fail: function() {
                    console.log('获取缓存的用户信息失败')
                    wx.setStorage({
                        key: 'loginFlag',
                        data: false
                    })
                }
            })
        } else {
            console.log('缓存中没有登录信息')
        }
    },

    globalData: {
        url: URL,
        loginFlag: false,
        userInfo: null
    }
})
