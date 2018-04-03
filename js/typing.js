/* ------------------------------- common定数 ------------------------------- */
const NOWPLAY        = 1;       /* プレイ中                                   */
const STOPPLAY       = 0;       /* 非プレイ中                                 */
const ENABLE         = 1;       /* 許可                                       */
const DISABLE        = 0;       /* 禁止                                       */
const TIMEUP         = 0;       /* タイムアップ時間                           */
const TIMEOUT_1SEC   = 1000;    /* 1秒タイムアウト                            */
const SET_CLR        = 0;       /* クリア値                                   */
const GAMESTARTCOUNT = 5;       /* スタートカウントダウン                     */

/* ---------------------------- ゲーム設定用定数 ---------------------------- */
const CHAR_SCORE     = 3;       /* 一文字毎のスコアアップ値                   */
const WORD_SCORE     = 8;       /* 単語毎のスコアアップ値                     */
const TIMELIMIT      = 10;      /* 制限時間                                   */

/* ------------------------------ フラグ用定数 ------------------------------ */
/* ゲーム中フラグ */
var game_flag;                  /* ゲーム中:NOWPLAY 非ゲーム中:STOPPLAY       */

/* スペースキー打鍵許可フラグ */
var space_flag;                 /* 許可:ENABLE 禁止:DISABLE                   */

/* ---------------------------- 出題文字列用変数 ---------------------------- */
//3要素の配列。0番目に『文全体のローマ字』、
//1番目に『ひらがなを単語毎に配列に入れたもの』、
//2番目に『ローマ字を単語毎に配列に入れたもの』が入る
var worddata;
var wordChars;                          /* 出題文字列                         */
var charIndex;                          /* 文字インデックス                   */
var typeArea;                           /* 未入力文字ID                       */
var textColor1;                         /* 未入力文字                         */
var typeArea2;                          /* 入力済み文字ID                     */
var textColor2;                         /* 入力済み文字                       */
var wordList_jp = new Array();          /* 出題文字列                         */
var wordList_hiragana = new Array();    /* 出題文字列ふりがな                 */

/* -------------------------- ゲーム中カウント変数 -------------------------- */
var timer1Sec;                          /* １秒カウント用タイマー             */
var startcount;                         /* ゲーム開始までのカウントダウン     */
var timeCount;                          /* 制限時間カウンター                 */
var missCount;                          /* ミス数カウンター                   */
var score;                              /* スコアカウンター                   */
var downcount;                          /* 打ち切った単語数                   */
var gauge;                              /* ノーミスゲージ                     */

/* ------------------------------- 送信用変数 ------------------------------- */
var username;                           /* ランキング登録ネーム               */
var postObj;                            /* ポスト用変数                       */
var dummy_1;                            /* dummy1                             */
var dummy_2;                            /* dummy2                             */
var dummy_3;                            /* dummy3                             */

/* 送信用セットデータ */
var setData = [ "jskey_score",
        "jskey_downcount",
        "jskey_misscount",
        "yvycc1exry378vzi6k3dsku3nvufc6jzj2tz6ju6l7yyxc60jclhd55mys4xm3uq7pdd60d8hw48mqfkoposgq",
        "ztb0ubhatdarkngezuhvz8qr66wysyhf9g8qc9vqct1dzwidbl7azx0vqspuo8dyprwlvbqsy49vzjswvsjvh8",
        "lwuec6xfgpsr3whw3o7pn5dkhsdycm47ytjel6e6hgd7qne3dswthai2epd6y63m5zqe6bcoee04g34mbphp3m"
       ];

/* データ送信用配列 */
var postData = new Array();

/* --------------------------- ゲーム画面表示変数 --------------------------- */
var messageArea;                        /* メッセージエリア表示文字           */

/*============================================================================*/
/* ページロード時処理                                                         */
/*============================================================================*/
window.onload = function () {
    console.log('ページロード時処理');
    /* HTML要素取得処理 */
    htmlElementGet();
    /* 初期化処理 */
    init();
    /* 出題文字列CSV取得 */
    getCSV_jp_File();
    getCSV_hira_File();
}

