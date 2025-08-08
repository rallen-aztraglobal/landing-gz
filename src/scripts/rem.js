function setRem() {
    const baseSize = 75; // 设计稿 750px：1rem = 75px
    let scale = document.documentElement.clientWidth / 750;
    if (scale > 1.4) scale = 1.4
    document.documentElement.style.fontSize = `${baseSize * scale}px`;
}
window.addEventListener("resize", setRem);
setRem();