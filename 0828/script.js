const 시간12_공간 = document.querySelector("#시간-12 .공간");
const 시간12_스크롤 = document.querySelector("#시간-12 .스크롤");
const 손잡이1 = document.querySelector("#손잡이-1");
const 공백1 = document.querySelector("#공백-1");
// 요소가 없으면 null에서 에러가 나 스크립트 전체가 멈추므로 있을 때만 연결
if (시간12_공간) {
    시간12_공간.addEventListener("scroll", () => {
        const 트랙높이 = 400;
        const 보이는비율 = 0.5;
        const 손잡이이동가능거리 = 200;
        const 스크롤비율 = 시간12_공간.scrollTop / 400; //스크롤위치 / 스크롤이동가능거리
        손잡이1.style.transform = `translateY(${스크롤비율 * 손잡이이동가능거리}px)`;
    });
}

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

// temp-box-1 움직임
const tempBox1 = document.getElementById("temp-box-1");
let tempBox1PreviousTime = 0;
let isTempBox1Dragging = false;
let isTempBox1Falling = false;
let tempBox1OffsetX = 0;
let tempBox1OffsetY = 0;
let tempBox1FallFrame = null;

function removeTempBox1WhenTouchingTime12Right() {
    if (!tempBox1.isConnected) return true;

    const boxRect = tempBox1.getBoundingClientRect();
    const time12Rect = 시간12_공간.getBoundingClientRect();

    const touchesRightEdge =
        boxRect.left <= time12Rect.right &&
        boxRect.right >= time12Rect.right;

    const overlapsVertically =
        boxRect.top < time12Rect.bottom &&
        boxRect.bottom > time12Rect.top;

    if (!touchesRightEdge || !overlapsVertically) return false;

    isTempBox1Dragging = false;
    isTempBox1Falling = false;

    if (tempBox1FallFrame !== null) {
        cancelAnimationFrame(tempBox1FallFrame);
        tempBox1FallFrame = null;
    }

    tempBox1.remove();
    document.querySelector("#시간-12 .스크롤").style.display = "block";
    document.querySelector("#공백-1").style.display = "block";
    return true;
}

// 요소가 없으면 null에서 에러가 나므로 있을 때만 연결
if (tempBox1) {
    tempBox1.addEventListener("pointerdown", (e) => {
        if (tempBox1FallFrame !== null) {
            cancelAnimationFrame(tempBox1FallFrame);
            tempBox1FallFrame = null;
        }

        isTempBox1Dragging = true;
        isTempBox1Falling = false;

        const boxRect = tempBox1.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        tempBox1OffsetX = e.clientX - boxRect.left;
        tempBox1OffsetY = e.clientY - boxRect.top;

        canvas.appendChild(tempBox1);
        tempBox1.style.left = `${boxRect.left - canvasRect.left}px`;
        tempBox1.style.top = `${boxRect.top - canvasRect.top}px`;

        tempBox1.setPointerCapture(e.pointerId);
        tempBox1.style.cursor = "grabbing";
    });

    tempBox1.addEventListener("pointermove", (e) => {
        if (!isTempBox1Dragging) return;

        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - tempBox1OffsetX;
        const newY = e.clientY - canvasRect.top - tempBox1OffsetY;

        tempBox1.style.left = `${newX}px`;
        tempBox1.style.top = `${newY}px`;
    });

    tempBox1.addEventListener("pointerup", (e) => {
        if (!tempBox1.isConnected) return;

        isTempBox1Dragging = false;

        if (tempBox1.hasPointerCapture(e.pointerId)) {
            tempBox1.releasePointerCapture(e.pointerId);
        }

        tempBox1.style.cursor = "grab";

        if (removeTempBox1WhenTouchingTime12Right()) return;

        isTempBox1Falling = true;
        tempBox1PreviousTime = performance.now();
        tempBox1FallFrame = requestAnimationFrame(fallTempBox1);
    });

    tempBox1.addEventListener("pointercancel", () => {
        isTempBox1Dragging = false;
    });
}

function fallTempBox1(currentTime) {
    if (!isTempBox1Falling || !tempBox1.isConnected) {
        tempBox1FallFrame = null;
        return;
    }

    const deltaTime = (currentTime - tempBox1PreviousTime) / 1000;
    tempBox1PreviousTime = currentTime;

    const canvasRect = canvas.getBoundingClientRect();
    const floor = window.innerHeight - canvasRect.top - tempBox1.offsetHeight;
    let newY = tempBox1.offsetTop + fallingSpeed * deltaTime;

    if (newY >= floor) {
        newY = floor;
        isTempBox1Falling = false;
    }

    tempBox1.style.top = `${newY}px`;

    if (isTempBox1Falling) {
        tempBox1FallFrame = requestAnimationFrame(fallTempBox1);
    } else {
        tempBox1FallFrame = null;
    }
}
