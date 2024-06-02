import kaboom, { KaboomCtx } from "kaboom";

const canvas = document.getElementById("game") as HTMLCanvasElement;
let k: KaboomCtx | null = null;
if (canvas) {
  k = kaboom({
    global: false,
    touchToMouse: true,
    canvas: canvas,
  });
}

export default k;
