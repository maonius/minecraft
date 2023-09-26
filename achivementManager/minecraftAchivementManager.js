class MinecraftAchivementManager {
  constructor ()
  {
    this.initializeAchiveData();
    this.initializeImageData();
    this.initializeElement();
    this.drawAll();
  }
  initializeAchiveData()
  {
    /*
      "id": "string",
      "title": "string",
      "type": "string or undefined"
      "description": "string",
      "detail": "string",
      "icon": {"x": int, "y": int},
      "thumnail": {"x": int, "y": int},
      gold: "string",
    */
    // organize achivement data from data source ;)
    this.achives = [];
    for (let i in ACHIVEMENT_DATA) {
      const src = ACHIVEMENT_DATA[i];
      let data         = {};
      data.id          = src.id;
      data.title       = src.title;
      data.type        = src.type ? src.type : "unclassified";
      data.description = src.description;
      data.detail      = src.detail;
      data.icon        = {};
      data.icon.x      = src.icon.x;
      data.icon.y      = src.icon.y;
      data.thum        = {};
      data.thum.x      = src.thumnail.x;
      data.thum.y      = src.thumnail.y;
      data.thum_x      = data.thum.x;
      data.thum_y      = data.thum.y;
      data.gold        = src.gold;
      data.unlocked=localStorage.getItem(src.id) == 'unlocked';
      this.achives.push(data);
    }
  }
  initializeImageData()
  {
    this.imag_data = {
      thum: {
        id: 'thum_imag',
        img_w: 84,
        img_h: 48,
        scale: 2
      },
      icon: {
        id: 'icon_imag',
        img_w: 47,
        img_h: 47,
        scale: 2
      }
    };
    for (let id in this.imag_data) {
      let d = this.imag_data[id];
      d.img = document.getElementById(d.id);
      d.can_w = d.img_w * d.scale;
      d.can_h = d.img_h * d.scale;
    }
  }
  initializeElement()
  {
    // get element node
    this.achivelist_elm = document.getElementById('achivelist');
    this.achiveinfo_elm = document.getElementById('achiveinfo');
    // initialize element to classify achive
    // find every type name
    let types = [];
    for (let i in this.achives) {
      const type = this.achives[i].type;
      if (types.indexOf(type) == -1) {
        types.push(type);
      }
    }
    // create element for achive type
    for (let i in types) {
      // elm (parent)
      // - ttl (title)
      // - con (container)
      let elm = document.createElement('div');
      elm.classList.add(types[i]);
      let ttl = document.createElement('div');
      ttl.innerHTML = types[i];
      ttl.classList.add('title');
      let con = document.createElement('div');
      con.classList.add('container');

      elm.appendChild(ttl);
      elm.appendChild(con);
      this.achivelist_elm.appendChild(elm);
    }
    // initialize achive elements
    this.list_type = 'thum'; // thum or icon
    for (let i in this.achives) {
      let achi = this.achives[i];
      let type = achi.type;
      let pelm = document.querySelector(
        `#achivelist > .${type} > .container`);
      let elm = document.createElement('div');
      elm.classList.add('achive');
      achi.elm = elm;
      let can = document.createElement('canvas');
      achi.can = can;
      elm.appendChild(can);
      pelm.appendChild(elm);
      // resize canvas
      this.setListType(achi, this.list_type);
      achi.imag = this.imag_data[this.list_type];
      this.resizeCanvas(achi);
    }
    this.achive_thumbnail =
      document.getElementById('achive_thumnail');
    this.achive_title = 
      document.getElementById('achive_title');
    this.achive_description =
      document.getElementById('achive_description');
    this.achive_detail =
      document.getElementById('achive_detail');
    this.achive_button =
      document.getElementById('achive_button');
    this.achive_thumbnail.width =
      this.imag_data.thum.can_w;
    this.achive_thumbnail.height =
      this.imag_data.thum.can_h;
  }
  setListType(achi, list_type)
  {
    let imag_data = this.imag_data[list_type];
    achi.list_type = list_type;
    achi.img   = imag_data.img;
    achi.can_w = imag_data.can_w;
    achi.can_h = imag_data.can_h;
    achi.img_w = imag_data.img_w;
    achi.img_h = imag_data.img_h;
    achi.img_x = achi[list_type].x * achi.img_w;
    achi.img_y = achi[list_type].y * achi.img_h;
  }
  resizeCanvas(achi)
  {
    let can = achi.can;
    let img = achi.imag;
    can.width  = achi.can_w;
    can.height = achi.can_h;
  }
  drawAll()
  {
    for (let i in this.achives) {
      let achi = this.achives[i];
      this.draw(achi);
    }
  }
  draw(achi)
  {
    let can = achi.can;
    let ctx = can.getContext('2d');
    // draw image
    ctx.drawImage(achi.img,
      achi.img_x, achi.img_y, achi.img_w, achi.img_h,
      0, 0, achi.can_w, achi.can_h
    );

    if (achi.unlocked) {
      let can = achi.can;
      let ctx = can.getContext('2d');
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, can.width, can.height);
      ctx.globalAlpha = 1;
      ctx.font = '40px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText('✓', can.width>>1, can.height>>1);
    }
  }
  selectAchive(achi)
  {
    if (this.selectedAchive) {
      this.selectedAchive.elm.classList.remove('selected');
    } this.selectedAchive = achi;
    this.selectedAchive.elm.classList.add('selected');

    // draw thumnail
    let can = this.achive_thumbnail;
    let ctx = can.getContext('2d');
    ctx.drawImage(this.imag_data.thum.img,
      achi.thum_x * this.imag_data.thum.img_w,
      achi.thum_y * this.imag_data.thum.img_h,
      this.imag_data.thum.img_w,
      this.imag_data.thum.img_h,
      0, 0,
      can.width, can.height
    );
    this.achive_title.innerHTML = achi.title;
    this.achive_description.innerHTML = achi.description;
    this.achive_detail.innerHTML = achi.detail;
    this.setButtonAs(achi.unlocked);

  }
  setButtonAs(unlocked) {
    // unlocked: Bool
    if (unlocked) {
      this.achive_button.classList.add('unlocked');
      this.achive_button.innerHTML = '固定する';
    } else {
      this.achive_button.classList.remove('unlocked');
      this.achive_button.innerHTML = '達成済みにする';
    }
  }
  setAchiveStatus(achi, unlocked)
  {
    achi.unlocked = unlocked;
    if (unlocked) {
      achi.elm.classList.add('unlocked');
      this.achive_button.innerHTML = '固定する';
    } else {
      achi.elm.classList.remove('unlocked');
      this.achive_button.innerHTML = '達成済みにする';
    }
    localStorage.setItem(
      achi.id,
      unlocked ? 'unlocked' : 'locled'
    );
    this.draw(achi);
  }
  changeSelectedAchiveStatus()
  {
    this.setAchiveStatus(
      this.selectedAchive,
      !this.selectedAchive.unlocked
    );
  }
  onclick(e)
  {
    // list(.achive) or button(#achive_button)
    let elm = e.target;
    if (elm.parentElement.classList.contains('achive')) {
      // update info
      let targetAchive = null;
      for (let i in this.achives) {
        if (this.achives[i].can == elm) {
          targetAchive = this.achives[i];
        }
      }
      if (!targetAchive) console.log("achive error");
      this.selectAchive(targetAchive);
    } else if (elm.id == 'achive_button') {
      this.changeSelectedAchiveStatus();
    }
  }
  dblclick(e)
  {
    let elm = e.target;
    console.log('dblclick')
    if (elm.parentElement.classList.contains('achive')) {
      let targetAchive = null;
      for (let i in this.achives) {
        if (this.achives[i].can == elm) {
          targetAchive = this.achives[i];
          break;
        }
      }
      this.changeSelectedAchiveStatus();
    }
  }
}
