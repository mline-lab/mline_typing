/* -------------------- common定数 -------------------- */
//プレイ中
const NOWPLAY      = 1;
//非プレイ
const STOPPLAY     = 0;
//許可
const ENABLE       = 1;
//禁止
const DISABLE      = 0;
//タイムアップ
const TIMEUP       = 0;
//1秒タイムアウト
const TIMEOUT_1SEC = 1000;
//0クリア値
const SET_CLR      = 0;
//正当１字スコアアップ値
const CHAR_SCORE   = 3;
//単語スコアアップ
const WORD_SCORE   = 8;

/* -------------------- 設定用定数 -------------------- */
// 制限時間設定用定数
const TIMELIMIT      = 10;
//ゲーム開始カウントダウン設定用定数
// -2の数値がカウントされる。
const GAMESTARTCOUNT = 5;

/* -------------------- 状態遷移定数 -------------------- */
const TYPING_LOAD       = 0;
const TYPING_WAIT       = 1;
const TYPING_GAMEREADY  = 2;
const TYPING_STARTWAIT  = 3
const TYPING_GAMEPLAY   = 4;
const TYPING_GAMEFINISH = 5;

/* -------------------- 状態遷移変数 -------------------- */
var typingStatus;

/* -------------------- フラグ用変数 -------------------- */
//ゲーム中フラグ
// ゲーム中:1 非ゲーム中:0
var game_flag;
//スペースキー打鍵許可フラグ
//許可:1 禁止:0
var space_flag;

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

/* -------------------- ページロード時処理 -------------------- */
window.onload = function()
{
    console.log('ページロード時処理');
    load();
}

function load()
{
    startButton = document.getElementById("start_button");
    messageArea = document.getElementById("message");
    wordArea_jp = document.getElementById("word_jp");
    wordArea_hiragana = document.getElementById("word_hiragana");
    typeArea = document.getElementById("type_Before");
    typeArea2 = document.getElementById("type_After");
    time_area = document.getElementById("time_area");
    score_area = document.getElementById("score_area");

    init();

    //出題文字列CSV取得
    getCSV_jp_File();
    getCSV_hira_File();
}

/* -------------------- 初期化処理 -------------------- */
function init()
{
    console.log('初期化処理');
    //非ゲーム中
    game_flag = STOPPLAY;
    //スペースキー打鍵禁止
    space_flag = DISABLE;
    //タイマプリセット
    timer1Sec = SET_CLR;
    //ゲームスタートカウント初期化
    startcount = GAMESTARTCOUNT;
    //ゲーム制限時間セット
    timeCount = TIMELIMIT;
    //スコアクリア
    score = SET_CLR;
    //ミスカウントクリア
    missCount = SET_CLR;
    //打ち切った数クリア
    downcount = SET_CLR;
    //ノーミスゲージクリア
    gauge = SET_CLR;
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
    //スタートボタン表示
    startButton.style.visibility = "visible";
    //メッセージエリア文字列クリア
    messageArea.textContent = "";
}

/* -------------------- スタート前初期化時処理 -------------------- */
function setContent()
{
    console.log('スタート前初期化時処理');
    //タイマプリセット
    timer1Sec = SET_CLR;
    //ゲームスタートカウント初期化
    startcount = GAMESTARTCOUNT;
    //ゲーム制限時間セット
    timeCount = TIMELIMIT;
    //スコアクリア
    score = SET_CLR;
    //ミスカウントクリア
    missCount = SET_CLR;
    //打ち切った数クリア
    downcount = SET_CLR;
    //ノーミスゲージクリア
    gauge = SET_CLR;
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
    //スタートボタン表示
    startButton.style.visibility = "hidden";
    //メッセージエリア文字列クリア
    messageArea.textContent = "スペースボタンでスタート";
}

/* -------------------- スタートボタンクリック時処理 -------------------- */
function onStartButtonClick()
{
    console.log('スタートボタンクリック時処理');
    //スタート前初期化時処理
    setContent();
    //スペースキー打鍵許可
    spaceKey_enable();
}

/* -------------------- スペースキー打鍵時処理 -------------------- */
function space_start()
{
    console.log('スペースキー打鍵時処理');
    if (game_flag != NOWPLAY)
    {
        //ゲーム中フラグ
        gameFlg_nowPlay();
        //スペースキー打鍵禁止
        spaceKey_disable();
        //スペースキー打鍵後処理
        startCount();
    }
}

/* -------------------- スペースキー打鍵後処理 -------------------- */
function startCount()
{
    console.log('redyカウントダウン');
    //カウントダウン
    startcount--;
    //Redy表示
    if (startcount == 4)
    {
        messageArea.textContent = "Ready...";
        setTimeout("startCount()", TIMEOUT_1SEC);
    //ゲームスタート
    }
    else if (startcount == 0)
    {
        messageArea.textContent = "GO!";
        startTyping();
    //カウントダウン
    }
    else
    {
        messageArea.textContent = startcount;
        setTimeout("startCount()", TIMEOUT_1SEC);
    }
}

/* -------------------- ゲームスタート処理 -------------------- */
function startTyping()
{
    console.log('ゲームスタート処理');
    //出題文字列表示
    nextWord();
    //カウントダウン開始
    countDown();
    timer1Sec = setInterval("countDown()", TIMEOUT_1SEC);
}
  

