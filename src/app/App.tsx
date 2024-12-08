import { useCallback, useEffect, useRef, useState } from 'react';

import reactLogo from 'assets/react.svg';

// https://vitejs.dev/guide/assets.html#explicit-url-imports
// that looks on the public directory
import viteLogo from '/vite.svg?url';

import plugImg from 'assets/plug.png';
import plugImg2 from 'assets/plug2.png';
import outletImg from 'assets/outlet.png';
import wallsocketImg from 'assets/wallsocket.png';

import {
  Engine,
  Render,
  Bodies,
  World,
  Mouse,
  Body,
  Composite,
  Composites,
  Constraint,
  MouseConstraint,
  Runner,
  Events,
  Collision,
} from 'matter-js';

import './App.css';
import { group } from 'console';

function App() {
  const scene = useRef<HTMLDivElement | null>(null);
  const view = useRef<HTMLCanvasElement | null>(null);
  const connection = useRef<Body | null>(null);
  const cooldown = useRef(false);
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());
  const runner = useRef(Runner.create());
  const render = useRef(
    Render.create({
      element: scene.current as HTMLElement,
      engine: engine.current,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: 'transparent',
        showCollisions: true,
        showVelocity: true,
      },
    })
  );

  const powered = useRef<{ [key: string]: boolean }>({
    outlet1: false,
    outlet2: false,
  });
  const pow2 = useRef(false);
  const [pow, setPow] = useState(false);

  const [start, started] = useState(false);

  function loadCanvas() {
    console.log('App mounted');

    connection.current = null;

    const cw = window.innerWidth;
    const ch = window.innerHeight;

    engine.current.gravity.y = 0;

    if (scene.current && scene.current.children.length == 0) {
      console.log('Creating canvas');
      render.current = Render.create({
        element: scene.current as HTMLElement,
        engine: engine.current,
        options: {
          width: cw,
          height: ch,
          wireframes: false,
          background: 'transparent',
          showCollisions: true,
          showVelocity: true,
        },
      });
    }

    World.add(engine.current.world, [
      // Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
      Bodies.rectangle(-10, ch / 2, 20, ch * 3, { isStatic: true }),
      Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
      Bodies.rectangle(cw + 10, ch / 2, 20, ch * 3, { isStatic: true }),
    ]);

    Runner.run(runner.current, engine.current);
    Render.run(render.current);

    // add bodies
    const defaultCategory = 0x0001;
    const groupRope = 0x0002;
    const groupPlug = 0x0003;

    const ropeA = Composites.stack(
      cw / 4,
      -300,
      10,
      1,
      20,
      10,
      function (x: number, y: number) {
        return Bodies.rectangle(x, y, 50, 20, {
          collisionFilter: { category: groupRope },
        });
      }
    );

    // add a big circle at the end of the rope
    Composite.add(
      ropeA,
      Bodies.circle(450, -80, 40, {
        density: 0.001,
        collisionFilter: {
          category: groupRope,
          mask: defaultCategory | groupRope,
        },
      })
    );
    Composite.add(
      ropeA,
      Bodies.circle(250, -80, 40, {
        density: 0.0007,
        collisionFilter: {
          category: groupRope,
          mask: defaultCategory | groupRope,
        },
      })
    );

    Composites.chain(ropeA, 0.5, 0, -0.5, 0, {
      stiffness: 0.7,
      length: 20,
      render: { type: 'line' },
    });
    Composite.add(
      ropeA,
      Constraint.create({
        bodyB: ropeA.bodies[0],
        pointB: { x: -25, y: 0 },
        pointA: {
          x: ropeA.bodies[0].position.x,
          y: ropeA.bodies[0].position.y,
        },
        stiffness: 0.5,
      })
    );

    const wall = Bodies.rectangle((cw * 3) / 4, ch / 2 + 95 / 2, 130, 200, {
      isStatic: true,
      collisionFilter: { mask: defaultCategory },
      frictionAir: 0.1,
    });

    const outletRect = Bodies.rectangle(
      wall.position.x,
      wall.position.y - 45,
      40,
      40,
      { isStatic: true, collisionFilter: { mask: groupRope }, label: 'outlet1' }
    );
    const outletRect2 = Bodies.rectangle(
      wall.position.x,
      wall.position.y + 45,
      40,
      40,
      { isStatic: true, collisionFilter: { mask: groupRope }, label: 'outlet2' }
    );

    World.add(engine.current.world, [outletRect, outletRect2, wall]);

    const outlets = [outletRect, outletRect2];

    Composite.add(engine.current.world, [ropeA]);

    // Body.setPosition(ropeA.bodies[ropeA.bodies.length - 1], { x: cw / 4, y: -160 })
    Body.setVelocity(ropeA.bodies[ropeA.bodies.length - 1], { x: -0.5, y: -1 });

    // add mouse control
    const mouse = Mouse.create(render.current.canvas),
      mouseConstraint = MouseConstraint.create(engine.current, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: true,
          },
        },
      });

    Composite.add(engine.current.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.current.mouse = mouse;

    const plug = new Image(150, 150);
    plug.src = plugImg;
    plug.onload = () => {
      render.current.textures[reactLogo] = plug;
    };

    const plug2 = new Image(125, 125);
    plug2.src = plugImg2;
    plug2.onload = () => {
      render.current.textures[reactLogo] = plug2;
    };

    // Runner.start(runner.current, engine.current)

    function drawWire(ctx: CanvasRenderingContext2D) {
      // draw curves between the rope parts
      const bodies = ropeA.bodies;

      if (connection.current) {
        const lastIdx = ropeA.bodies.length - 2;
        const lastPart = ropeA.bodies[lastIdx + 1];
        // draw a wire from the plug to the outlet
        ctx.drawImage(
          plug2,
          lastPart.position.x - plug2.width / 2,
          lastPart.position.y - plug2.height / 2,
          plug2.width,
          plug2.height
        );
      }

      for (
        let i = 1;
        i < bodies.length - (connection.current ? 0 : 1);
        i += 1
      ) {
        // use bezierCurveTo to draw a curve between two particles
        const part1 = bodies[i - 1];
        const part2 = bodies[i];

        // use rotation of the part to set the control points of the bezier curve
        const control1 = {
          x: part1.position.x + 30 * Math.cos(part1.angle),
          y: part1.position.y + 30 * Math.sin(part1.angle),
        };
        const control2 = {
          x: part2.position.x - 30 * Math.cos(part2.angle),
          y: part2.position.y - 30 * Math.sin(part2.angle),
        };

        ctx.beginPath();
        ctx.moveTo(part1.position.x, part1.position.y);
        ctx.bezierCurveTo(
          control1.x,
          control1.y,
          control2.x,
          control2.y,
          part2.position.x,
          part2.position.y
        );
        // create outline of the curve
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 20;
        ctx.stroke();
        // fill the curve
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 16;
        ctx.stroke();
      }

      const lastIdx = ropeA.bodies.length - 2;
      // draw image at x, y of last part of rope
      const part = ropeA.bodies[lastIdx];

      // console.log(part.position.x, part.position.y, img.width, img.height, view.current?.getContext('2d'))

      // get rotation from the part to the part before it
      const rotation = Math.atan2(
        bodies[lastIdx + 1].position.y - bodies[lastIdx - 1].position.y,
        bodies[lastIdx + 1].position.x - bodies[lastIdx - 1].position.x
      );

      if (!connection.current) {
        ctx.save();
        ctx.translate(part.position.x, part.position.y);
        ctx.rotate(rotation);
        ctx.drawImage(plug, 0, -plug.height / 2, plug.width, plug.height);
        ctx.restore();
      }
    }

    const outlet = new Image(125, 125);
    outlet.src = outletImg;
    outlet.onload = () => {
      render.current.textures[viteLogo] = outlet;
    };

    const wallsocket = new Image(275, 275);
    wallsocket.src = wallsocketImg;
    wallsocket.onload = () => {
      render.current.textures[viteLogo] = wallsocket;
    };

    function drawWallSocket(ctx: CanvasRenderingContext2D, body: Body) {
      ctx.drawImage(
        wallsocket,
        body.position.x - wallsocket.width / 2,
        body.position.y - wallsocket.height / 2,
        wallsocket.width,
        wallsocket.height
      );
    }

    function drawOutlet(ctx: CanvasRenderingContext2D, body: Body) {
      ctx.drawImage(
        outlet,
        body.position.x - outlet.width / 2,
        body.position.y - outlet.height / 2,
        outlet.width,
        outlet.height
      );
    }

    function checkPlugConnection(body: Body) {
      if (cooldown.current)
        return (
          Collision.collides(body, ropeA.bodies[ropeA.bodies.length - 1])
            ?.collided ?? false
        );

      // check collision with plug
      if (
        Collision.collides(body, ropeA.bodies[ropeA.bodies.length - 1])
          ?.collided
      ) {
        console.log('Connected');

        if (connection.current == body) {
          return true;
        } else if (connection.current) {
          console.log('Disconnecting');
          body.collisionFilter.mask = groupRope;
          // remove constraint
          Composite.remove(
            ropeA,
            ropeA.constraints[ropeA.constraints.length - 1]
          );
        }

        connection.current = body;
        // move plug to outlet
        Body.setPosition(ropeA.bodies[ropeA.bodies.length - 1], {
          x: body.position.x,
          y: body.position.y,
        });
        Composite.add(
          ropeA,
          Constraint.create({
            bodyB: ropeA.bodies[ropeA.bodies.length - 1],
            pointB: { x: 0, y: 0 },
            pointA: { x: body.position.x, y: body.position.y },
            stiffness: 0.1,
          })
        );
        body.collisionFilter.mask = defaultCategory;
        cooldown.current = true;
        setTimeout(() => {
          cooldown.current = false;
        }, 1000);
        return true;
      } else if (connection.current === body) {
        console.log('Disconnected');
        // remove constraint
        Composite.remove(
          ropeA,
          ropeA.constraints[ropeA.constraints.length - 1]
        );
        connection.current = null;
        body.collisionFilter.mask = groupRope;
      }
      return false;
    }

    let mouseOffset = { x: -1, y: -1 };

    Events.on(engine.current, 'afterUpdate', function () {
      const ctx = view.current?.getContext('2d');

      if (!ctx) return;

      ropeA.bodies.forEach((element) => {
        Body.applyForce(element, element.position, { x: 0, y: 0.001 });
      });

      if (mouseConstraint.body == wall) {
        if (mouseOffset.x == -1 && mouseOffset.y == -1) {
          mouseOffset = {
            x: wall.position.x - mouse.position.x,
            y: wall.position.y - mouse.position.y,
          };
        }

        console.log('Wall is being dragged', mouseOffset);
        // wall.isStatic = false
        Body.setPosition(wall, {
          x: mouse.position.x + mouseOffset.x,
          y: mouse.position.y + mouseOffset.y,
        });
        // wall.position = { x: mouse.position.x + mouseOffset.current.x, y: mouse.position.y + mouseOffset.current.y }
        // set last part of rope to the wall position if connected
        if (connection.current && connection.current == outletRect) {
          Body.setPosition(ropeA.bodies[ropeA.bodies.length - 1], {
            x: outletRect.position.x,
            y: outletRect.position.y,
          });
          Body.setVelocity(ropeA.bodies[ropeA.bodies.length - 1], {
            x: 0,
            y: 0,
          });
          Composite.remove(
            ropeA,
            ropeA.constraints[ropeA.constraints.length - 1]
          );
          Composite.add(
            ropeA,
            Constraint.create({
              bodyB: ropeA.bodies[ropeA.bodies.length - 1],
              pointB: { x: 0, y: 0 },
              pointA: { x: outletRect.position.x, y: outletRect.position.y },
              stiffness: 0.1,
            })
          );
        } else if (connection.current && connection.current == outletRect2) {
          Body.setPosition(ropeA.bodies[ropeA.bodies.length - 1], {
            x: outletRect2.position.x,
            y: outletRect2.position.y,
          });
          Body.setVelocity(ropeA.bodies[ropeA.bodies.length - 1], {
            x: 0,
            y: 0,
          });
          Composite.remove(
            ropeA,
            ropeA.constraints[ropeA.constraints.length - 1]
          );
          Composite.add(
            ropeA,
            Constraint.create({
              bodyB: ropeA.bodies[ropeA.bodies.length - 1],
              pointB: { x: 0, y: 0 },
              pointA: { x: outletRect2.position.x, y: outletRect2.position.y },
              stiffness: 0.1,
            })
          );
        }
      } else {
        mouseOffset = { x: -1, y: -1 };
      }

      Body.setAngle(wall, 0);
      Body.setPosition(outletRect, {
        x: wall.position.x,
        y: wall.position.y - 45,
      });
      Body.setPosition(outletRect2, {
        x: wall.position.x,
        y: wall.position.y + 45,
      });

      // clear the canvas
      view.current
        ?.getContext('2d')
        ?.clearRect(0, 0, view.current.width, view.current.height);

      drawWallSocket(ctx, wall);
      outlets.forEach((element) => {
        const tmp = checkPlugConnection(element);
        if (element.label == 'outlet1' && tmp) {
          powered.current[element.label] = tmp;
          // setPow(tmp)
          pow2.current = tmp;
          // console.log('Setting power', element.label, tmp, powered.current)
        }
        drawOutlet(ctx, element);
      });
      drawWire(ctx);
    });
  }

  function resizeCanvas() {
    console.log('Resizing canvas');

    const cw = window.innerWidth;
    const ch = window.innerHeight;

    render.current.canvas.height = ch;
    render.current.canvas.width = cw;

    render.current.bounds.max.x = cw;
    render.current.bounds.max.y = ch;

    const viewCurrent = view.current;
    if (!viewCurrent) return;

    viewCurrent.setAttribute('width', cw.toString());
    viewCurrent.setAttribute('height', ch.toString());
    viewCurrent.style.width = cw + 'px';
    viewCurrent.style.height = ch + 'px';
  }

  useEffect(() => {
    // remove all children of scene

    if (scene.current) {
      scene.current.innerHTML = '';
      loadCanvas();
    }

    setTimeout(() => {
      resizeCanvas();
    }, 100);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      console.log('App unmounted');
      Runner.stop(runner.current);
      Render.stop(render.current);
      World.clear(engine.current.world, false);
      render.current.textures = {};
    };
  }, [scene.current]);

  return (
    <>
      <div ref={scene} className="w-screen h-screen opacity-10" />
      <canvas
        ref={view}
        className="w-full h-full absolute top-0 left-0"
        style={{ pointerEvents: 'none' }}
      />

      <div className="absolute w-screen h-screen top-0 left-0 text-black pointer-events-none">
        {pow2.current && <p>Bryant Hargreaves</p>}
      </div>
    </>
  );
}

export default App;