/*============================================================================*/
/* HTML要素取得処理                                                           */
/*============================================================================*/
function htmlElementGet() {
    startButton       = document.getElementById("start_button");
    messageArea       = document.getElementById("message");
    wordArea_jp       = document.getElementById("word_jp");
    wordArea_hiragana = document.getElementById("word_hiragana");
    typeArea          = document.getElementById("type_Before");
    typeArea2         = document.getElementById("type_After");
    time_area         = document.getElementById("time_area");
    score_area        = document.getElementById("score_area");
}

/*============================================================================*/
/* 初期化処理                                                                 */
/*============================================================================*/
function init() {
    console.log('初期化処理');
    /* 非ゲーム中 */
    game_flag = STOPPLAY;
    /* スペースキー打鍵禁止 */
    space_flag = DISABLE;
    /* タイマプリセット */
    timer1Sec = SET_CLR;
    /* ゲームスタートカウント初期化 */
    startcount = GAMESTARTCOUNT;
    /* ゲーム制限時間セット */
    timeCount = TIMELIMIT;
    /* スコアクリア */
    score = SET_CLR;
    /* ミスカウントクリア */
    missCount = SET_CLR;
    /* 打ち切った数クリア */
    downcount = SET_CLR;
    /* ノーミスゲージクリア */
    gauge = SET_CLR;
    /* 出題文字列クリア */
    wordChars = [];
    /* スコア表示クリア */
    score_area.textContent = "0000";
    /* 入力文字クリア */
    typeArea.textContent  = "";
    typeArea2.textContent = "";
    /* 出題文字クリア */
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent       = "";
    /* スタートボタン表示 */
    startButton.style.visibility = "visible";
    /* メッセージエリア文字列クリア */
    messageArea.textContent = "";
}

/*============================================================================*/
/* スタート前初期化時処理                                                     */
/*============================================================================*/
function setContent() {
    console.log('スタート前初期化時処理');
    /* タイマプリセット */
    timer1Sec = SET_CLR;
    /* ゲームスタートカウント初期化 */
    startcount = GAMESTARTCOUNT;
    /* ゲーム制限時間セット */
    timeCount = TIMELIMIT;
    /* スコアクリア */
    score = SET_CLR;
    /* ミスカウントクリア */
    missCount = SET_CLR;
    /* 打ち切った数クリア */
    downcount = SET_CLR;
    /* ノーミスゲージクリア */
    gauge = SET_CLR;
    /* 出題文字列クリア */
    wordChars = [];
    /* スコア表示クリア */
    score_area.textContent = "0000";
    /* 入力文字クリア */
    typeArea.textContent  = "";
    typeArea2.textContent = "";
    /* 出題文字クリア */
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent       = "";
    /* スタートボタン表示 */
    startButton.style.visibility = "hidden";
    /* メッセージエリア文字列クリア */
    messageArea.textContent = "スペースボタンでスタート";
}
/*============================================================================*/
/* スタートボタンクリック時処理                                               */
/*============================================================================*/
function onStartButtonClick() {
    console.log('スタートボタンクリック時処理');
    /* ゲーム中に動作しないようガード処理 */
    if (game_flag != NOWPLAY) {
        /* スタート前初期化時処理 */
        setContent();
        /* ゲーム中フラグON */
        gameFlg_nowPlay();
        /* スペースキー打鍵許可 */
        spaceKey_enable();
    }
}

/*============================================================================*/
/* スペースキー打鍵時処理                                                     */
/*============================================================================*/
function space_start() {
    console.log('スペースキー打鍵時処理');
    /* ゲーム中に動作しないようガード処理 */
    if (space_flag == ENABLE) {
        /* スペースキー打鍵禁止 */
        spaceKey_disable();
        /* カウントダウ処理 */
        startCountdown();
    }
}

