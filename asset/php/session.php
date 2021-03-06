<?php
    echo "スコア:".$score."</br>";
    echo "単語数:".$count."</br>";
    echo "ミス数:".$miss."</br>";

    //暗号化関数
    include('encryption.php');
    
    //score暗号化
    $en_score = reqEncDec( $score, $encMode);
    //count暗号化
    $en_count = reqEncDec( $count, $encMode);
    //miss暗号化
    $en_miss  = reqEncDec( $miss, $encMode);

    //セッションスタート
    session_start();

    session_regenerate_id(true);

    //セッションキー設定ファイル
    include('session_key.php');

    //変数をセッションに登録
    $_SESSION[$key_score] = $en_score;
    $_SESSION[$key_count] = $en_count;
    $_SESSION[$key_miss]  = $en_miss;
?>