<?php
    //セッションスタート
    session_start();

    //セッションキー設定ファイル
    include('/asset/php/session_key.php');    

    $score = $_SESSION[$key_score ];
    $count = $_SESSION[$key_count];
    $miss  = $_SESSION[$key_miss];

    //セッションデータ破棄
    session_destroy ();

    //暗号化関数
    include('/asset/php/encryption.php');

    //score復号化
    $en_score = reqEncDec( $score, $decMode);
    //count復号化
    $en_count = reqEncDec( $count, $decMode);
    //miss復号化
    $en_miss  = reqEncDec( $miss, $decMode);

    $name = htmlspecialchars($_POST['username'], ENT_QUOTES, 'UTF-8');
    if ($name == "") {
        $name = "名無し";
    } elseif (strpos($name,'script&') !== false) {
        $name = "このサイトに攻撃を仕掛けた愚か者";
    }

    echo "スコア:".$en_score."</br>";
    echo "単語数:".$en_count."</br>";
    echo "ミス数:".$en_miss."</br>";
    echo "名前：".$name;

    try
    {
        $pdo = new PDO('mysql:host=localhost;dbname=typing;charset=utf8','mline','manaki079');

        //エラーをスロー
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo -> prepare("INSERT INTO score (name, score, count, miss, mode) VALUES (:name, :score, :count, :miss, :mode)");
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':score', $en_score, PDO::PARAM_INT);
        $stmt->bindParam(':count', $en_count, PDO::PARAM_INT);
        $stmt->bindParam(':miss', $en_miss, PDO::PARAM_INT);
        $stmt->bindValue(':mode', 1, PDO::PARAM_INT);

        $stmt->execute();

        $pdo = null;
    }
    catch (PDOException $e)
    {
         exit('データベース接続失敗。'.$e->getMessage());
    }

?>