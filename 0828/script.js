//물체 움직임
const 노독상 = document.querySelector(".노독상");
const canvas = document.querySelector(".canvas");
const fallingSpeed = 100;
let isDragging = false;
let startX = 0;
let startY = 0;
let startLeft = 0;
let startTop = 0;

노독상.addEventListener("pointerdown", (e) => {
    isDragging = true;
    // rotate가 걸려 있어 getBoundingClientRect 대신 회전 전 좌표(offsetLeft/Top)를 기준으로 삼는다
    startX = e.clientX;
    startY = e.clientY;
    startLeft = 노독상.offsetLeft;
    startTop = 노독상.offsetTop;
    // CSS의 right 기준 배치를 left/top 기준으로 전환
    노독상.style.right = "auto";
    노독상.style.left = `${startLeft}px`;
    노독상.style.top = `${startTop}px`;
    노독상.setPointerCapture(e.pointerId);
    노독상.style.cursor = "grabbing";
});

노독상.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    // 누른 지점에서 움직인 거리만큼 이동
    노독상.style.left = `${startLeft + e.clientX - startX}px`;
    노독상.style.top = `${startTop + e.clientY - startY}px`;
});

노독상.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    if (노독상.hasPointerCapture(e.pointerId)) {
        노독상.releasePointerCapture(e.pointerId);
    }
    노독상.style.cursor = "grab";
});

노독상.addEventListener("pointercancel", () => {
    isDragging = false;
    노독상.style.cursor = "grab";
});