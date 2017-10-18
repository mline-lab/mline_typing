/* -------------------- 設定用定数 -------------------- */
// 制限時間設定用定数
var timeLimit = 60;
//ゲーム開始カウントダウン設定用定数
// -2の数値がカウントされる。
var gameStartCount = 5;

/* -------------------- フラグ用変数 -------------------- */
//ゲーム中フラグ
// ゲーム中:1 非ゲーム中:0
var game_flag = 0;
//スペースキー打鍵許可フラグ
//許可:1 禁止:0
var space_flag = 0;

/* -------------------- 出題文字列用変数 -------------------- */
//3要素の配列。0番目に『文全体のローマ字』、
//1番目に『ひらがなを単語毎に配列に入れたもの』、
//2番目に『ローマ字を単語毎に配列に入れたもの』が入る
var worddata;
//出題文字列
var wordChars;
//文字先頭位置カウンター
var charIndex;
//未入力文字ID
var typeArea;
//未入力文字
var textColor1;
//入力済み文字ID
var typeArea2;
//入力済み文字
var textColor2;
//出題文字列
var wordList_jp = new Array();
//出題文字列ふりがな
var wordList_hiragana = new Array();

/* -------------------- ゲーム中カウント変数 -------------------- */
//１秒カウント用タイマー
var timer1Sec;
//ゲーム開始までのカウントダウン
var startcount;
//制限時間カウンター
var timeCount;
//ミス数カウンター
var missCount;
//スコアカウンター
var score;
//打ち切った単語数
var downcount;
//ノーミスゲージ
var gauge;

/* -------------------- 送信用変数 -------------------- */
//ランキング登録ネーム
var username;

/* -------------------- ゲーム画面表示変数 -------------------- */
//メッセージエリア表示文字
var messageArea;

/* -------------------- 遷移時初期処理 -------------------- */
window.onload = function() {
  startButton = document.getElementById("start_button");
  messageArea = document.getElementById("message");
  wordArea_jp = document.getElementById("word_jp");
  wordArea_hiragana = document.getElementById("word_hiragana");
  typeArea = document.getElementById("type_Before");
  typeArea2 = document.getElementById("type_After");
  time_area = document.getElementById("time_area");
  score_area = document.getElementById("score_area");
}

/* -------------------- 出題文字列取得処理 -------------------- */
function getCSV_jp_File() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "csv/word.csv", true);
    xhr.send(null);
    xhr.onload = function() {
      wordList_jp = xhr.responseText.split(";");
    };
}

/* -------------------- 出題文字列ふりがな取得処理 -------------------- */
function getCSV_hira_File() {
    var xhr2 = new XMLHttpRequest();
    xhr2.open("get", "csv/word_hiragana.csv", true);
    xhr2.send(null);
    xhr2.onload = function() {
      wordList_hiragana = xhr2.responseText.split(";");
    };
}

/* -------------------- 初期化処理 -------------------- */
function setvar() {
  //ゲームスタートカウント初期化
  startcount = gameStartCount;
  //ゲーム制限時間セット
  timeCount = timeLimit;
  //スコアクリア
  score = 0;
  //ミスカウントクリア
  missCount = 0;
  //打ち切った数クリア
  downcount = 0;
  //ノーミスゲージクリア
  gauge = 0;
  //アクションフラグクリア
  deadly = 0;
  //出題文字列クリア
  wordChars = [];

  //スコア表示クリア
  score_area.textContent = "0000";
  //入力文字クリア
  typeArea.textContent = "";
  typeArea2.textContent = "";
  //出題文字クリア
  wordArea_hiragana.textContent = "";
  wordArea_jp.textContent = "";
  //スタートボタン非表示
  startButton.style.visibility = "hidden";
}

/* -------------------- スタートボタンクリック時処理 -------------------- */
function onStartButtonClick() {
  //出題文字列CSV取得
  getCSV_jp_File();
  getCSV_hira_File();
  //変数初期化処理
  setvar();
  //メッセージエリア文字列クリア
  messageArea.textContent = "スペースキーでスタート";
  //スペースキー打鍵許可
  space_flag = 1;
}

