var postsData = require("../../../data/posts-data.js")
var app = getApp();

Page({
  data: {
    isPlayingMusic: false
  },

  onLoad: function(option) {
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    //  this.data.postData = postData;
    //缓存上限10M
    //四类操作，同步+异步共8种方法
    this.setData({
      postData: postData
    })
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      if (postCollected) {
        this.setData({
          collected: postCollected
        })
      } else {
        this.setData({
          collected: false
        })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId===postId){
      //this.data.isPlayingMusic = true;
      this.setData({
        isPlayingMusic: true
      })
    };

    this.setMusicMonitor();
  },

  setMusicMonitor: function(){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
  },

  onCollectionTap: function(event) {
    this.getPostsCollectedSyc();
    //this.getPostsCollectedAsy();  
  },

  //异步
  getPostsCollectedAsy: function() {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[that.data.currentPostId];
        //收藏状态切换
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        that.showToast(postsCollected, postCollected);
      },
    })
  },

  //同步
  getPostsCollectedSyc: function() {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏状态切换
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showModal: function(postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章?' : '取消收藏？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#ddd',
      confirmText: '确认',
      confirmColor: '#000',
      success: function(res) {
        if (res.confirm) {
          //更新文章是否收藏的缓存值
          wx.setStorageSync('posts_collected', postsCollected);
          //更新数据变量的绑定值，实现wxml页面的显示图片切换
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function(postsCollected, postCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    //更新数据变量的绑定值，实现wxml页面的显示图片切换
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },

  onShareTap: function(event) {
    var itemList = [
      "分享到朋友圈",
      "分享给微信好友",
      "分享到微博",
      "分享到QQ空间",
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success(res) {
        //res.tapIndex 数组元素的序号 从0开始
        //res.cancel 用户点击的取消选项
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消' + res.cancel + '小程序好像现在已经可以分享了呢',
        })
      }
    })
  },

  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.dataUrl,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImgUrl,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})