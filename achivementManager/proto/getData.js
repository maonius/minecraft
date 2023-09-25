/*
  This script is used to get achivemenet data from 'minecraft wikipedia'
  URL of 'minecraft wikipedia': 
    https://minecraftjapan.miraheze.org/wiki/Minecraft%EF%BC%88Bedrock%EF%BC%89/%E5%AE%9F%E7%B8%BE
  To run this script, Paste this sciprt to console on the link above.
*/
var a = function() {
  const selector = ".wikitable > tbody > tr:not(:first-child)";
  const ROWS = document.querySelectorAll(selector);
  let res = `const ACHIVEMENT_DATA = [\n  `
  console.log(ROWS);
  for (let i=0; i<ROWS.length; i++) {
    const tr = ROWS[i];
    let tds = tr.children;
    // get icon
    var el = tds[0];
    var x_str = el.children[0].style.backgroundPositionX;
    var y_str = el.children[0].style.backgroundPositionY;
    let icon_x = Math.abs(parseInt(x_str)/47);
    let icon_y = Math.abs(parseInt(y_str)/47);
    // get thumnail
    var el = tds[1].children[0];
    var x_str = el.style.backgroundPositionX;
    var y_str = el.style.backgroundPositionY;
    let thumnail_x = Math.abs(parseInt(x_str)/84);
    let thumnail_y = Math.abs(parseInt(y_str)/48);
    // get title
    var el = tds[2];
    let title = el.innerHTML.replace(/\r?\n/g, '');
    // get description
    var el = tds[3];
    let description = el.innerHTML.replace(/\r?\n/g, '');
    // get detail
    var el = tds[4];
    let detail = el.textContent.replace(/\r?\n/g, '');
    // get G
    var el = tds[5];
    let G  = el.textContent.replace(/[^0-9]/g, '');

    // make output
    if (i != 0) res += ',';
    res += '\{\n';
    res += `    "id": "achive${i+1}",\n`;
    res += `    "icon": \{"x": ${icon_x}, "y": ${icon_y}\},\n`;
    res += `    "thumnail": \{"x": ${thumnail_x}, "y": ${thumnail_y}\},\n`;
    res += `    "title": "${title}",\n`;
    res += `    "description": "${description}",\n`;
    res += `    "detail": "${detail}",\n`;
    res += `    "gold": "${G}",\n`;
    res += '  \}'
  }
  res += '\n]\;';
  return res;
}
