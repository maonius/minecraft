let mainClass;
window.onload = function () {
  mainClass = new MinecraftAchivementManager();
}

window.onclick = function (e) {
  mainClass.onclick(e);
}

window.onkeydown = function (e) {
  mainClass.onkeydown(e);
}

