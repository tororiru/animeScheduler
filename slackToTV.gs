function checkAnimeSchedule() {
  
　　 var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var now = new Date();
  var currentTime = Utilities.formatDate(now, "JST", "HH:mm");

  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var anime = data[i];
    var scheduledTime = new Date(anime[2]); // 放送時間をDateオブジェクトに変換
    scheduledTime.setMinutes(scheduledTime.getMinutes() - 2);
    var scheduledTimeHHmm = Utilities.formatDate(scheduledTime, "JST", "HH:mm");
    if (scheduledTimeHHmm == currentTime && "◯" == anime[3]) {
      Logger.log(scheduledTime);
      // テレビを操作
      turnOnTV();
      break;  // 一致するアニメが見つかったらループを終了
    }
  }
}

function turnOnTV() {
  var options = {
    'method': 'post',
    'headers': {
       'Authorization': 'Bearer  【NatureRemoのtoken】'
    }
  };

// idはこれで色々取得できる
// curl -X 'GET' -H "Authorization: Bearer 【NatureRemoのtoken】" 'https://api.nature.global/1/appliances' -H 'accept: application/json'
　  // 電源
  UrlFetchApp.fetch('https://api.nature.global/1/signals/【電源のid】/send', options);
  sleep(2000)
  // チャンネル選択（9割型TOKYOMXなので固定した）
  UrlFetchApp.fetch('https://api.nature.global/1/signals/【チャンネルのid】/send', options);
}

function sleep(waitMsec) {
  var startMsec = new Date();
  // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
  while (new Date() - startMsec < waitMsec);
}

function setTrigger() {
  deleteTrigger('minuteTrigger');
  var registerDate = new Date();
  registerDate.setHours(21);
  registerDate.setMinutes(00);
  ScriptApp.newTrigger('minuteTrigger').timeBased().at(registerDate).create();

  deleteTrigger('minutedeleteTrigger');
  var registerDate = new Date();
  registerDate.setHours(03);
  registerDate.setMinutes(00);
  ScriptApp.newTrigger('minutedeleteTrigger').timeBased().at(registerDate).create();
}

function deleteTrigger(triggerName) {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() == triggerName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function minuteTrigger() {
  deleteTrigger('checkAnimeSchedule');
  ScriptApp.newTrigger('checkAnimeSchedule').timeBased().everyMinutes(1).create();
}

function minutedeleteTrigger() {
  deleteTrigger('checkAnimeSchedule');
}
