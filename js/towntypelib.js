var shiftdown = 0;
var wordseikaisuu = 0;
var seikaisuu = 0;
var keysettei = 1;

function townro_machange(sellect, henkan) {
  var ro_ma = "";
  var nowword = "";
  var nextword = "";
  var nnextword = "";
  var jword = new Array();
  var word = new Array();
  var tableichi = 0;
  var nijuucheck = 0;
  var tempdata = new Array(3);

  for (var i = 0; i < sellect.length; i++) {
    nowword = sellect.charAt(i);
    nextword = sellect.charAt(i + 1);
    nnextword = sellect.charAt(i + 2);

    nijuucheck = 0;
    for (var m = 0; m < henkan.length && nijuucheck == 0; m++) {
      if (nextword != "" && (nowword + nextword) == henkan[m][0]) {
        jword[tableichi] = henkan[m][0];
        tableichi++;
        i++;
        nijuucheck = 1;
      }
    }
    if (nijuucheck == 0) {
      jword[tableichi] = nowword;
      tableichi++;
    }
  }

  var set = 0;
  for (var j = 0; j < jword.length; j++) {
    for (var k = 0; k < henkan.length && jword[j] != "っ"; k++) {
      if (jword[j] == henkan[k][0]) {
        if (jword[j] == "ん") {
          if (henkan[k][1] == "n") {
            if (j == jword.length - 1 || jword[j + 1] == "あ" || jword[j + 1] == "い" || jword[j + 1] == "え" || jword[j + 1] == "お" ||
              jword[j + 1] == "な" || jword[j + 1] == "に" || jword[j + 1] == "ぬ" || jword[j + 1] == "ね" || jword[j + 1] == "の" ||
              jword[j + 1] == "いぇ" ||
              jword[j + 1] == "にゃ" || jword[j + 1] == "にぃ" || jword[j + 1] == "にゅ" || jword[j + 1] == "にぇ" || jword[j + 1] == "にょ" ||
              jword[j + 1] == "や" || jword[j + 1] == "ゆ" || jword[j + 1] == "よ") {
              word[j] = henkan[k][2];
              set = 1;
              break;
            } else if (jword[j + 1] == "う" || jword[j + 1] == "うぁ" || jword[j + 1] == "うぃ" || jword[j + 1] == "うぇ" || jword[j + 1] == "うぉ") {
              for (var l = 0; l < henkan.length; l++) {
                if (jword[j + 1] == henkan[l][0]) {
                  if (henkan[l][1].charAt(0) == "u") {
                    word[j] = henkan[k][2];
                    set = 1;
                    break;
                  } else {
                    word[j] = henkan[k][1];
                    set = 1;
                    break;
                  }
                }
              }
            } else {
              word[j] = henkan[k][1];
              set = 1;
              break;
            }
          } else {
            word[j] = henkan[k][1];
            set = 1;
            break;
          }
        } else {
          word[j] = henkan[k][1];
          set = 1;
          break;
        }
      }
    }
    if (set == 0) {
      if (jword[j] == "っ") {
        for (var m = 0; m < henkan.length; m++) {
          if (jword[j] == henkan[m][0]) {
            break;
          }
        }
        if (henkan[m][1] == "tt") {
          if (j < jword.length - 1) {
            for (var i = 0; i < henkan.length; i++) {
              if (jword[j + 1] == henkan[i][0] && jword[j + 1] != "っ") {
                if (henkan[i][1].charAt(0) != "n" &&
                  henkan[i][1].charAt(0) != "a" &&
                  henkan[i][1].charAt(0) != "i" &&
                  henkan[i][1].charAt(0) != "u" &&
                  henkan[i][1].charAt(0) != "e" &&
                  henkan[i][1].charAt(0) != "o") {
                  word[j] = henkan[i][1].charAt(0);
                  set = 1;
                  break;
                }
              }
            }
          } else {
            if (henkan[m][2] != null) {
              word[j] = henkan[m][2];
              set = 1;
            } else {
              word[j] = "ltu";
              set = 1;
            }
          }
        } else if (henkan[m][1] == "ltu") {
          word[j] = "ltu";
          set = 1;
        } else if (henkan[m][1] == "xtu") {
          word[j] = "xtu";
          set = 1;
        } else if (henkan[m][1] == "ltsu") {
          word[j] = "ltsu";
          set = 1;
        }
        if (set == 0) {
          if (henkan[m][2] != null) {
            word[j] = henkan[m][2];
          } else {
            word[j] = "ltu";
          }
          set = 1;
        }
      } else {
        word[j] = jword[j];
        set = 1;
      }
    } else {
      set = 0;
    }
    ro_ma += word[j];
    set = 0;
  }
  tempdata[0] = ro_ma;
  tempdata[1] = jword;
  tempdata[2] = word;
  return tempdata;
}