/*============================================================================*/
/* カウントダウ処理                                                           */
/*============================================================================*/
function startCountdown() {
    /* カウントダウン */
    startcount--;
    /* Redy表示 */
    if (startcount == 4) {
        console.log('開始カウントダウン:Ready');
        messageArea.textContent = "Ready...";
        setTimeout("startCountdown()", TIMEOUT_1SEC);
    /* ゲームスタート */
    } else if (startcount == 0) {
        console.log('開始カウントダウン:GO!');
        messageArea.textContent = "GO!";
        /* ゲームスタート処理 */
        startTyping();
    /* カウントダウン */
    } else {
        console.log('開始カウントダウン:' + startcount);
        messageArea.textContent = startcount;
        setTimeout("startCountdown()", TIMEOUT_1SEC);
    }
}

/*============================================================================*/
/* ゲームスタート処理                                                         */
/*============================================================================*/
function startTyping() {
    console.log('ゲームスタート処理');
    /* 出題文字列表示処理 */
    nextWord();
    /* 制限時間カウントダウン処理 */
    countDown();
    /* 1秒後に制限時間カウントダウン処理 */
    timer1Sec = setInterval("countDown()", TIMEOUT_1SEC);
}


/*============================================================================*/
/* 出題文字列表示処理                                                         */
/*============================================================================*/
function nextWord() {
    console.log('出題文字列表示処理');
    if (timeCount >= TIMEUP) {
        /* タイピング処理用変数クリア */
        tableichi = SET_CLR;
        ichi      = SET_CLR;
        inputtype = "";
        nyuuryoku = "";
        nowtype   = "";
        /* 文字先頭位置クリア */
        charIndex = SET_CLR;

        /* リストからランダムに文字列取得 */
        var random = Math.floor(Math.random() * (wordList_hiragana.length - 1));
        /* 画面へ表示 */
        wordArea_hiragana.textContent = wordList_hiragana[random];
        wordArea_jp.textContent       = wordList_jp[random];
        /* ひらがなを変換 */
        worddata = ro_machange(wordList_hiragana[random], henkan);
        ro_ma    = worddata[0];
        jword    = worddata[1];
        word     = worddata[2];

        /* 入力欄をクリア */
        typeArea.textContent = "";
        wordChars            = ro_ma.toUpperCase().split('');
        textColor2           = ro_ma;
        /* 未入力欄に表示 */
        typeArea2.textContent = textColor2;
    }
}

/*============================================================================*/
/* 制限時間カウントダウン処理                                                 */
/*============================================================================*/
function countDown() {
    console.log('制限時間カウントダウン処理:' + timeCount);
    /* ゲーム中のみ動作するようガード処理 */
    if (game_flag == NOWPLAY) {
        /* タイムアップ */
        if (timeCount == TIMEUP) {
            /* ゲーム終了処理 */
            stopTyping();
        /* カウントダウン */
        } else {
            time_area.textContent = timeCount + " sec.";
            timeCount--;
        }
    }
}

/*============================================================================*/
/* ゲーム終了処理                                                             */
/*============================================================================*/
function stopTyping() {
    console.log('ゲーム終了処理');
    /* カウントストップ */
    clearInterval(timer1Sec);
    /* ゲーム中フラグOFF */
    gameFlg_stopPlay();

    typeArea.textContent          = "";
    typeArea2.textContent         = "";
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent       = "タイムアップ";
    time_area.textContent         = "TIMEUP";

    /* 1秒後にリザルト表示処理 */
    setTimeout("game_result()", TIMEOUT_1SEC);
}

/*============================================================================*/
/* リザルト表示処理                                                           */
/*============================================================================*/
function game_result() {
    console.log('リザルト表示処理');
    /* 成績表示 */
    messageArea.textContent = "Score: " + score + "■倒した数" + downcount + "■ミスタイプ数" + missCount;
    /* 入力文字表示クリア */
    typeArea.textContent  = "";
    typeArea2.textContent = "";
    /* 出題文字表示クリア */
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent       = "";
    /* スタートボタン表示 */
    startButton.style.visibility = "visible";
}

