var postsData = require("../../data/posts-data.js")

// pages/welcome.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options){
    this.setData({
      posts_key: postsData.postList
    });
  },

  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid;
    //console.log("onPostId=" + postId)；
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    });
  },

  onSwiperTap:function(event){
    //target & currentTarget
    //target————当前点击的组件————<image>
    //currentTarget————事件捕捉的组件————<swiper>
    var postId = event.target.dataset.postid;
    //console.log("onPostId=" + postId)；
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    });
  }

})