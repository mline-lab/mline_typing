<?php
    //データの受け取り
    $score   = $_POST['jskey_score'];
    $count   = $_POST['jskey_downcount'];
    $miss    = $_POST['jskey_misscount'];
    $dummy_1 = bindec($_POST['yvycc1exry378vzi6k3dsku3nvufc6jzj2tz6ju6l7yyxc60jclhd55mys4xm3uq7pdd60d8hw48mqfkoposgq']);
    $dummy_2 = bindec($_POST['ztb0ubhatdarkngezuhvz8qr66wysyhf9g8qc9vqct1dzwidbl7azx0vqspuo8dyprwlvbqsy49vzjswvsjvh8']);
    $dummy_3 = bindec($_POST['lwuec6xfgpsr3whw3o7pn5dkhsdycm47ytjel6e6hgd7qne3dswthai2epd6y63m5zqe6bcoee04g34mbphp3m']);

    //データが空の場合は不正なアクセスとみなす
    if(    ( $score   == '' )
        || ( $count   == '' )
        || ( $miss    == '' )
        || ( $dummy_1 != $score )
        || ( $dummy_2 != $count )
        || ( $dummy_3 != $miss  ) )
    {
        $redirectUrl = "https://tonatea.jp/ng/404.html";
        header("HTTP/1.0 404 Not Found");
        print(file_get_contents($redirectUrl));
        exit();
    }
?>