var Twit = require('twit');
var twitInfo = require('./config.js');
var twitter = new Twit(twitInfo);
var natural = require('natural'),
  tokenizer = new natural.WordTokenizer();
  
function matchRE (re, text) {
  var wordArray = tokenizer.tokenize(text);
  for (var i=0; i < wordArray.length; i++) {
    if (re.test(wordArray[i])) {
      return true;
    }
  }
  return false;
}

function search (query, asker) {
  var search = "charleston " + query + " filter:links";
  twitter.get('search/tweets', { q: search, count: 10 }, function (err, data, res) {
    var resultLink;

    if (data.statuses[0].entities.urls.length > 0) {
      resultLink = data.statuses[0].entities.urls[0].url;
    } else {
      for (var i = 0; i < data.statuses.length; i++) {
        if (data.statuses[i].entities.urls.length > 0) {
          resultLink = data.statuses[i].entities.urls[0].url;
          i = data.statuses.length;
        }
      }
    };

    var result = "@" + asker + " Cool cool. Totally get that... " + query + " is neat. How about this? " + resultLink;
    post(result);
  })
}

function post (content) {
  twitter.post('statuses/update', { status: content }, function (err, data, res) {

  })
}

var stream = twitter.stream('statuses/filter', { track: '@HolyCityBot' })

stream.on('tweet', function (tweet) {
  var asker = tweet.user.screen_name;
  var text = tweet.text;

  var greetingRE = /^hi|hey$/;
  var musicRE = /^music$/;
  var filmRE = /^film$/;
  var theaterRE = /^theater$/;
  var foodRE = /^food$/;
  var drinkRE = /^drink$/;
  var freeRE = /^free$/;

  if (matchRE(musicRE, text)) {
    search("music", asker)
  } else if (matchRE(filmRE, text)) {
    search("film", asker)
  } else if (matchRE(theaterRE, text)) {
    search("theater", asker)
  } else if (matchRE(foodRE, text)) {
    search("food", asker)
  } else if (matchRE(drinkRE, text)) {
    search("drink", asker)
  } else if (matchRE(freeRE, text)) {
    search("free", asker)
  } else if (matchRE(greetingRE, text)) {
    post("Hey " + "@" + asker + " . So, I've heard about some cool Chuck-town stuff. Or you know, whatever. [music, film, theater, food, drink, free]");
  } else {}
})