function towncheckshift(e) {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    var burauza = "Chrome";
  } else if (navigator.userAgent.indexOf("Safari") != -1) {
    var burauza = "Safari";
  } else if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident") != -1) {
    var burauza = "IE";
  } else if (navigator.appName == "Netscape") {
    var burauza = "Net";
  } else if (navigator.appName == "Opera") {
    var burauza = "Ope";
  } else {
    var burauza = "IE";
  }
  if (burauza == "IE" || burauza == "Ope" || burauza == "Safari" || burauza == "Chrome") {
    if (event.keyCode == 16) {
      return 0;
    }
  } else {
    if (e.which == 16) {
      return 0;
    }
  }
}

function townnotevent(e) {
  var keychi;
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    var burauza = "Chrome";
  } else if (navigator.userAgent.indexOf("Safari") != -1) {
    var burauza = "Safari";
  } else if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident") != -1) {
    var burauza = "IE";
  } else if (navigator.appName == "Netscape") {
    var burauza = "Net";
  } else if (navigator.appName == "Opera") {
    var burauza = "Ope";
  } else {
    var burauza = "IE";
  }
  if (burauza == "Net") {
    keychi = e.which;
    if (keychi == 32) {
      return false;
    } else if (keychi == '\''.charCodeAt()) {
      return false;
    } else if (keychi == '('.charCodeAt()) {
      return false;
    } else if (keychi == '/'.charCodeAt()) {
      return false;
    } else if (keychi == 13) {
      return false;
    } else if (keychi == 8) {
      return false;
    } else {
      return true;
    }
  } else if (burauza == "Ope") {
    keychi = event.keyCode;
    if (keychi == 32) {
      return false;
    } else if (keychi == '\''.charCodeAt()) {
      return false;
    } else if (keychi == '('.charCodeAt()) {
      return false;
    } else if (keychi == '-'.charCodeAt()) {
      return false;
    } else if (keychi == ','.charCodeAt()) {
      return false;
    } else if (keychi == '.'.charCodeAt()) {
      return false;
    } else if (keychi == '/'.charCodeAt()) {
      return false;
    } else if (keychi == ';'.charCodeAt()) {
      return false;
    } else if (keychi == 13) {
      return false;
    } else if (keychi == 8) {
      return false;
    } else {
      return true;
    }

  } else {
    keychi = event.keyCode;
    if (keychi == 32) {
      return false;
    } else if (keychi == '\''.charCodeAt()) {
      return false;
    } else if (keychi == '('.charCodeAt()) {
      return false;
    } else if (keychi == 13) {
      return false;
    } else if (keychi == 8) {
      return false;
    } else {
      return true;
    }
  }
}