/*============================================================================*/
/* ランキング登録処理                                                         */
/*============================================================================*/
function regRanking() {
    //ランキング登録画面表示
    dummy_1 = score.toString(2);
    dummy_2 = downcount.toString(2);
    dummy_3 = missCount.toString(2);
    postData.push(score, downcount, missCount, dummy_1, dummy_2, dummy_3);
    /*  */
    popPostJump("./rankingAdd.html", "ランキング登録", setData, postData);
}

/* --------------------------- その他呼び出し処理 --------------------------- */
/*============================================================================*/
/* 出題文字列取得処理                                                         */
/*============================================================================*/
function getCSV_jp_File() {
    console.log('出題文字列取得処理');
    var xhr = new XMLHttpRequest();
    xhr.open("get", "csv/word.csv", true);
    xhr.send(null);
    xhr.onload = function () {
        wordList_jp = xhr.responseText.split(";");
    };
}

/*============================================================================*/
/* 出題文字列ふりがな取得処理                                                 */
/*============================================================================*/
function getCSV_hira_File() {
    console.log('出題文字列ふりがな取得処理');
    var xhr2 = new XMLHttpRequest();
    xhr2.open("get", "csv/word_hiragana.csv", true);
    xhr2.send(null);
    xhr2.onload = function () {
        wordList_hiragana = xhr2.responseText.split(";");
    };
}

/*============================================================================*/
/* ランキング登録画面ポップアップ処理                                         */
/*============================================================================*/
function popPostJump(_url, _win, _keys, _vals) {
    $('#postjump').remove();
    if ((postObj) && (!postObj.closed)) {
        postObj.close();
    }

    var wH = cman_calH("DISP", "2");        /* 高さ1/2の計算         */
    var wW = cman_calW("DISP", "2");        /* 横幅1/2の計算         */
    var wT = cman_calT("DISP", "CC", wH);   /* モニター中央 Top計算  */
    var wL = cman_calL("DISP", "CC", wW);   /* モニター中央 Left計算 */
    var wOption = "top=" + wT + ", left=" + wL + ", height=" + wH + ", width=" + wW + ", menubar=no" + ", toolbar=no" + ", location=no" + ", status=no" + ", resizable=no" + ", directories=no";

    postObj = window.open("about:blank", _win, wOption);
    var html = '<form method="post" action="' + _url + '" id="postjump" target="' + _win + '" style="display: none;">';
    for (var cnt = 0; cnt < _keys.length; cnt++) {
        html += '<input type="hidden" name="' + _keys[cnt] + '" value="' + _vals[cnt] + '" >';
    }

    html += '</form>';
    $("body").append(html);
    $('#postjump').submit();
    $('#postjump').remove();
}

/* --------------------------- キーボード関連処理 --------------------------- */
/*============================================================================*/
/* 入力文字変換処理                                                           */
/*============================================================================*/
function moziHenkan(e) {
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

    /* 正解判定する為にタイプ判定前の正解数を保持 */
    var tempseikai = seikaisuu;

    /* 入力方法自動判別関数呼び出し、引数にはeと先ほど作ったdata配列を渡す。 */
    mojiretuhenkan(e, data);

    /* 配列データを個々のデータに入れ直す */
    jword         = data[0];
    word          = data[1];
    tableichi     = data[2];
    ichi          = data[3];
    inputtype     = data[4];
    nyuuryoku     = data[5];
    nowtype       = data[6];
    seikaisuu     = data[7];
    missCount     = data[8];
    wordseikaisuu = data[9];
    henkan        = data[10];
    ro_ma         = data[11];
    keysettei     = data[12];
    shiftdown     = data[13];
    keydowntable1 = data[14];
    keydowntable2 = data[15];

    /*ゲーム中かつ制限時間内か判定 */
    if (game_flag == NOWPLAY && timeCount >= TIMEUP) {
        /* 正当入力時処理 */
        if (seikaisuu != tempseikai) {
            hantei();
        /* ミス入力時処理 */
        } else {
            gauge = SET_CLR;
        }
    }
}

