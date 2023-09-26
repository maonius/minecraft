let mainClass;
window.onload = function () {
  mainClass = new MinecraftAchivementManager();
}

window.onclick = function (e) {
  mainClass.onclick(e);
}

// doesn't work
window.ondblclick = function (e) {
  mainClass.onclick(e);
}
