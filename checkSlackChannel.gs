function checkSlackChannel() {
  var channelId = "【監視するSlackのチャンネルID】";
  var today = Utilities.formatDate(new Date(), "JST", "yyyy-MM-dd"); // 今日の日付
  
  var historyParams = {
    channel: channelId,
    oldest: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000), // 今日の0時のUNIXタイムスタンプ
    latest: Math.floor(Date.now() / 1000), // 現在のUNIXタイムスタンプ
    inclusive: true
  };

  var historyResponse = callSlackAPI("conversations.history", historyParams);

  var messages = historyResponse.messages;
  
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    var messageTimestamp = new Date(message.ts * 1000); // UNIXタイムスタンプを日付に変換
    var messageDate = Utilities.formatDate(messageTimestamp, "JST", "yyyy-MM-dd"); // メッセージの日付を取得
    // 数字だけのメッセージが当日投稿されているか確認
    if (message.type === "message" && message.text.match(/^\d+$/) && messageDate === today) {
      handleSlackInput(message.text);
      // break;
    }
  }
}

function handleSlackInput(message) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dataStartRow = 2; // データの開始行を指定
  var selectedNumber = parseInt(message);
  var targetRow = dataStartRow + selectedNumber - 1;

  var columnToCheck = 4; // チェックを付ける列の番号
 
  // チェックを付ける行の範囲を計算
  var range = sheet.getRange(targetRow, columnToCheck);

  // チェックを付ける
  range.setValue("◯");
}


function callSlackAPI(method, params) {
  var token = "【自分のSlackアプリのトークン】";
  
  var apiUrl = "https://slack.com/api/" + method;
  var headers = {
    Authorization: "Bearer " + token
  };
  
  var options = {
    method: "get",
    headers: headers,
    muteHttpExceptions: true
  };
  
  var url = apiUrl + "?" + Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
  }).join("&");
  
  var response = UrlFetchApp.fetch(url, options);
  var content = response.getContentText();
  var data = JSON.parse(content);
  
  return data;
}