/* -------------------- スペースキー打鍵時処理 -------------------- */
function space_start() {　 //スペースキー打鍵禁止
  space_flag = 0;
  //カウントダウン
  startcount--;
  //Redy表示
  if (startcount == 4) {
    messageArea.textContent = "Ready...";
    setTimeout("space_start()", 1000);
    //ゲームスタート
  } else if (startcount == 0) {
    messageArea.textContent = "GO!";
    startTyping();
    //カウントダウン
  } else {
    messageArea.textContent = startcount;
    setTimeout("space_start()", 1000);
  }
}

/* -------------------- ゲームスタート処理 -------------------- */
function startTyping() {
  //ゲーム中フラグ
  game_flag = 1;
  //出題文字列表示
  nextWord();
  //カウントダウン開始
  countDown();
  timer1Sec = setInterval("countDown()", 1000);
}

/* -------------------- 出題表示処理 -------------------- */
function nextWord() {
  if (timeCount >= 0) {
    //タイピング処理用変数クリア
    tableichi = 0;
    ichi = 0;
    inputtype = "";
    nyuuryoku = "";
    nowtype = "";
    //文字先頭位置クリア
    charIndex = 0;
    //リストからランダムに文字列取得
    var random = Math.floor(Math.random() * (wordList_hiragana.length - 1));
    //画面へ表示
    wordArea_hiragana.textContent = wordList_hiragana[random];
    wordArea_jp.textContent = wordList_jp[random];
    //ひらがなを変換
    worddata = townro_machange(wordList_hiragana[random], henkan);
    ro_ma = worddata[0];
    jword = worddata[1];
    word = worddata[2];
    //入力欄をクリア
    typeArea.textContent = "";
    wordChars = ro_ma.toUpperCase().split('');
    textColor2 = ro_ma;
    //未入力欄に表示
    typeArea2.textContent = textColor2;
  }
}

/* -------------------- 制限時間カウントダウン -------------------- */
function countDown() {
  //終了遷移
  if (timeCount <= -1) {
    //終了処理
    stopTyping();
    return;
  //タイムアップ処理
  } else if (timeCount == 0) {
    typeArea.textContent = "";
    typeArea2.textContent = "";
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent = "タイムアップ";
  }
  //カウントダウン
  time_area.textContent = timeCount + " sec.";
  timeCount--;
}

/* -------------------- ゲーム終了処理 -------------------- */
function stopTyping() {
  //カウントストップ
  clearInterval(timer1Sec);
  //ゲーム中フラグOFF
  game_flag = 0;
  //ストップ処理遷移待ちタイムアウト
  setTimeout("stop_refresh()", 1010);
}

/* -------------------- ゲーム終了時処理 -------------------- */
function stop_refresh() {
  timeCount = 0;
  time_area.textContent = timeCount + " sec.";
  //成績表示
  messageArea.textContent = "Score: " + score + "■倒した数" + downcount + "■ミスタイプ数" + missCount;
  //入力文字表示クリア
  typeArea.textContent = "";
  typeArea2.textContent = "";
  //出題文字表示クリア
  wordArea_hiragana.textContent = "";
  wordArea_jp.textContent = "";
  //スタートボタン非表示
  startButton.style.visibility = "visible";
}

/* -------------------- ESCキーゲーム中断時処理 -------------------- */
function esc() {
  //カウントストップ
  clearInterval(timer1Sec);
  game_flag = 0;
  //入力文字表示クリア
  typeArea.textContent = "";
  typeArea2.textContent = "";
  //出題文字表示クリア
  wordArea_hiragana.textContent = "";
  wordArea_jp.textContent = "";
  //スタートボタンクリック時処理へ遷移
  onStartButtonClick();
}

