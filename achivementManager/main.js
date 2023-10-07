const THUMBNAIL_W = 84;
const THUMBNAIL_H = 48;
let thumbnail_scale = 2;

let achivementClassNames = [];
let achivementClass = [];
let achivements = [];
let 
class MinecraftAchivement {
	constructor(pel, img, dat)
	{
		this.unlocked = localStorage.getItem(dat.id) == 'unlocked';
		this.initElement(img, dat);
	}
	initElement(img, dat)
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
		
		// draw canvas
		can.width  = THUMBNAIL_W * thumbnail_scale;
		can.height = THUMBNAIL_H * thumbnail_scale;
		let ctx = can.getContext('2d');
		ctx.drawImage(img,
			dat.thumnail.x * THUMBNAIL_W,
			dat.thumnail.y * THUMBNAIL_H,
			THUMBNAIL_W, THUMBNAIL_H, 0, 0,
			can.width, can.height
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
	btn.addEventListener('click', () => main.classList.toggle('dark') );
}

window.onload = function () {
	initAchivement();
	initElement();
};