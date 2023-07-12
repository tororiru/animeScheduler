function getTodayAnimeSchedule() {
  var url = "https://cal.syoboi.jp/cal_chk.php";
  var today = new Date();
  var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);  // 翌日の日付を取得
  var todayDateString = Utilities.formatDate(today, "JST", "yyyyMMdd");

  var payload = {
    method: "get",
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url + "?Days=" + todayDateString, payload);
  var content = response.getContentText();

  // XMLをパースしてデータを取得
  var document = XmlService.parse(content);
  var root = document.getRootElement();
  var progItems = root.getChild("ProgItems");
  var programs = progItems.getChildren("ProgItem");

  var message = ":tv: *今日のアニメ放送スケジュール* :tv:\n\n";
  var targetChannels = ["フジテレビ", "TOKYO MX", "テレビ東京", "TBS", "NHK総合", "日本テレビ"]; // 自分の家の放送局を指定

  var headers = ["番号", "タイトル", "放送時間", "チェック"]; //ヘッダー行
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  var dataStartRow = 2;  // 開始行

  var data = [];
  var count = 1;

  for (var i = 0; i < programs.length; i++) {
    var program = programs[i];
    var title = program.getAttribute("Title").getValue();
    var subTitle = program.getAttribute("SubTitle").getValue();
    var startTime = program.getAttribute("StTime").getValue();
    var endTime = program.getAttribute("EdTime").getValue();
    var channelName = program.getAttribute("ChName").getValue();
    var startTimeFormatted = startTime.substring(8, 10) + ":" + startTime.substring(10, 12);
    var endTimeFormatted = endTime.substring(8, 10) + ":" + endTime.substring(10, 12);

    // 指定した放送局かつ当日から翌日の3:00までのアニメのみを表示
    var programDate = new Date(parseInt(startTime.substring(0, 4)), parseInt(startTime.substring(4, 6)) - 1, parseInt(startTime.substring(6, 8)), parseInt(startTime.substring(8, 10)), parseInt(startTime.substring(10, 12)));
    var tomorrowThreeAM = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 3, 0);
    if (targetChannels.includes(channelName) && (programDate >= today && programDate <= tomorrowThreeAM)) {
      var rowData = [count, title, startTimeFormatted, ""];

      message +=   "*" + count + ". " + title + "* " + " (" + channelName + ")\n";
      message += "放送時間: " + startTimeFormatted + "～" + endTimeFormatted + "\n";
      message += "-------------------------\n";

      sheet.getRange(dataStartRow + count - 1, 1).setValue(count);  // 番号
      sheet.getRange(dataStartRow + count - 1, 2).setValue(title);  // タイトル
      sheet.getRange(dataStartRow + count - 1, 3).setValue(startTimeFormatted);  // 放送開始時間

      data.push(rowData);

      count++;
    }
  }

  if (data.length > 0) {
    var range = sheet.getRange(dataStartRow, 1, data.length, data[0].length);
    range.setValues(data);
  }
  message += "気になる番号を入力してください（例: 1） :mag_right: ";
  // Slackに通知
  sendSlackNotification(message);
}

function sendSlackNotification(message) {
  var slackUrl = "【SlackのWebhookURL】";

  var payload = {
    "text": message
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };

  UrlFetchApp.fetch(slackUrl, options);
}

