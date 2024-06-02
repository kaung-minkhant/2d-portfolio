import { KaboomCtx } from "kaboom";

export function displayDialog(text: string, onDisplayEnd: any) {
  const dialogUI = document.getElementById(
    "textbox-container"
  ) as HTMLDivElement;
  const dialog = document.getElementById("dialog") as HTMLParagraphElement;
  const closeBtn = document.getElementById("close") as HTMLButtonElement;

  dialogUI.style.display = "block";

  closeBtn.focus()

  let index = 0;
  let currentText = "";
  const interval = setInterval(() => {
    if (index < text.length) {
      currentText += text[index];
      dialog.innerHTML = currentText;
      index++;
      return;
    }
    clearInterval(interval);
  }, 50);


  function onCloseButtonClick() {
    onDisplayEnd();
    dialogUI.style.display = "none";
    dialog.innerHTML = "";
    clearInterval(interval);
    closeBtn.removeEventListener("click", onCloseButtonClick);

  }

  closeBtn.addEventListener("click", onCloseButtonClick);
}

export function setCamScale(k: KaboomCtx) {
  const resizeFactor = k.width() / k.height()
  if (resizeFactor < 1) {
    k.camScale(k.vec2(1))
    return;
  }

  k.camScale(k.vec2(1.5))
}