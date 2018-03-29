<?php

    $score = $_SESSION['score'];
    $count = $_SESSION['count'];
    $miss  = $_SESSION['miss'];

    session_destroy ();

    $name = $_POST['username'];

    echo "スコア:".$score."</br>";
    echo "単語数:".$count."</br>";
    echo "ミス数:".$miss."</br>";
    echo "名前：".$name;

?>