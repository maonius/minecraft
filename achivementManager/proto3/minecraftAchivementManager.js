class MinecraftAchivement {
  constructor (achi_data, parent)
  {
    this.parent = parent;
    this.setAchiveData(achi_data);
  }
  setAchiveData(achi_data)
  {
    let src = achi_data;
    // organize achivement data from data source ;)
    this.id          = src.id;
    this.title       = src.title;
    this.type        = src.type ? src.type : 'unclassified';
    this.description = src.description;
    this.detail      = src.detail;
    this.icon        = {};
    this.icon_x      = src.icon.x;
    this.icon_y      = src.icon.y;
    this.thum        = {};
    this.thum.x      = src.thumnail.x;
    this.thum.y      = src.thumnail.y;
    this.gold        = src.gold;
    this.unlocked    =
      localStorage.getItem(src.id) == 'unlocked';
  }
  createElement()
  {
    let pelm = document.querySelector(
      `#achivelist > .${this.type} > .container`);
    let elm = document.createElement('elm');
    let can = document.createElement('canvas');
    elm.classList.add('achive');
    this.elm = elm;
    this.can = can;
    elm.appendChild(can);
    pelm.appendChild(elm);
    
    // add event listener
    let self = this;
    can.addEventListener('dblclick',
      () => self.dblclick()
    );
  }
  dblclick()
  {
    this.changeStatus();
    if (this.parent.selectedAchive == this) {
      this.parent.setButtunAsUnlocked(this.unlocked);
    }
  }
  setImageData(imag_data)
  {
    let d = imag_data;
    this.img   = d.img;
    this.img_x = d.img_w * this[d.id].x;
    this.img_y = d.img_h * this[d.id].y;
    this.img_w = d.img_w;
    this.img_h = d.img_h;
    this.can_w = d.img_w * d.can_s;
    this.can_h = d.img_h * d.can_s;
    this.resizeCanvas();
    this.draw();
  }
  resizeCanvas()
  {
    this.can.width  = this.can_w;
    this.can.height = this.can_h;
  }
  changeStatus()
  {
    this.unlocked = !this.unlocked;
    localStorage.setItem(
      this.id, this.unlocked ? 'unlocked': 'locked');
    this.draw();
  }
  draw()
  {
    let can = this.can;
    let con = this.can.getContext('2d');
    con.drawImage(this.img,
      this.img_x, this.img_y,
      this.img_w, this.img_h,
      0, 0,
      this.can_w, this.can_h
    );
    
    if (this.unlocked) {
      con.globalAlpha = 0.5;
      con.fillStyle = 'black';
      con.fillRect(0, 0, can.width, can.height);
      con.globalAlpha = 1;
      con.font = '40px serif';
      con.textAlign = 'center';
      con.textBaseline = 'middle';
      con.fillStyle = 'white';
      con.fillText('✓', can.width>>1, can.height>>1);
    }
  }
}

class MinecraftAchivementManager {
  constructor ()
  {
    this.initializeAchives();
    this.thumbnail_mode = 'thum';
    this.initializeImages();
    this.initializeElement();
  }
  initializeAchives()
  {
    this.achives = [];
    for (let i in ACHIVEMENT_DATA) {
      let achi_data = ACHIVEMENT_DATA[i];
      let achive = new MinecraftAchivement(achi_data, this);
      this.achives.push(achive);
    }
  }
  initializeImages()
  {
    this.image_data = {
      thum: { 
        id:'thum', img_w: 84, img_h: 48,
        can_s: 2,
        img: document.getElementById('thum_imag')
      },
      icon: {
        id: 'icon', img_w: 47, img_h: 48,
        can_s: 2,
        img: document.getElementById('icon_imag')
      },
    };
  }
  initializeElement()
  {
    // get element note
    this.achivelist_elm = document.getElementById('achivelist');
    this.achiveinfo_elm = document.getElementById('achiveinfo');
    this.achiveinfo_elm.style.width = '256px';

    // create element for achive type
    let types = [];
    for (let i in this.achives) {
      const type = this.achives[i].type;
      if (types.indexOf(type) == -1) {
        types.push(type);
        let elm = document.createElement('div');
        elm.classList.add(type);
        let ttl = document.createElement('div');
        ttl.classList.add('title');
        ttl.innerHTML = type;
        let con = document.createElement('div');
        con.classList.add('container');
        elm.appendChild(ttl);
        elm.appendChild(con);
        this.achivelist_elm.appendChild(elm);
      }
    }
    // create element for achives
    for (let i in this.achives) {
      let achi = this.achives[i];
      let imag = this.image_data[this.thumbnail_mode];
      achi.createElement();
      achi.setImageData(imag);
    }
    // create element for achive infomation
    this.info_can
      = document.getElementById('achive_thumnail');
    this.info_ttl
      = document.getElementById('achive_title');
    this.info_description
      = document.getElementById('achive_description');
    this.info_detail
      = document.getElementById('achive_detail');
    this.info_btn
      = document.getElementById('achive_button');
  }
  selectAchive(achive)
  {
    if (this.selectedAchive) {
      
      this.selectedAchive.elm.classList.remove('selected');
    }
    this.selectedAchive = achive;
    this.selectedAchive.elm.classList.add('selected');
    let can = this.info_can;
    can.width  = achive.can_w;
    can.height = achive.can_h;
    let con = this.info_can.getContext('2d');
    console.log(can);
    con.drawImage(achive.img,
      achive.img_x, achive.img_y,
      achive.img_w, achive.img_h,
      0, 0,
      can.width, can.height
    );
    this.info_ttl.innerHTML = achive.title;
    this.info_description.innerHTML = achive.description;
    this.info_detail.innerHTML = achive.detail;
    this.setButtonAsUnlocked(achive.unlocked);
  }
  setButtonAsUnlocked(unlocked)
  {
    if (unlocked) {
      this.info_btn.classList.add('unlocked');
      this.info_btn.innerHTML = '固定する';
    } else {
      this.info_btn.classList.remove('unlocked');
      this.info_btn.innerHTML = '達成済みにする';
    }
  }
  changeStatus(achive)
  {
    achive.changeStatus();
    if (achive == this.selectedAchive) {
      this.setButtonAsUnlocked(achive.unlocked);
    }
  }
  onkeydown(e) {}
  onclick(e)
  {
    let tar = e.target;
    if (tar.parentElement.classList.contains('achive')) {
      let targetAchive = null;
      for (let i in this.achives) {
        if (this.achives[i].can == tar) {
          targetAchive = this.achives[i];
          break;
        }
      }
      if (!targetAchive) console.log("achive error");
      this.selectAchive(targetAchive);
    } else if (tar.id == 'achive_button') {
      this.changeStatus(this.selectedAchive);
    }
  }
}
