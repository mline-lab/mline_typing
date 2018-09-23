<?php

    $dsn = 'mysql:dbname=tona_tea;host=localhost';
    $user = 'mline';
    $password = 'mline553500';
    
    $rank = 0;
    
    $mode;
    
    try{
        $dbh = new PDO($dsn, $user, $password);
    
        if ($dbh == null){
            //接続失敗
        }else{
            //接続成功
        }
    
        $dbh->query('SET NAMES utf8');
    
        $sql = 'SELECT * FROM score ORDER BY score DESC';
        $stmt = $dbh->query($sql);
    
        while($result = $stmt->fetch(PDO::FETCH_ASSOC)){
            $rank++;
            echo "<tr id=\"list\">";
            echo "<th>";
            echo ($rank);
            echo "<th class=\"name\">";
            echo($result['name']);
            echo "</th>";
            echo "<th>";
            echo($result['score']);
            echo "</th>";
            echo "<th>";
            echo($result['count']);
            echo "</th>";
            echo "<th>";
            echo($result['miss']);
            echo "</th>";
            echo "</tr>";
        }
    
        }catch (PDOException $e){
            print('Error:'.$e->getMessage());
            die();
        }
    
    $dbh = null;
    
?>