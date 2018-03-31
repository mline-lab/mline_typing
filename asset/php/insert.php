<?php
    //セッションスタート
    session_start();

    //セッションキー設定ファイル
    include('session_key.php');    

    $score = $_SESSION[$key_score ];
    $count = $_SESSION[$key_count];
    $miss  = $_SESSION[$key_miss];

    //セッションデータ破棄
    session_destroy ();

    //データが空の場合は不正なアクセスとみなす
    if(    ( $score == '' )
        || ( $count == '' )
        || ( $miss  == '' ) )
    {
        $redirectUrl = "https://tonatea.jp/ng/404.html";
        header("HTTP/1.0 404 Not Found");
        print(file_get_contents($redirectUrl));
        exit();
    }

    //暗号化関数
    include('encryption.php');

    //score復号化
    $dec_score = reqEncDec( $score, $decMode);
    //count復号化
    $dec_count = reqEncDec( $count, $decMode);
    //miss復号化
    $dec_miss  = reqEncDec( $miss, $decMode);

    $name = htmlspecialchars($_POST['username'], ENT_QUOTES, 'UTF-8');
    if ($name == "") {
        $name = "名無し";
    }

    echo "名前：".$name."登録完了</br>";
    echo "score:".$dec_score."</br>";
    echo "count:".$dec_count."</br>";
    echo "miss:".$dec_miss."</br>";

    try
    {
        $pdo = new PDO('mysql:host=localhost;dbname=typing;charset=utf8','mline','manaki079');

        //エラーをスロー
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo -> prepare("INSERT INTO score (name, score, count, miss, mode) VALUES (:name, :score, :count, :miss, :mode)");
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':score', $dec_score, PDO::PARAM_INT);
        $stmt->bindParam(':count', $dec_count, PDO::PARAM_INT);
        $stmt->bindParam(':miss', $dec_miss, PDO::PARAM_INT);
        $stmt->bindValue(':mode', 1, PDO::PARAM_INT);

        $stmt->execute();

        $pdo = null;
    }
    catch (PDOException $e)
    {
         exit('データベース接続失敗。'.$e->getMessage());
    }

?>