App({
    onLaunch: function () {
        wx.request({
            url: '',
            header: {
                'Content-Type': 'application/json'
            },
            success: function (res) {

            }
        })
    },
    onShow: function () {

    },
    onHide: function () {

    },
    globalData: globalData
})