# animeScheduler
毎日その日放送予定のアニメをslackに送信し、slackに見たい番号を入力すると放送時間になったらテレビがつく。

### 必要なもの
- NatureRemo
- slackアカウント

### トリガー設定
-  setTrigger ：　時間主導型、日付ベースのトリガー、午後8〜9時
-  checkSlackChannel ：　時間主導型、日付ベースのトリガー、午後6〜7時
-  getTodayAnimeSchedule ：　時間主導型、日付ベースのトリガー、午後12〜1時