/* -------------------- 出題表示処理 -------------------- */
function nextWord()
{
    console.log('出題表示処理');
    if (timeCount >= TIMEUP)
    {
        //タイピング処理用変数クリア
        tableichi = SET_CLR;
        ichi = SET_CLR;
        inputtype = "";
        nyuuryoku = "";
        nowtype = "";
        //文字先頭位置クリア
        charIndex = SET_CLR;
        //リストからランダムに文字列取得
        var random = Math.floor(Math.random() * (wordList_hiragana.length - 1));
        //画面へ表示
        wordArea_hiragana.textContent = wordList_hiragana[random];
        wordArea_jp.textContent = wordList_jp[random];
        //ひらがなを変換
        worddata = ro_machange(wordList_hiragana[random], henkan);
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
    console.log('制限時間カウントダウン');
    if (game_flag == NOWPLAY)
    {
        if (timeCount == TIMEUP)
        {
            //ゲーム終了処理
            stopTyping();
        }
        else
        {
            //カウントダウン
            time_area.textContent = timeCount + " sec.";
            timeCount--;
        }
    }
}
  

/* -------------------- commonfunc -------------------- */

/* -------------------- 出題文字列取得処理 -------------------- */
function getCSV_jp_File()
{
    console.log('出題文字列取得処理');
    var xhr = new XMLHttpRequest();
    xhr.open("get", "csv/word.csv", true);
    xhr.send(null);
    xhr.onload = function() {
    wordList_jp = xhr.responseText.split(";");
    };
}
  
/* -------------------- 出題文字列ふりがな取得処理 -------------------- */
function getCSV_hira_File()
{
    console.log('出題文字列ふりがな取得処理');
    var xhr2 = new XMLHttpRequest();
    xhr2.open("get", "csv/word_hiragana.csv", true);
    xhr2.send(null);
    xhr2.onload = function() {
    wordList_hiragana = xhr2.responseText.split(";");
    };
}

/* -------------------- ゲーム終了処理 -------------------- */
function stopTyping()
{
    console.log('ゲーム終了処理');
    //カウントストップ
    clearInterval(timer1Sec);
    //ゲーム中フラグOFF
    gameFlg_stopPlay();
  
    typeArea.textContent = "";
    typeArea2.textContent = "";
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent = "タイムアップ";
    time_area.textContent = "TIMEUP";
  
    //ストップ処理遷移待ちタイムアウト
    setTimeout("stop_refresh()", TIMEOUT_1SEC);
}
  
/* -------------------- ゲーム終了時処理 -------------------- */
function stop_refresh()
{
    console.log('ゲーム終了時処理');
    //成績表示
    messageArea.textContent = "Score: " + score + "■倒した数" + downcount + "■ミスタイプ数" + missCount;
    //入力文字表示クリア
    typeArea.textContent = "";
    typeArea2.textContent = "";
    //出題文字表示クリア
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent = "";
    //スタートボタン表示
    startButton.style.visibility = "visible";
}
  
/* -------------------- ESCキーゲーム中断時処理 -------------------- */
function esc()
{
    console.log('ESCキーゲーム中断時処理');
    //カウントストップ
    clearInterval(timer1Sec);
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
function rank_push()
{
    console.log('ランキング登録時処理');
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
function moziHenkan(e)
{
    console.log('入力文字変換処理');
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
    mojiretuhenkan(e, data);
  
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
    ro_ma = data[11];
    keysettei = data[12];
    shiftdown = data[13];
    keydowntable1 = data[14];
    keydowntable2 = data[15];
  
    //ゲーム中かつ制限時間内か判定
    if (game_flag == NOWPLAY && timeCount >= TIMEUP) {
      //正当入力時処理
      if (seikaisuu != tempseikai) {
        hantei();
      //ミス入力時処理
      } else {
        gauge = SET_CLR;
        missCount++;
      }
    }
}
  
/* -------------------- 正当文字入力時処理 -------------------- */
function hantei()
{
    console.log('正当文字入力時処理');
    //ゲーム中か判定
    if (game_flag == NOWPLAY)
    {
      //スコアカウントアップ
      score = score + CHAR_SCORE;
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
      if (tableichi >= word.length)
      {
        score = score + (word.length * WORD_SCORE);
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
document.onkeyup = function(e)
{
    console.log('シフトキー入力チェック');
    var temp;
    if ((temp = checkshift(e)) === 0)
    {
        shiftdown = SET_CLR;
    }
}
  
/* -------------------- キー入力チェック -------------------- */
document.onkeydown = function(e)
{
    console.log('キー入力チェック');
    var keyStr;

    if (e.keyCode == 32)
    {
        if (space_flag == ENABLE)
        {
            space_start();
        }
    }
    else if (e.keyCode == 27)
    {
        if (game_flag == NOWPLAY)
        {
        game_flag = STOPPLAY;
            esc();
        }
    }
    else
    {
        if (game_flag == NOWPLAY)
        {
            moziHenkan(e);
        }
    }
}
  

/* -------------------- ゲームプレイ中 -------------------- */
function gameFlg_nowPlay()
{
    console.log('ゲームプレイ中');
    game_flag = NOWPLAY;
}

/* -------------------- ゲーム非プレイ中 -------------------- */
function gameFlg_stopPlay()
{
    console.log('ゲーム非プレイ中');
    game_flag = STOPPLAY;
}

/* -------------------- スペースキー打鍵許可 -------------------- */
function spaceKey_enable()
{
    console.log('スペースキー打鍵許可');
    space_flag = ENABLE;
}

/* -------------------- スペースキー打鍵禁止 -------------------- */
function spaceKey_disable()
{
    console.log('スペースキー打鍵禁止');
    space_flag = DISABLE;
}