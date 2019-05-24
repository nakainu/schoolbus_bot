var CHANNEL_ACCESS_TOKEN = 'pz/ocBiPe6mu0DxtEaU56ThWvV7q1RCxWnnFwaKLtIalzdXesKAVDyiogGiMSA+r1tHwRN+S8ipMtRI9dJNUCPhM70/RERn1pSPwpVyFr9aibO747U2yysEtH964pznCXKTBVFh15BXnl+tMfHveuQdB04t89/1O/w1cDnyilFU='; // Channel_access_tokenを登録
var TEST = false;

function doPost(e) {
  var event = JSON.parse(e.postData.contents).events[0];
  var replyToken = event.replyToken;
  
  if (typeof replyToken === 'undefined') {
    return; // エラー処理
  }
  var userId = event.source.userId;
  var nickname = getUserProfile(userId);
  
  if (event.type == 'follow') {
    // ユーザーにbotがフォローされた場合に起きる処理
  }
  
  if (event.type == 'message') {
    var userMessage = event.message.text;
    
    if (userMessage == 'みなみ野発') {
      var replyMessage = getMinaminoCanpus(userMessage);
      
    } else if (userMessage == '八王子発') {
      var replyMessage = getHachiojiCanpus(userMessage);
      
    } else if (userMessage == 'キャンパス発(みなみ野行)') {
      var replyMessage = getCanpusMinamino(userMessage);
      
    } else if (userMessage == 'キャンパス発(八王子行)') {
      var replyMessage = getCanpusHachioji(userMessage);

    } else {
      var replyMessage = userMessage;
    }
  }
  
  var url = 'https://api.line.me/v2/bot/message/reply';
  
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': replyMessage,
      }],
    }),
  });
  return ContentService.createTextOutput(
    JSON.stringify({
      'content': 'post ok'
    })
  ).setMimeType(ContentService.MimeType.JSON);
}


// profileを取得してくる関数
function getUserProfile(userId) {
  var url = 'https://api.line.me/v2/bot/profile/' + userId;
  var userProfile = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
  })
  return JSON.parse(userProfile).displayName;
}


// 日時のformat
var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};


// みなみ野発の時刻を取得
function getMinaminoCanpus(mes) {
  var url = "https://bus.t-lab.cs.teu.ac.jp/api/v1/timetables?from=1";
  var json = UrlFetchApp.fetch(url).getContentText();
  var jsonData = JSON.parse(json);
  var str;
  if (jsonData.timetables.length < 1) {
    str = '歩け';
  } else {
    str = 'みなみ野発';
    for (var i=0; i<jsonData.timetables.length; i++) {
      str += '\n' + formatDate(new Date(jsonData.timetables[i].departure_time), 'hh:mm');
    }
  }
  Logger.log(str);
  return str;
}


// キャンパス発(みなみ野行)の時刻を取得
function getCanpusMinamino(mes) {
  var url = "https://bus.t-lab.cs.teu.ac.jp/api/v1/timetables?from=2";
  var json = UrlFetchApp.fetch(url).getContentText();
  var jsonData = JSON.parse(json);
  var str;
  if (jsonData.timetables.length < 1) {
    str = '歩け';
  } else {
    str = 'キャンパス発(みなみ野行)';
    for (var i=0; i<jsonData.timetables.length; i++) {
      str += '\n' + formatDate(new Date(jsonData.timetables[i].departure_time), 'hh:mm');
    }
  }
  Logger.log(str);
  return str;
}


// 八王子発の時刻を取得
function getHachiojiCanpus(mes) {
  var url = "https://bus.t-lab.cs.teu.ac.jp/api/v1/timetables?from=3";
  var json = UrlFetchApp.fetch(url).getContentText();
  var jsonData = JSON.parse(json);
  var str;
  if (jsonData.timetables.length < 1) {
    str = '歩け';
  } else {
    str = '八王子発';
    for (var i=0; i<jsonData.timetables.length; i++) {
      str += '\n' + formatDate(new Date(jsonData.timetables[i].departure_time), 'hh:mm');
    }
  }
  Logger.log(str);
  return str;
}


// キャンパス発(八王子行）の時刻を取得
function getCanpusHachioji(mes) {
  var url = "https://bus.t-lab.cs.teu.ac.jp/api/v1/timetables?from=4";
  var json = UrlFetchApp.fetch(url).getContentText();
  var jsonData = JSON.parse(json);
  var str;
  if (jsonData.timetables.length < 1) {
    str = '歩け';
  } else {
    str = 'キャンパス発(八王子行)';
    for (var i=0; i<jsonData.timetables.length; i++) {
      str += '\n' + formatDate(new Date(jsonData.timetables[i].departure_time), 'hh:mm');
    }
  }
  Logger.log(str);
  return str;
}