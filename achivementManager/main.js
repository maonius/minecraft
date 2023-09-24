let mainClass;

const AchivementData = [
  {
    "id": "Taking_Inventory",
    "type": "minecraft",
    "icon": {"x": 12, "y": 3},
    "thumnail": {"x": 0, "y": 1},
    "title": "持ち物ゲット",
    "description": "持ち物を開こう．"
  },{
    "id": "Getting_Wood",
    "type": "minecraft",
    "icon": {"x": 8, "y": 1},
    "thumnail": {"x": 0, "y": 2},
    "title": "木を手に入れよう",
    "description": 
      "木のブロックが出てくるまで衝撃を与えよう．"
  }
];

class AchivementManager {
  constructor() {
    this.data = Object.assign(AchivementData);
  }
  loadLocalData() {
    
  }
  saveLocalData() {

  }
}

class MainClass {
  constructor() {
    this.icon_size = 47*2;
    this.icon_imag = new Image();
    this.icon_imag.src = "small_icon.png";
    this.icon_trim_size = 47*2;

    this.thumnail_imag = new Image();
    this.thumnail_imag.src = "big_icon.png";
    this.thumnail_trim_w = 84;
    this.thumnail_trim_h = 48;
    this.thumnail_w = this.thumnail_trim_w * 2;
    this.thumnail_h = this.thumnail_trim_h * 2;

    this.thumnail_elm =
      document.getElementById('achive_thumnail');
    this.title_elm   =
      document.getElementById('achive_title');
    this.description_elm =
      document.getElementById('achive_description');
    this.thumnail_elm.width  = this.thumnail_w;
    this.thumnail_elm.height = this.thumnail_h;

    this.manager = new AchivementManager();
    this.elms = [];
    this.initElement();
  }
  initElement() {
    // main element
    var elm = document.getElementById('main');
    // load data and display
    this.left_elm  = document.getElementById('left');
    this.right_elm = document.getElementById('right');
    const DATA = this.manager.data;
    // init type
    let type_arr = [];
    for (let i in DATA) {
      const type = DATA[i].type;
      if (type_arr.indexOf(type) == -1) {
        type_arr.push(type);
      }
    }
    for (let i in type_arr) {
      const type = type_arr[i];
      this.appendType(type);
    }
    // init elm
    for (let i in DATA) {
      const d = DATA[i];
      this.appendAchive(d);
    }
  }
  appendType(type) {
    let pElm = this.left_elm;
    let elm = document.createElement('div');
    elm.classList.add('achive_type');
    elm.classList.add(type);
    let ttl = document.createElement('div');
    ttl.classList.add('title');
    ttl.classList.add(type);
    ttl.innerHTML = type;
    let con = document.createElement('div');
    con.classList.add('container');

    elm.appendChild(ttl);
    elm.appendChild(con);
    pElm.appendChild(elm);
  }
  appendAchive(d) {
    let type = d.type;
    let pElm = document.querySelector(
      `#main > #left > .${type} > .container`);
    let elm = document.createElement('div');
    elm.classList.add('achive');
    elm.classList.add(d.id);
    let can = document.createElement('canvas');
    let s1 = this.icon_size;
    let s2 = this.icon_trim_size;
    can.width = can.height = s1;
    let con = can.getContext('2d');
    con.drawImage(this.icon_imag, 
      d.icon.x * s2, d.icon.y * s2, s2, s2,
      0, 0, s1, s1
    );
    elm.appendChild(can);
    pElm.appendChild(elm);
  }
  selectAchive(elm) {
    let data = this.manager.data;
    // find achive data
    let achiveData = null;
    for (let i in data) {
      let d = data[i];
      if (elm.classList.contains(d.id)) {
        achiveData = d;
        break;
      }
    }
    if (achiveData == null) {
      console.log('can not find achive of ', elm);
    }
    // select achive element
    if (this.selectedElm) {
      this.selectedElm.classList.remove('selected');
    } this.selectedElm = elm;
    this.selectedElm.classList.add('selected');
    console.log('selected achive ', achiveData.id);
    
    // display achive data
    let can = this.thumnail_elm;
    let ctx = this.thumnail_elm.getContext('2d');
    let x = this.thumnail_trim_w * achiveData.thumnail.x;
    let y = this.thumnail_trim_h * achiveData.thumnail.y;
    console.log(x, y, this.thumnail_imag, can.width);
    ctx.drawImage(
      this.thumnail_imag,
      x, y, this.thumnail_trim_w, this.thumnail_trim_h,
      0, 0, can.width, can.height
    );
    this.title_elm.innerHTML = achiveData.title;
    this.description_elm.innerHTML= achiveData.description;
  }
}

window.onload = function () {
  mainClass = new MainClass();
};

window.onclick = function (e) {
  let elm = e.target;
  if (elm.parentElement.classList.contains('achive')) {
    mainClass.selectAchive(elm.parentElement);
  } 
}


