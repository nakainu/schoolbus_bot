var CHANNEL_ACCESS_TOKEN = 'ChannelAccessToken'; // Channel_access_tokenを登録

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
      var replyMessage = getSheetMinaminoCanpus(userMessage);

    } else if (userMessage == '八王子発') {
      var replyMessage = getSheetHachiojiCanpus(userMessage);

    } else if (userMessage == 'キャンパス発(みなみ野行)') {
      var replyMessage = getSheetCanpusMinamino(userMessage);

    } else if (userMessage == 'キャンパス発(八王子行)') {
      var replyMessage = getSheetCanpusHachioji(userMessage);

    } else {
      var replyMessage = userMessage;
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

// みなみ野発のシートを取得
function getSheetMinaminoCanpus(mes) {
  var nt = nowTime();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("みなみ野");

  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());

  var data = range.getValues();

  for (var i = 1; i < data.length; i++) {

    var hh = data[i][1].slice(0, 2);
    var mm = data[i][1].slice(3, 5);

    var dif = 60 * (nt.HH - Number(hh)) + (nt.MM - Number(mm));

    if (dif < 0) {
      return data[i][1];
    }
  }
  return '歩け';
}

// キャンパス発(みなみ野行)のシートを取得
function getSheetCanpusMinamino(mes) {
  var nt = nowTime();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("みなみ野");

  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());

  var data = range.getValues();

  for (var i = 1; i < data.length; i++) {

    var hh = data[i][0].slice(0, 2);
    var mm = data[i][0].slice(3, 5);

    var dif = 60 * (nt.HH - Number(hh)) + (nt.MM - Number(mm));

    if (dif < 0) {
      return data[i][0];
    }
  }
  return '歩け';
}

// 八王子発のシートを取得
function getSheetHachiojiCanpus(mes) {
  var nt = nowTime();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("八王子");

  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());

  var data = range.getValues();

  for (var i = 1; i < data.length; i++) {

    var hh = data[i][1].slice(0, 2);
    var mm = data[i][1].slice(3, 5);

    var dif = 60 * (nt.HH - Number(hh)) + (nt.MM - Number(mm));

    if (dif < 0) {
      return data[i][1];
    }
  }
  return '歩け';
}

// キャンパス発(八王子行）のシートを取得
function getSheetCanpusHachioji(mes) {
  var nt = nowTime();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("八王子");

  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());

  var data = range.getValues();

  for (var i = 1; i < data.length; i++) {

    var hh = data[i][0].slice(0, 2);
    var mm = data[i][0].slice(3, 5);

    var dif = 60 * (nt.HH - Number(hh)) + (nt.MM - Number(mm));

    if (dif < 0) {
      return data[i][0];
    }
  }
  return '歩け';
}

// 今の時間
function nowTime() {
  var d = new Date();
  var hh = d.getHours();
  var mm = d.getMinutes();

  var nowtime = {
    HH: hh,
    MM: mm
  }
  return nowtime;
}