/*============================================================================*/
/* 正当文字入力時処理                                                         */
/*============================================================================*/
function hantei() {
    console.log('正当文字入力時処理');
    /* ゲーム中か判定 */
    if (game_flag == NOWPLAY) {
        /* スコアカウントアップ */
        score = score + CHAR_SCORE;
        /* スコア表示 */
        score_area.textContent = ('000' + score).slice(-4);
        /* 文字先頭位置カウントアップ */
        charIndex++;

        typeArea.textContent = typeArea.textContent + inputtype;
        textColor1 = ro_ma.substring(0, charIndex);
        textColor2 = ro_ma.substring(charIndex, ro_ma.length);
        /* 入力前の文字を表示 */
        typeArea.textContent = textColor1;
        /* 入力後の文字を表示 */
        typeArea2.textContent = textColor2;

        /* ノーミスカウントアップ */
        gauge = gauge + 0.5;

        /* 全文字打鍵時処理 */
        if (tableichi >= word.length) {
            score = score + (word.length * WORD_SCORE);
            score_area.textContent = ('000' + score).slice(-4);
            downcount++;
            /* 0.2秒間空白文字を表示してから次の文字を表示する。 */
            textColor1 = "　";
            textColor2 = "　";
            wordArea_hiragana.textContent = "";
            wordArea_jp.textContent       = "　"
            typeArea.textContent          = textColor1;
            typeArea2.textContent         = textColor2;
            setTimeout("nextWord();", 200);
        }
    }
}

/*============================================================================*/
/* ESCキーゲーム中断時処理                                                    */
/*============================================================================*/
function esc() {
    console.log('ESCキーゲーム中断時処理');
    /* カウントストップ */
    clearInterval(timer1Sec);
    /* 入力文字表示クリア */
    typeArea.textContent  = "";
    typeArea2.textContent = "";
    /* 出題文字表示クリア */
    wordArea_hiragana.textContent = "";
    wordArea_jp.textContent       = "";
    /* スタートボタンクリック時処理 */
    onStartButtonClick();
}

/*============================================================================*/
/* シフトキー入力チェック処理                                                 */
/*============================================================================*/
document.onkeyup = function (e) {
    console.log('シフトキー入力チェック');
    var temp;
    if ((temp = checkshift(e)) === 0) {
        shiftdown = SET_CLR;
    }
}

/*============================================================================*/
/* キー入力チェック処理                                                       */
/*============================================================================*/
document.onkeydown = function (e) {
    console.log('キー入力チェック');
    /* スペースキー */
    if (e.keyCode == 32) {
        /* スペースキー打鍵許可時のみ */
        if (space_flag == ENABLE) {
            /* スペースキー打鍵時処理 */
            space_start();
        }
    /* ESC */
    } else if (e.keyCode == 27) {
        /* ゲームプレイ中のみ */
        if (game_flag == NOWPLAY) {
            /* ゲーム非プレイ中 */
            gameFlg_stopPlay();
            /*  ESCキーゲーム中断時処理 */
            esc();
        }
    /* その他 */
    } else {
        /* ゲームプレイ中のみ */
        if (game_flag == NOWPLAY) {
            /* 入力文字変換処理 */
            moziHenkan(e);
        }
    }
}

/*============================================================================*/
/* ゲームプレイ中                                                             */
/*============================================================================*/
function gameFlg_nowPlay() {
    console.log('ゲームプレイ中');
    game_flag = NOWPLAY;
}

/*============================================================================*/
/* ゲーム非プレイ中                                                           */
/*============================================================================*/
function gameFlg_stopPlay() {
    console.log('ゲーム非プレイ中');
    game_flag = STOPPLAY;
}

/*============================================================================*/
/* スペースキー打鍵許可                                                       */
/*============================================================================*/
function spaceKey_enable() {
    console.log('スペースキー打鍵許可');
    space_flag = ENABLE;
}

