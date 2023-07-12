# animeScheduler
毎日その日放送予定のアニメをslackに通知し、Slack上で観たい番号を入力すると放送時間直前になったら自動でテレビがつく。

### 必要なもの
- NatureRemo
- Slackアカウント
- Googleアカウント

### トリガー設定（GoogleAppsScript）
-  setTrigger ：　時間主導型、日付ベースのトリガー、午後8〜9時
-  checkSlackChannel ：　時間主導型、日付ベースのトリガー、午後6〜7時
-  getTodayAnimeSchedule ：　時間主導型、日付ベースのトリガー、午後12〜1時
