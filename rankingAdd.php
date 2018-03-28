<!DOCTYPE html>
<html lang="ja">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>隣町のティーハウス-ランキング登録-</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
</head>

<body>
    <?php
        $score = $_POST['score'];
        $count = $_POST['downcount'];
        $miss = $_POST['missCount'];

        echo "スコア:".$score."</br>";
        echo "単語数:".$count."</br>";
        echo "ミス数:".$miss;
    ?>
</body>
</html>
