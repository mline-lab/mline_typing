<?php
    //セッションスタート
    session_start();

    $score = $_SESSION['score'];
    $count = $_SESSION['count'];
    $miss  = $_SESSION['miss'];

    session_destroy ();

    $name = $_POST['username'];

    echo "スコア:".$score."</br>";
    echo "単語数:".$count."</br>";
    echo "ミス数:".$miss."</br>";
    echo "名前：".$name;

    try
    {
        $pdo = new PDO('mysql:host=localhost;dbname=typing;charset=utf8','mline','manaki079');

        //エラーをスロー
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo -> prepare("INSERT INTO score (name, score, count, miss, mode) VALUES (:name, :score, :count, :miss, :mode)");
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':score', $score, PDO::PARAM_INT);
        $stmt->bindParam(':count', $count, PDO::PARAM_INT);
        $stmt->bindParam(':miss', $miss, PDO::PARAM_INT);
        $stmt->bindValue(':mode', 1, PDO::PARAM_INT);

        $stmt->execute();

        $pdo = null;
    }
    catch (PDOException $e)
    {
         exit('データベース接続失敗。'.$e->getMessage());
    }

?>