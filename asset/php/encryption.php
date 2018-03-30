<?php
$encMode = 1;
$decMode = 2;

//暗号化複合化関数
function reqEncDec($str, $mode){

	//$mode 1:暗号 2:複合

	//暗号化＆復号化キー
	$key = md5('wsafweatiaou');

	//暗号モジュールをオープン
	$td  = mcrypt_module_open('des', '', 'ecb', '');

	//キー長を定義
	$iv  = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);

	//キーを生成
	$key = substr($key, 0, mcrypt_enc_get_key_size($td));

	//暗号化処理を初期化
	mcrypt_generic_init($td, $key, $iv);

	if($mode == 1){
		//データを暗号化
		$str = base64_encode(mcrypt_generic($td, $str));
	}elseif($mode == 2){
		//データを復号化
		$str = mdecrypt_generic($td, base64_decode($str));
	}

	//暗号復号ハンドラを終了
	mcrypt_generic_deinit($td);

	//モジュールを閉じる
	mcrypt_module_close($td);

	//末尾のNULLを削除しリターン
	return rtrim($str);
}

?>