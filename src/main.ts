import { scaleFactor } from "./constants";
import k from "./kaboomCtx";
import { MapType, ObjectLayer } from "./type";
import { displayDialog, setCamScale } from "./utils";

const textboxform = document.getElementById('textbox') as HTMLFormElement
textboxform.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();
})

if (k && k !== null) {


  k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
      "idle-down": 936,
      "walk-down": { from: 936, to: 939, speed: 8, loop: true },
      "idle-side": 975,
      "walk-side": { from: 975, to: 978, speed: 8, loop: true },
      "idle-up": 1014,
      "walk-up": { from: 1014, to: 1017, speed: 8, loop: true },
    },
  });

  k.loadSprite("map", "./map.png");

  k.setBackground(k.Color.fromHex("311047"));

  k.scene("main", async () => {
    const mapData: MapType = await (await fetch("./map.json")).json();
    const layers = mapData.layers;

    const map = k!.make([k!.sprite("map"), k!.pos(0), k!.scale(scaleFactor)]);
    const player = k!.make([
      k!.sprite("spritesheet", { anim: "idle-down" }),
      k!.area({
        shape: new k!.Rect(k!.vec2(0, 3), 10, 10),
      }),
      k!.body(),
      k!.anchor("center"),
      k!.pos(),
      k!.scale(scaleFactor),
      // extra attributes
      {
        speed: 250,
        direction: "down",
        isInDialog: false,
      },
      "player", // tag
    ]);
    for (const layer of layers) {
      if (layer.name === "boundaries") {
        for (const boundary of (layer as ObjectLayer).objects) {
          map.add([
            k?.area({
              shape: new k!.Rect(k?.vec2(0), boundary.width, boundary.height),
            }),
            k?.body({ isStatic: true }),
            k?.pos(boundary.x, boundary.y),
            boundary.name,
          ]);
          if (boundary.name) {
            player.onCollide(boundary.name, () => {
              player.isInDialog = true;
              // TODO:
              displayDialog("Heyyy hello TODO", () => {
                player.isInDialog = false;
              });
            });
          }
        }
        k?.add(map);
        continue;
      }
      if (layer.name === "spawnpoints") {
        for (const entity of (layer as ObjectLayer).objects) {
          if (entity.name === "player") {
            player.pos = k?.vec2(
              (map.pos.x + entity.x) * scaleFactor,
              (map.pos.y + entity.y) * scaleFactor
            )!;
            k?.add(player);
            continue;
          }
        }
      }
    }

    setCamScale(k!);

    k?.onResize(() => {
      setCamScale(k!);
    });

    k?.onUpdate(() => {
      // console.log('player position', player.pos)
      k?.camPos(player.pos.x, player.pos.y + 100);
    });

    k?.onMouseDown((mouseBtn) => {
      if (mouseBtn !== "left" || player.isInDialog) return;
      const worldMousePos = k?.toWorld(k?.mousePos());
      // console.log('mouse position', worldMousePos)
      if (worldMousePos) {
        player.moveTo(k?.vec2(worldMousePos.x, worldMousePos.y)!, player.speed);

        // finding direction
        const mouseAngle = player.pos.angle(worldMousePos);
        const lowerBound = 50;
        const upperBound = 125;
        if (
          mouseAngle > lowerBound &&
          mouseAngle < upperBound &&
          player.curAnim() !== "walk-up"
        ) {
          player.play("walk-up");
          player.direction = "up";
          return;
        }

        if (
          mouseAngle < -lowerBound &&
          mouseAngle > -upperBound &&
          player.curAnim() !== "walk-down"
        ) {
          player.play("walk-down");
          player.direction = "down";
          return;
        }

        if (Math.abs(mouseAngle) < lowerBound) {
          player.flipX = true;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "left";
          return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
          player.flipX = false;
          if (player.curAnim() !== "walk-side") player.play("walk-side");
          player.direction = "right";
          return;
        }
      }
    });

    k?.onMouseRelease(() => {
      if (player.direction === "up") {
        player.play("idle-up");
        return;
      }
      if (player.direction === "down") {
        player.play("idle-down");
        return;
      }

      player.play("idle-side");
    });
  });

  k.go("main");
}