function townmojiretuhenkan(e, tempdata) {
  if (navigator.userAgent.indexOf("Chrome") != -1) {
    var burauza = "Chrome";
  } else if (navigator.userAgent.indexOf("Safari") != -1) {
    var burauza = "Safari";
  } else if (navigator.userAgent.indexOf("MSIE") != -1 || navigator.userAgent.indexOf("Trident") != -1) {
    var burauza = "IE";
  } else if (navigator.appName == "Netscape") {
    var burauza = "Net";
  } else if (navigator.appName == "Opera") {
    var burauza = "Ope";
  } else {
    var burauza = "IE";
  }
  var set = 0;


  var checkKeyCode = -1;

  if (burauza == "IE" || burauza == "Ope" || burauza == "Safari" || burauza == "Chrome") {
    checkKeyCode = event.keyCode;
  } else {
    checkKeyCode = e.which;
  }

  var startword = tempdata[5];
  if (burauza == "IE" || burauza == "Ope" || burauza == "Safari" || burauza == "Chrome") {
    if (tempdata[12] == 0) {
      tempdata[5] += String.fromCharCode(event.keyCode);
      tempdata[6] = String.fromCharCode(event.keyCode);
    } else {
      if (event.keyCode == 16) {
        tempdata[13] = 1;
        return;
      } else {
        var check = 0;
        for (var i = 0; i < tempdata[14].length; i++) {
          if (event.keyCode == tempdata[14][i][0] && tempdata[13] == 0) {
            tempdata[5] += tempdata[14][i][1];
            tempdata[6] = tempdata[14][i][1];
            check = 1;
            break;
          }
        }
        for (var i = 0; i < tempdata[15].length && check == 0; i++) {
          if (event.keyCode == tempdata[15][i][0] && tempdata[13] == 1) {
            tempdata[5] += tempdata[15][i][1];
            tempdata[6] = tempdata[15][i][1];
            check = 1;
            break;
          }
        }
      }
    }
  } else {
    if (tempdata[12] == 0) {
      tempdata[5] += String.fromCharCode(e.which);
      tempdata[6] = String.fromCharCode(e.which);
    } else {
      if (e.which == 16) {
        tempdata[13] = 1;
        return;
      } else {
        var check = 0;
        for (var i = 0; i < tempdata[14].length; i++) {
          if (e.which == tempdata[14][i][0] && tempdata[13] == 0) {
            tempdata[5] += tempdata[14][i][1];
            tempdata[6] = tempdata[14][i][1];
            check = 1;
            break;
          }
        }
        for (var i = 0; i < tempdata[15].length, check == 0; i++) {
          if (e.which == tempdata[15][i][0] && tempdata[13] == 1) {
            tempdata[5] += tempdata[15][i][1];
            tempdata[6] = tempdata[15][i][1];
            check = 1;
            break;
          }
        }
      }
    }
  }

  for (var i = 0; i < tempdata[10].length && set == 0; i++) {
    if (tempdata[0][tempdata[2]] == tempdata[10][i][0]) {
      if (tempdata[0][tempdata[2]] == "っ") {
        var temptableichi = 0;
        var tempnyuuryoku = "";
        for (var j = 1; j < tempdata[10][i].length; j++) {
          if (tempdata[5].substring(0, tempdata[3] + 1) == tempdata[10][i][j].substring(0, tempdata[3] + 1) && tempdata[10][i][j] != "tt") {
            set = 1;
            tempdata[4] += tempdata[6];
            seikai(tempdata[4]);
            if (tempdata[5].substring(0, tempdata[3]) != tempdata[10][i][1].substring(0, tempdata[3])) {
              updatetable(i, tempdata[10][i][j]);
              rero_maset();
            }
            temptableichi = tempdata[2];
            tempnyuuryoku = tempdata[5];
            tablecheck(set);
            if (tempdata[2] > temptableichi && tempnyuuryoku.length == 2) {
              tempdata[5] = tempdata[6];
              tempdata[3]++;
              temptableichi = 0;
              tempnyuuryoku = "";
            }
            break;
          } else {
            for (var k = 0; k < tempdata[10].length; k++) {
              if (tempdata[0][tempdata[2] + 1] == tempdata[10][k][0]) {
                for (var l = 1; l < tempdata[10][k].length; l++) {
                  if (tempdata[5].substring(0, tempdata[3] + 1) == (tempdata[10][k][l].charAt(0) + tempdata[10][k][l].charAt(0)).substring(0, tempdata[3] + 1) &&
                    tempdata[5].substring(0, tempdata[3] + 1) != "n" &&
                    tempdata[5].substring(0, tempdata[3] + 1) != "a" &&
                    tempdata[5].substring(0, tempdata[3] + 1) != "i" &&
                    tempdata[5].substring(0, tempdata[3] + 1) != "u" &&
                    tempdata[5].substring(0, tempdata[3] + 1) != "e" &&
                    tempdata[5].substring(0, tempdata[3] + 1) != "o" &&
                    tempdata[0][tempdata[2] + 1] != "っ") {
                    set = 1;
                    tempdata[4] += tempdata[6];
                    seikai(tempdata[4]);

                    if (tempdata[5].substring(0, tempdata[3]) != tempdata[10][i][1]) {
                      updatetable(i, "tt");
                    }
                    if (tempdata[10][k].length > 1 && tempdata[10][k][l] != tempdata[10][k][1]) {
                      updatetable(k, tempdata[10][k][l]);
                    }
                    rero_maset();
                    temptableichi = tempdata[2];
                    tempnyuuryoku = tempdata[5];
                    tablecheck(set);
                    if (tempdata[2] > temptableichi && tempnyuuryoku.length == 2) {
                      tempdata[5] = tempdata[6];
                      tempdata[3]++;
                      temptableichi = 0;
                      tempnyuuryoku = "";
                    }
                    break;
                  }
                }
              }
            }
          }
        }
      } else if (tempdata[0][tempdata[2]] == "ん") {
        for (var j = 1; j < tempdata[10][i].length && set == 0; j++) {
          if ((tempdata[5].substring(0, tempdata[3] + 1) == "n" ||
              tempdata[5].substring(0, tempdata[3] + 1) == "x") &&
            checkKeyCode > 32
          ) {
            set = 1;
            tempdata[4] += tempdata[6];
            seikai(tempdata[4]);



            if (tempdata[10][i][1].charAt(0) != tempdata[5].substring(0, tempdata[3] + 1)) {
              var check = 0;
              check = 1;
              for (var k = 2; k < tempdata[10][i].length; k++) {
                if (tempdata[5].substring(0, tempdata[3] + 1) == tempdata[10][i][k].charAt(0)) {
                  updatetable(i, tempdata[10][i][k]);
                  rero_maset();
                  break;
                }
              }
            }
            break;
          } else if (tempdata[5].substring(0, tempdata[3] + 1) == "nn" ||
            tempdata[5].substring(0, tempdata[3] + 1) == "n'" ||
            tempdata[5].substring(0, tempdata[3] + 1) == "xn") {
            set = 1;
            tempdata[4] += tempdata[6];
            seikai(tempdata[4]);

            if (tempdata[10][i][1] != tempdata[5].substring(0, tempdata[3] + 1)) {
              var check = 0;
              for (var k = 0; k < tempdata[10].length && check == 0; k++) {
                if (tempdata[0][tempdata[2] + 1] == tempdata[10][k][0]) {
                  if ((tempdata[2] < (tempdata[1].length - 1) &&
                      tempdata[10][k][1].charAt(0) != "n" &&
                      tempdata[10][k][1].charAt(0) != "y" &&
                      tempdata[10][k][1].charAt(0) != "a" &&
                      tempdata[10][k][1].charAt(0) != "i" &&
                      tempdata[10][k][1].charAt(0) != "u" &&
                      tempdata[10][k][1].charAt(0) != "e" &&
                      tempdata[10][k][1].charAt(0) != "o" &&
                      tempdata[5].substring(0, tempdata[3] + 1) != "n" &&
                      tempdata[10][i][1] == "n") ||
                    (tempdata[5].substring(0, tempdata[3] + 1) != tempdata[10][i][1] &&
                      tempdata[10][i][1] != "n")) {
                    check = 1;
                    updatetable(i, tempdata[5].substring(0, tempdata[3] + 1));
                    rero_maset();
                    break;
                  }
                }
              }
              if (check == 0) {
                if (tempdata[0][tempdata[2] + 1] == tempdata[1][tempdata[2] + 1]) {
                  if (tempdata[0][tempdata[2] + 1] != null || tempdata[10][i][1] != "n" || (tempdata[10][i][1] == "n" && tempdata[5].substring(0, tempdata[3] + 1) != tempdata[10][i][2])) {
                    check = 1;
                    updatetable(i, tempdata[5].substring(0, tempdata[3] + 1));
                    rero_maset();
                  }
                }
              }
            }
            tablecheck(set);
            break;
          } else {
            for (var k = 0; k < tempdata[10].length && set == 0; k++) {
              if (tempdata[0][tempdata[2] + 1] == tempdata[10][k][0]) {
                for (var l = 1; l < tempdata[10][k].length && set == 0; l++) {
                  if ((tempdata[5] == "n" + tempdata[10][k][l].charAt(0) &&
                      tempdata[10][k][l].charAt(0) != "a" &&
                      tempdata[10][k][l].charAt(0) != "i" &&
                      tempdata[10][k][l].charAt(0) != "u" &&
                      tempdata[10][k][l].charAt(0) != "e" &&
                      tempdata[10][k][l].charAt(0) != "o" &&
                      tempdata[10][k][l].charAt(0) != "y" &&
                      tempdata[0][tempdata[2] + 1] != "っ") ||
                    (tempdata[5] == "n" + tempdata[10][k][l].charAt(0) &&
                      tempdata[0][tempdata[2] + 1] == "っ" &&
                      tempdata[10][k][l].charAt(0) != "t")) {
                    set = 1;
                    tempdata[4] += tempdata[6];
                    seikai(tempdata[4]);
                    if (tempdata[10][i][1] != "n") {
                      updatetable(i, "n");
                      rero_maset();
                    }
                    if (tempdata[10][k].length > 1 && tempdata[10][k][l] != tempdata[10][k][1]) {
                      updatetable(k, tempdata[10][k][l]);
                      rero_maset();
                    }
                    tablecheck(set);
                    tempdata[5] = tempdata[6];
                    tempdata[3]++;
                    break;
                  }
                }
              }
            }
            if (set == 0) {
              if (tempdata[5] == "n" + tempdata[0][tempdata[2] + 1]) {
                set = 2;
                tempdata[4] += tempdata[6];
                seikai(tempdata[4]);
                if (tempdata[10][i][1] != "n") {
                  updatetable(i, "n");
                  rero_maset();
                }
                tablecheck(set);
                //								tempdata[5]=tempdata[6];
                //								tempdata[3]++;
              }
            }
          }
        }
      } else {
        for (var j = 1; j < tempdata[10][i].length && set == 0; j++) {
          if (tempdata[5].substring(0, tempdata[3] + 1) == tempdata[10][i][j].substring(0, tempdata[3] + 1)) {
            if (tempdata[0][tempdata[2] - 1] != "っ" ||
              (tempdata[0][tempdata[2] - 1] == "っ" && (tempdata[1][tempdata[2] - 1] == "ltu" || tempdata[1][tempdata[2] - 1] == "ltsu" || tempdata[1][tempdata[2] - 1] == "xtu")) ||
              (tempdata[0][tempdata[2] - 1] == "っ" && tempdata[1][tempdata[2] - 1] != "ltu" && tempdata[1][tempdata[2] - 1] != "ltsu" && tempdata[1][tempdata[2] - 1] != "xtu" && tempdata[5].charAt(0) == tempdata[1][tempdata[2] - 1])) {
              set = 1;
              tempdata[4] += tempdata[6];
              seikai(tempdata[4]);
              if (tempdata[10][i].length > 1 && (tempdata[5].substring(0, tempdata[3]) != tempdata[10][i][1].substring(0, tempdata[3]))) {
                updatetable(i, tempdata[10][i][j]);
                rero_maset();
              }
              tablecheck(set);
              break;
            }
          }
        }
      }
    }
  }
  if (set == 0) {
    if (tempdata[5] == tempdata[0][tempdata[2]]) {
      set = 1;
      tempdata[4] += tempdata[6];
      seikai(tempdata[4]);
      tablecheck(set);
    } else {
      machigai(tempdata[6]);
      tempdata[5] = startword;
    }
  }

  function tablecheck(setichi) {
    if (tempdata[5].length >= tempdata[1][tempdata[2]].length) {
      tempdata[5] = "";
      tempdata[3] = 0;
      tempdata[9] += tempdata[0][tempdata[2]].length;
      if (setichi == 1) {
        tempdata[2]++;
      } else {
        tempdata[9]++;
        tempdata[2] += 2;
      }
    }
  }

  function updatetable(henkanichi, tmpinput) {
    var tmpichi = tempdata[10][henkanichi].length - 1;
    var tmphairetu = new Array(tempdata[10][henkanichi].length);

    for (var i = tempdata[10][henkanichi].length - 1; i >= 1; i--) {
      if (tmpinput != tempdata[10][henkanichi][i]) {
        tmphairetu[tmpichi] = tempdata[10][henkanichi][i];
        tmpichi--;
      }
    }
    for (var j = 2; j < tempdata[10][henkanichi].length; j++) {
      tempdata[10][henkanichi][j] = tmphairetu[j];
    }
    tempdata[10][henkanichi][1] = tmpinput;
  }

  function rero_maset() {
    var mojiretu = "";

    var ro_ma2 = new Array(tempdata[0].length);

    for (var i = 0; i < ro_ma2.length; i++) {
      ro_ma2[i] = "";
    }
    var set = 0;
    for (var j = tempdata[2]; j < tempdata[0].length; j++) {
      for (var k = 0; k < tempdata[10].length; k++) {
        if (tempdata[0][j] == tempdata[10][k][0]) {
          if (tempdata[0][j] == "ん") {
            if (tempdata[10][k][1] == "n" &&
              (j == (tempdata[0].length - 1) || tempdata[0][j + 1] == "あ" || tempdata[0][j + 1] == "い" || tempdata[0][j + 1] == "う" || tempdata[0][j + 1] == "え" || tempdata[0][j + 1] == "お" ||
                tempdata[0][j + 1] == "いぇ" ||
                tempdata[0][j + 1] == "うぁ" || tempdata[0][j + 1] == "うぃ" || tempdata[0][j + 1] == "うぇ" || tempdata[0][j + 1] == "うぉ" ||
                tempdata[0][j + 1] == "な" || tempdata[0][j + 1] == "に" || tempdata[0][j + 1] == "ぬ" || tempdata[0][j + 1] == "ね" || tempdata[0][j + 1] == "の" ||
                tempdata[0][j + 1] == "にゃ" || tempdata[0][j + 1] == "にぃ" || tempdata[0][j + 1] == "にゅ" || tempdata[0][j + 1] == "にぇ" || tempdata[0][j + 1] == "にょ" ||
                tempdata[0][j + 1] == "や" || tempdata[0][j + 1] == "ゆ" || tempdata[0][j + 1] == "よ")) {
              if (tempdata[0][j + 1] == "うぁ" || tempdata[0][j + 1] == "うぃ" || tempdata[0][j + 1] == "うぇ" || tempdata[0][j + 1] == "うぉ") {
                for (var l = 0; l < tempdata[10].length; l++) {
                  if (tempdata[0][j + 1] == tempdata[10][l][0]) {
                    if (tempdata[10][l][1].charAt(0) == "u") {
                      ro_ma2[j] += tempdata[10][k][2];
                      set = 1;
                      break;
                    } else {
                      ro_ma2[j] += tempdata[10][k][1];
                      set = 1;
                      break;
                    }
                  }
                }
              } else if (tempdata[0][j + 1] == "う") {
                if (tempdata[10][2][1].charAt(0) == "u") {
                  ro_ma2[j] += tempdata[10][k][2];
                  set = 1;
                  break;
                } else {
                  ro_ma2[j] += tempdata[10][k][1];
                  set = 1;
                  break;
                }
              } else {
                ro_ma2[j] += tempdata[10][k][2];
                set = 1;
                break;
              }
            } else {
              ro_ma2[j] = tempdata[10][k][1];
              set = 1;
              break;
            }
          } else if (tempdata[0][j] == "っ") {
            for (var m = 0; m < tempdata[10].length; m++) {
              if (tempdata[0][j] == tempdata[10][m][0]) {
                if (tempdata[10][m][1] == "tt") {
                  if (j < tempdata[0].length - 1) {
                    for (var i = 0; i < tempdata[10].length; i++) {
                      if (tempdata[0][j + 1] == tempdata[10][i][0]) {
                        if (tempdata[10][i][1].charAt(0) != "n" &&
                          tempdata[10][i][1].charAt(0) != "a" &&
                          tempdata[10][i][1].charAt(0) != "i" &&
                          tempdata[10][i][1].charAt(0) != "u" &&
                          tempdata[10][i][1].charAt(0) != "e" &&
                          tempdata[10][i][1].charAt(0) != "o" &&
                          tempdata[0][j + 1] != "っ") {
                          ro_ma2[j] = tempdata[10][i][1].charAt(0);
                          set = 1;
                          break;
                        }
                      }
                    }
                  } else {
                    if (tempdata[10][m][2] != null) {
                      ro_ma2[j] = tempdata[10][m][2];
                      set = 1;
                      break;
                    } else {
                      ro_ma2[j] = "ltu";
                      set = 1;
                      break;
                    }
                  }
                } else if (tempdata[10][m][1] == "ltu") {
                  ro_ma2[j] = "ltu";
                  set = 1;
                  break;
                } else if (tempdata[10][m][1] == "xtu") {
                  ro_ma2[j] = "xtu";
                  set = 1;
                  break;
                } else if (tempdata[10][m][1] == "ltsu") {
                  ro_ma2[j] = "ltsu";
                  set = 1;
                  break;
                } else {
                  ro_ma2[j] = "ltu";
                  set = 1;
                  break;
                }
              }
            }
            if (set == 0) {
              if (tempdata[10][m][2] != null) {
                ro_ma2[j] = tempdata[10][m][2];
              } else {
                ro_ma2[j] = "ltu";
              }
              set = 1;
              break;
            }
          } else {
            ro_ma2[j] = tempdata[10][k][1];
            set = 1;
            break;
          }
        }
      }
      if (set == 0) {
        ro_ma2[j] = tempdata[0][j];
        set = 1;
      }
      set = 0;
    }
    for (var i = 0; i < ro_ma2.length; i++) {
      if (i < tempdata[2]) {} else {
        tempdata[1][i] = ro_ma2[i];
      }
      mojiretu += tempdata[1][i];
    }
    tempdata[11] = mojiretu;
  }

  function seikai(mojiretu) {
    tempdata[3]++;
    tempdata[7]++;
  }

  function machigai(moji) {
    tempdata[8]++;
  }
}