/* -------------------- ランキング登録時処理 -------------------- */
function rank_push() {
  //登録名取得
  username = document.ranking.username.value;
  //ランキング登録処理
  if (username.match(/"/) || username.match(/'/)) {

  } else {
    mode = "1";
    $.ajax({
      type: 'POST',
      url: 'rank_push.php',
      data: {
        'name': username,
        'score': score,
        'count': downcount,
        'miss': missCount,
        'mode': mode,
        'difficulty': difficulty_check
      },
      success: function(data) {
        console.log('登録成功');
      }
    });
  }
}

/* -------------------- 入力文字変換処理 -------------------- */
function moziHenkan(e) {
  data = new Array(16);
  data[0] = jword;
  data[1] = word;
  data[2] = tableichi;
  data[3] = ichi;
  data[4] = inputtype;
  data[5] = nyuuryoku;
  data[6] = "";
  data[7] = seikaisuu;
  data[8] = missCount;
  data[9] = wordseikaisuu;
  data[10] = henkan;
  data[11] = ro_ma;
  data[12] = keysettei;
  data[13] = shiftdown;
  data[14] = keydowntable1;
  data[15] = keydowntable2;

  //正解判定する為にタイプ判定前の正解数を保持
  var tempseikai = seikaisuu;

  //入力方法自動判別関数呼び出し、引数にはeと先ほど作ったdata配列を渡す。
  townmojiretuhenkan(e, data);

  //配列データを個々のデータに入れ直す
  jword = data[0];
  word = data[1];
  tableichi = data[2];
  ichi = data[3];
  inputtype = data[4];
  nyuuryoku = data[5];
  nowtype = data[6];
  seikaisuu = data[7];
  missCount = data[8];
  wordseikaisuu = data[9];
  henkan = data[10];
  townro_machange
  ro_ma = data[11];
  shiftdown = data[13];

  //ゲーム中かつ制限時間内か判定
  if (game_flag == 1 && timeCount >= 0) {
    //正当入力時処理
    if (seikaisuu != tempseikai) {
      hantei();
    //ミス入力時処理
    } else {
      gauge = 0;
      missCount++;
    }
  }
}

/* -------------------- 正当文字入力時処理 -------------------- */
function hantei() {
  //ゲーム中か判定
  if (game_flag == 1) {
    //スコアカウントアップ
    score = score + 3;
    //スコア表示
    score_area.textContent = ('000' + score).slice(-4);
    //文字先頭位置カウントアップ
    charIndex++;

    typeArea.textContent = typeArea.textContent + inputtype;
    textColor1 = ro_ma.substring(0, charIndex);
    textColor2 = ro_ma.substring(charIndex, ro_ma.length);
    //入力前の文字を表示
    typeArea.textContent = textColor1;
    //入力後の文字を表示
    typeArea2.textContent = textColor2;

    //ノーミスカウントアップ
    gauge = gauge + 0.5;

    //全文字打鍵時処理
    if (tableichi >= word.length) {
      score = score + (word.length * 8);
      score_area.textContent = ('000' + score).slice(-4);
      downcount++;
      //0.2秒間空白文字を表示してから次の文字を表示する。
      textColor1 = "　";
      textColor2 = "　";
      wordArea_hiragana.textContent = "";
      wordArea_jp.textContent = "　"
      typeArea.textContent = textColor1;
      typeArea2.textContent = textColor2;
      setTimeout("nextWord();", 200);
    }
  }
}

/* -------------------- シフトキー入力チェック -------------------- */
document.onkeyup = function(e) {
  var temp;
  if ((temp = towncheckshift(e)) === 0) {
    shiftdown = 0;
  }
}

/* -------------------- キー入力チェック -------------------- */
document.onkeydown = function(e) {
  var keyStr;

  if (e.keyCode == 32) {
    if (space_flag == 1) {
      space_start();
    }
  } else if (e.keyCode == 27) {
    if (game_flag == 1) {
      setTimeout(esc(), 1010);
    }
  } else {
    if (game_flag == 1) {
      moziHenkan(e);
    }
  }
}
