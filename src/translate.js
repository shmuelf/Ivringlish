function transFormFirstP(n) {
    transformParagraph(document.querySelectorAll('p')[n != null ? n : 1]);
}
function transformParagraph(p, menukad) {
    let prom = !menukad ? naked(p.innerHTML) : Promise.resolve(p.innerHTML);
    return prom.then(txt => translateIvringlish(txt))
        .then(txt => p.innerHTML = txt);
    //p.innerHTML = translateIvringlish(p.innerHTML);
}
function naked(txt) {
    return fetch('https://nakdan.dicta.org.il/api', {
        method: 'POST',
        body: JSON.stringify({"task":"nakdan","genre":"rabbinic","data": txt,"addmorph":true,"keepqq":false,"nodageshdefmem":false,"patachma":false,"keepmetagim":true}),
        cors: true
    }).then(res => res.text())
    .then(txt2 => (window.nikudResp = txt2) && JSON.parse(txt2))
    .then(words => window.txt2 = words.map(w => w.options.length ? w.options[0][0] : w.word).join(''));
}
function translateIvringlish(txt) {
    let txtOut = '';
    for (let i = 0; i < txt.length; i++) {
        let char = txt[i];
        switch (char) {
        case nikudim.patach:
        case nikudim.chatafPatach:
        case nikudim.komats: 
        case nikudim.chatafKamats:
            char = 'a'; break;
        case nikudim.shva: { 
            if (isShvaNa(txt,i)) {
                char = 'e';
                if (segolsExp.test(txt[i+2]))
                    char += '|';
            }
            else
                char = '';
            break;
        }
        case nikudim.segol:
        case nikudim.chatafSegol:
        case nikudim.tseire: {
            char = 'e';
            if (segolsExp.test(txt[i+2]))
                char += '|';
            break;
        }
        case nikudim.chirik: {
            char = 'ee';
            if (txt[i+1]=='י' && !nikudExp.test(txt[i+2]) || (txt[i+1] == '\'' && txt[i+2]=='י' && !nikudExp.test(txt[i+3])))
                i++;
            break;
        }
        case nikudim.kubuts:
            char = 'u'; break;
        case nikudim.choilom:
            char = 'o'; break;
        case nikudim.dagesh:
            char = '';
            break;
        case 'א':
            char = '' /*'a'*/; break;
        case 'ב': {
            let nikud = txt[i+1];
            if (nikud == nikudim.dagesh) { 
                char = 'b';
                i++;
            }
            else 
                char = 'v';
            break;
        }
        case 'ג':
            char = 'g'; break;
        case 'ד':
            char = 'd'; break;
        case 'ה':
            char = 'h'; break;
        case 'ו': {
            let nikud = txt[i+1];
            if (nikud == nikudim.choilom) { //choilom gadol
                char = 'o';
                i++;
            }
            else if (nikud == nikudim.dagesh) { //shuruk וּ
                char = 'u';
                i++;
            }
            else
                char = 'v'; 
            break;
        }
        //char = (i == 0 || (txt[i-1] < 'א'.charCodeAt() || 'ת'.charCodeAt() < txt[i-1])) ? 'v' : 'u'; break;
        case 'ז': {
            if (txt[i+2]=='\'')
                char = 'j';
            else
                char = 'z'; 
            break;
        }
        case '\'': {
            if (txt[i-2] == 'ז' || txt[i-2] == 'ג')
                char = '';
            break;
        }
        case 'ח': {
            char = 'ch'; 
            if (txt[i+1] == nikudim.patach && (!otExp.test(txt[i+2]) && !nikudExp.test(txt[i+2]))) {
                char = 'ach';
                i++;
            }
            break; 
        }
        case 'ט':
            char = 't'; break;
        case 'י': {
            let nextChar = txt[i+1];
            let nnextChar = txt[i+2];
            if (nextChar == 'ו' && !otExp.test(nnextChar) && !nikudExp.test(nnextChar)) // י-ו - at the end of a word
                char = '';
            else {
                char = Math.random() > 0.5 ? 'i' : 'y'; 
                if (nextChar == nikudim.chirik || (nextChar == nikudim.dagesh && nnextChar == nikudim.chirik))
                    i++;
            }
            break;
        }
        case 'ך':
        case 'כ':{
            let nikud = txt[i+1];
            let nikud2 = txt[i+2];
            if (nikud == nikudim.dagesh) { //dagesh
                if (nikud2 == nikudim.komats || nikud2 == nikudim.patach || nikud2 == nikudim.segol || nikud2 == nikudim.tseire || nikud2 == nikudim.choilom || nikud2 == nikudim.chirik || nikud2 == nikudim.kubuts || (nikud2 == nikudim.shva && isShvaNa(txt, i+2)))
                    char = 'k';
                else
                    char = Math.random() > 0.5 ? 'c' : 'k';
                i++;
            }
            else 
                char = 'ch';
            break;
        }
        case 'ל':
            char = 'l'; break;
        case 'ם':
        case 'מ':
            char = 'm'; break;
        case 'ן':
        case 'נ':
            char = 'n'; break;
        case 'ס':
            char = 's'; break;
        case 'ע':
            char = ''; break;
        case 'ף':
        case 'פ': {
            let nikud = txt[i+1];
            if (nikud == nikudim.dagesh) { 
                char = 'p';
                i++;
            }
            else 
                char = 'f';
            break;
        }
        case 'ץ':
        case 'צ':
            char = 'ts'; break;
        case 'ק':
            char = 'q'; break;
        case 'ר':
            char = 'r'; break;
        case 'ש': {
            let nikud = txt[i+1];
            if (nikud == nikudim.sin) {
                char = 's';
                i++; 
            }
            else { 
                char = 'sh';
                if (nikud == nikudim.shin)
                    i++;
            }
            break;
        }
        case 'ת': {
            let nikud = txt[i+1];
            if (nikud == nikudim.dagesh) { 
                char = 't';
                i++;
            }
            else 
                char = 't';//'s';
            break;
        }
        default:
            ;
        }
        //e,j,o,w,x

        txtOut+=char;
    }
    return txtOut;
}
var otExp = /[א-ת]/;
function isShvaNa(txt,i) {
    let p = i - 1;
    if (txt[i-1] == nikudim.dagesh) p -= 1;
    if (!otExp.test(txt[p-1]) && !nikudExp.test(txt[p-1])) return true; //head of word
    if (!otExp.test(txt[i+1]) && !nikudExp.test(txt[i+1])) return false; //tail of word
    if (txt[i-2] == nikudim.shva) return true;
    return false; // the rest is dikduk
}
//let txt = ''; for (let i='א'.charCodeAt(0); i<='ת'.charCodeAt(0); i++) txt += `case '${String.fromCharCode(i)}':\nchar = '';\n`;
//let nikudim = 'patach:אַ,komats:אָ,chatafPatach:אֲ,chatafKamats:אֳ,chatafSegol:אֱ,shva:אְ,segol:אֶ,tseire:אֵ,chirik:אִ,kubuts:אֻ,choilom:אֹ,dagesh:וּ,sin:שׂ,shin:שׁ'.split(',').reduce((acc,c) => { acc[c.split(':')[0]] = c.split(':')[1].charCodeAt(1); return acc; }, {});
var nikudim = {
    patach: String.fromCharCode(1463),
    komats: String.fromCharCode(1464), // 1479 = komats katan
    chatafPatach: String.fromCharCode(1458),
    chatafKamats: String.fromCharCode(1459),
    chatafSegol: String.fromCharCode(1457),
    shva: String.fromCharCode(1456),
    segol: String.fromCharCode(1462),
    tseire: String.fromCharCode(1461),
    chirik: String.fromCharCode(1460),
    kubuts: String.fromCharCode(1467), // אֻ
    choilom: String.fromCharCode(1465),
    dagesh: String.fromCharCode(1468),
    sin: String.fromCharCode(1474),
    shin: String.fromCharCode(1473)
}
var nikudExp = new RegExp('[' +
    Object.entries(nikudim)
        .map(([k,v]) => 
            '\\u' + v.charCodeAt(0).toString(16).padStart(4, '0')
        ).join('') 
    + ']');
var segolsExp = /[\u05b1\u05b6\u05b5]/;