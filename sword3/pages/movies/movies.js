var app = getApp();

Page({
  //RESTFul API JSON
  //SOAP XML
  data: {
    onTickets: {},
    attTheatres: {}, 
    comingSoon: {},
  },

  onLoad: function(event) {
    var onTicketsUrl = app.globalData.mtimeBase + '/PageSubArea/HotPlayMovies.api?locationId=290';
    var attTheatersUrl = app.globalData.mtimeBase + '/Showtime/LocationMovies.api?locationId=290';
    var comingSoonUrl = app.globalData.mtimeBase + '/Movie/MovieComingNew.api?locationId=290';

    this.getMovieListData(onTicketsUrl, 'onTickets');
    this.getMovieListData(attTheatersUrl, 'attTheaters');
    this.getMovieListData(comingSoonUrl, 'comingSoon');
  },

  getMovieListData: function(url, settedKey) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/json"
      },
      success: function(res) {
        console.log(res)
        that.processMtimeData(res.data, settedKey)
      },
      fail: function(error) {
        console.log(error)
      }
    })
  },

  processMtimeData: function (moviesMtime, settedKey) {
    var movies = [];
    //onTickets
    for (var idx in moviesMtime.movies) {
      var subject = moviesMtime.movies[idx];
      var title = subject.titleCn;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        avarage: subject.ratingFinal,//综合评分
        coverageUrl: subject.img,
        movieId: subject.movieId,
      }
      movies.push(temp)
    }
    //attTheaters
    for (var idx in moviesMtime.ms) {
      var subject = moviesMtime.ms[idx];
      var title = subject.t;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        avarage: subject.r,//综合评分
        coverageUrl: subject.img,
        movieId: subject.id,
      }
      movies.push(temp)
    }
    //comingSoon
    for (var idx in moviesMtime.moviecomings) {
      var subject = moviesMtime.moviecomings[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        avarage: subject.wantedCount,//综合评分
        coverageUrl: subject.image,
        movieId: subject.id,
      }
      movies.push(temp)
    }
    var readyData = {};
    readyData[settedKey] = {
      movies: movies
    };
    this.setData(readyData);
  }


})