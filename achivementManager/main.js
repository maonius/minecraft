const THUMBNAIL_W = 84;
const THUMBNAIL_H = 48;
let thumbnail_scale = 2;

let achiveImage = document.getElementById('achiveImage');
let achiveTitle = document.getElementById('achiveTitle');
let achiveDescription =
  document.getElementById('achiveDescription');
let achiveDetail = document.getElementById('achiveDetail');
let achiveButton = document.getElementById('achiveButton');
let selectedAchive = null;
function updateButtonStatus () {
  if (selectedAchive.unlocked) {
    achiveButton.innerHTML = "達成済みにする";
    achiveButton.classList.add('unlocked');
  } else {
    achiveButton.innerHTML = "固定する";
    achiveButton.classList.remove('unlocked');
  }
}
achiveButton.addEventListener('click',
  function () {
    selectedAchive.changeStatus();
    updateButtonStatus();
  }
);

let achivementClassNames = [];
let achivementClass = [];
let achivements = [];
class MinecraftAchivement {
	constructor(pel, img, dat)
	{
		this.unlocked = localStorage.getItem(dat.id) == 'unlocked';
    this.image = img;
    this.data  = dat;
		this.initElement(dat);
    this.initEvent();
	}
	initElement(dat)
	{
		// Class Element
		let name = dat.type;
		let idx = achivementClassNames.indexOf(name);
		if (idx == -1) {
			let pelm = document.getElementById('mainAchiveList');
			let classElm = document.createElement('div');
			let classTtl = document.createElement('div');
			let classCon = document.createElement('div');
			classElm.classList.add('achiveClass');
			classTtl.classList.add('classTitle');
			classCon.classList.add('classContainer');
			classTtl.innerHTML = name;
			pelm.appendChild(classElm);
			classElm.appendChild(classTtl);
			classElm.appendChild(classCon);
			
			idx = achivementClass.length;
			achivementClassNames.push(name);
			achivementClass.push(classCon);
		}
		
		// element
		let pel = achivementClass[idx];
		this.pelm = pel;
		let elm = document.createElement('div');
		let can = document.createElement('canvas');
		let che = document.createElement('div');
		elm.classList.add('achivement');
		if (this.unlocked) elm.classList.add('unlocked');
		che.classList.add('check');
		che.innerHTML = '✔︎';
		pel.appendChild(elm);
		elm.appendChild(can);
		elm.appendChild(che);
    this.elm = elm;
		this.drawImageTo(can);
	}
  drawImageTo(can)
  {
	  // draw canvas
    let dat = this.data;
		can.width  = THUMBNAIL_W * thumbnail_scale;
		can.height = THUMBNAIL_H * thumbnail_scale;
		let ctx = can.getContext('2d');
		ctx.drawImage(this.image,
			dat.thumnail.x * THUMBNAIL_W,
			dat.thumnail.y * THUMBNAIL_H,
			THUMBNAIL_W, THUMBNAIL_H, 0, 0,
			can.width, can.height
		);
  }
  changeStatus()
  {
    this.unlocked = !this.unlocked;
    localStorage.setItem(this.data.id,
      this.unlocked ? "unlocked" : "locked");
		if (this.unlocked) {
      this.elm.classList.add('unlocked');
    } else {
      this.elm.classList.remove('unlocked');
    }
  }
  onclick()
  {
    selectedAchive = this;
    this.drawImageTo(achiveImage);
    achiveTitle.innerHTML = this.data.title;
    achiveDescription.innerHTML = this.data.description;
    achiveDetail.innerHTML = this.data.detail;
    updateButtonStatus();
  }
  ondblclick()
  {
    this.changeStatus();
    updateButtonStatus();
  }
  // event module
  initEvent()
  {
    let self = this;
    this.elm.addEventListener('click',
      () => self.onclick()
    );
    this.elm.addEventListener('dblclick',
      () => self.ondblclick()
    );
  }
}

function initAchivement() {
	let pel = document.getElementById('mainAchiveList');
	let img = document.getElementById('thumbnail');
	for (let i in ACHIVEMENT_DATA) {
		const DATA = ACHIVEMENT_DATA[i];
		// setup elements
		let achi = new MinecraftAchivement(pel, img, DATA);
		achivements.push(achi);
	}
}

function initElement() {
	let main = document.getElementById('main');
	let btn  = document.getElementById('themeButton');
	btn.addEventListener('click',
    function () {
      main.classList.toggle('dark');
      let tf = main.classList.contains('dark')
      localStorage.setItem('dark', tf ? 'dark' : 'light');
    }
  );
  if (localStorage.getItem('dark') == 'dark') {
    main.classList.add('dark');
  }
}

window.onload = function () {
	initAchivement();
	initElement();
  achivements[0].onclick();
};