/*============================================================================*/
/* スペースキー打鍵禁止                                                       */
/*============================================================================*/
function spaceKey_disable() {
    console.log('スペースキー打鍵禁止');
    space_flag = DISABLE;
}

/* ------------------------- ポップアップ用汎用関数 ------------------------- */

//
/*============================================================================*/
/* 開く画面の高さ計算処理（px値でreturn）                                     */
/*============================================================================*/
function cman_calH(argDispOrHtml, argSize) {
    var wH = argDispOrHtml == "HTML" ? document.documentElement.clientHeight : screen.availHeight;
    if (!wH) {
        return 100;
    }
    switch (argSize) {
    case "1":
        break;
    case "2":
        wH = Math.floor(wH / 2);
        break;
    case "3":
        wH = Math.floor(wH / 3);
        break;
    case "4":
        wH = Math.floor(wH / 4);
        break;
    default:
        wH = 100;
        break;
    }
    if (wH < 100) {
        return 100;
    } else {
        return wH;
    }
}

/*============================================================================*/
/* 開く画面の横幅計算処理（px値でreturn）                                     */
/*============================================================================*/
function cman_calW(argDispOrHtml, argSize) {
    var wW = argDispOrHtml == "HTML" ? document.documentElement.clientWidth : screen.availWidth;
    if (!wW) {
        return 100;
    }
    switch (argSize) {
    case "1":
        break;
    case "2":
        wW = Math.floor(wW / 2);
        break;
    case "3":
        wW = Math.floor(wW / 3);
        break;
    case "4":
        wW = Math.floor(wW / 4);
        break;
    default:
        wW = 100;
        break;
    }
    if (wW < 100) {
        return 100;
    } else {
        return wW;
    }
}

/*============================================================================*/
/* 開く画面の開始縦位置を計算処理（px値でreturn）                             */
/*============================================================================*/
function cman_calT(argDispOrHtml, argPos, argHeight) {
    var wBaseT = 0;
    if (argDispOrHtml == "HTML") {
        wBaseT = document.body.scrollTop;
        if (!wBaseT) {
            wBaseT = 0;
        }
    }
    var wH = argDispOrHtml == "HTML" ? document.documentElement.clientHeight : screen.availHeight;
    if (!wH) {
        wH = 0;
    }
    var wTop = 0;
    switch (argPos) {
    case "CC":
        wTop = Math.floor((wH - argHeight) / 2) + wBaseT;
        break;
    case "LT":
        wTop = wBaseT;
        break;
    case "RT":
        wTop = wBaseT;
        break;
    case "RB":
        wTop = Math.floor(wH - argHeight) + wBaseT;
        break;
    case "LB":
        wTop = Math.floor(wH - argHeight) + wBaseT;
        break;
    }
    if (wTop < 0) {
        return 0;
    } else {
        return wTop;
    }
}

/*============================================================================*/
/* 開く画面の開始横位置を計算処理（px値でreturn）                             */
/*============================================================================*/
function cman_calL(argDispOrHtml, argPos, argWidth) {
    var wBaseL = 0;
    if (argDispOrHtml == "HTML") {
        wBaseL = window.screenX || window.screenLeft;
        if (!wBaseL) {
            wBaseL = 0;
        }
    }
    var wW = argDispOrHtml == "HTML" ? document.documentElement.clientWidth : screen.availWidth;
    if (!wW) {
        wW = 0;
    }
    var wLeft = 0;
    switch (argPos) {
    case "CC":
        wLeft = Math.floor((wW - argWidth) / 2) + wBaseL;
        break;
    case "LT":
        wLeft = wBaseL;
        break;
    case "RT":
        wLeft = Math.floor(wW - argWidth) + wBaseL;
        break;
    case "RB":
        wLeft = Math.floor(wW - argWidth) + wBaseL;
        break;
    case "LB":
        wLeft = wBaseL;
        break;
    }
    if (wLeft < 0) {
        return 0;
    } else {
        return wLeft;
    }
}
