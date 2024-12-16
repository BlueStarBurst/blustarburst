import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import reactLogo from 'assets/react.svg';

// https://vitejs.dev/guide/assets.html#explicit-url-imports
// that looks on the public directory
import viteLogo from '/vite.svg?url';

import plugImgSrc from 'assets/plug3.png';
import plugImg2Src from 'assets/plug2.png';
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
import { ThemeContext } from './ThemeProvider';
import { cn } from '@nextui-org/react';

export default function Canvas() {
  const { theme, setTheme } = useContext(ThemeContext);

  const scene = useRef<HTMLDivElement | null>(null);
  const view = useRef<HTMLCanvasElement | null>(null);
  const connections = useRef<{ [key: string]: Body | null }>({});
  const cooldown = useRef(false);
  const isPressed = useRef(false);
  const engine = useRef(Engine.create());
  const runner = useRef(Runner.create());
  const render = useRef<Render | null>(null);

  const [powered, setPowered] = useState<{ [key: string]: boolean }>({});

  const [start, started] = useState(false);

  function loadCanvas() {
    console.log('App mounted');

    connections.current = {};

    const cw = window.innerWidth;
    const ch = window.innerHeight;

    // engine.current.gravity.y = 0;

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

    if (render.current) {
      console.log('Render created');
    } else {
      console.log('Render not created');
      return;
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

    function createRope(
      x: number,
      y: number,
      length: number
    ): [Composite, Body] {
      const ropeA = Composites.stack(
        x,
        y,
        length,
        1,
        20,
        10,
        function (x: number, y: number) {
          return Bodies.rectangle(x, y, 50, 20, {
            collisionFilter: { category: groupRope, group: groupRope },
          });
        }
      );

      // // add a big circle at the end of the rope
      // Composite.add(
      //   ropeA,
      //   Bodies.circle(x + 50 * length, y, 40, {
      //     density: 0.001,
      //     collisionFilter: {
      //       group: groupRope,
      //       category: groupRope,
      //       mask: -1,
      //     },
      //   })
      // );

      const plug1 = Bodies.circle(x + 50 * length, y, 40, {
        density: 0.001,
        label: Math.random().toString(36).substring(7),
        collisionFilter: {
          group: groupRope,
          category: groupRope,
          mask: -1,
        },
      });

      Composite.add(ropeA, plug1);

      Composites.chain(ropeA, 0.5, 0, -0.5, 0, {
        stiffness: 0.4,
        length: 40,
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

      return [ropeA, plug1];
    }

    const wall = Bodies.rectangle((cw * 9) / 10, ch / 2 + 95 / 2, 130, 200, {
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

    const [wire1, plug1] = createRope(cw / 4, -300, ch / 80);
    const [wire2, plug2] = createRope(cw + 300, ch + 100, 7);

    const outlets = [outletRect, outletRect2];
    const wires = [wire1, wire2];
    const plugs = [plug1, plug2];

    const startConnections = [[plug2, outletRect2]];

    Composite.add(engine.current.world, wires);

    // Body.setPosition(ropeA.bodies[ropeA.bodies.length - 1], { x: cw / 4, y: -160 })
    // Body.setVelocity(ropeA.bodies[ropeA.bodies.length - 1], { x: -0.5, y: -1 });

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

    const plugImg1 = new Image(150, 150);
    plugImg1.src = plugImgSrc;
    plugImg1.onload = () => {
      render.current!.textures[reactLogo] = plugImg1;
    };

    const plugImg2 = new Image(125, 125);
    plugImg2.src = plugImg2Src;
    plugImg2.onload = () => {
      render.current!.textures[reactLogo] = plugImg2;
    };

    // Runner.start(runner.current, engine.current)

    function drawWire(ropeA: Composite, ctx: CanvasRenderingContext2D) {
      // draw curves between the rope parts
      const bodies = ropeA.bodies;
      const plug = ropeA.bodies[ropeA.bodies.length - 1];

      if (connections.current[plug.label]) {
        const lastIdx = ropeA.bodies.length - 2;
        const lastPart = ropeA.bodies[lastIdx + 1];
        // draw a wire from the plug to the outlet
        ctx.drawImage(
          plugImg2,
          lastPart.position.x - plugImg2.width / 2,
          lastPart.position.y - plugImg2.height / 2,
          plugImg2.width,
          plugImg2.height
        );
      }

      for (let i = 1; i < bodies.length; i += 1) {
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

      if (connections.current[plug.label]) return;

      const lastIdx = ropeA.bodies.length - 1;
      // draw image at x, y of last part of rope
      const part = ropeA.bodies[lastIdx];

      // draw a plug at the end of the rope with the same angle as the last part of the rope
      const angle = part.angle;
      ctx.save();
      ctx.translate(part.position.x, part.position.y);
      ctx.rotate(angle);
      ctx.drawImage(
        plugImg1,
        -plugImg1.width / 2,
        -plugImg1.height / 2,
        plugImg1.width,
        plugImg1.height
      );
      ctx.restore();
    }

    const outlet = new Image(125, 125);
    outlet.src = outletImg;
    outlet.onload = () => {
      render.current!.textures[viteLogo] = outlet;
    };

    const wallsocket = new Image(275, 275);
    wallsocket.src = wallsocketImg;
    wallsocket.onload = () => {
      render.current!.textures[viteLogo] = wallsocket;
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

    function checkPlugConnection(ropeA: Composite, body: Body) {
      const plug = ropeA.bodies[ropeA.bodies.length - 1];

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
        console.log('Checking connection', plug.label, body.label, plugs);

        if (connections.current[plug.label] === body) {
          return true;
        } else if (connections.current[plug.label]) {
          console.log('Disconnecting');
          body.collisionFilter.mask = groupRope;
          // remove constraint
          Composite.remove(
            ropeA,
            ropeA.constraints[ropeA.constraints.length - 1]
          );
        }

        connections.current[plug.label] = body;
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
      } else if (connections.current[plug.label] === body) {
        console.log('Disconnected');
        // remove constraint
        Composite.remove(
          ropeA,
          ropeA.constraints[ropeA.constraints.length - 1]
        );
        connections.current[plug.label] = null;
        body.collisionFilter.mask = groupRope;
      }
      return false;
    }

    let mouseOffset = { x: -1, y: -1 };

    Events.on(engine.current, 'afterUpdate', function () {
      const ctx = view.current?.getContext('2d');

      if (!ctx) return;

      if (startConnections.length > 0) {
        for (let i = 0; i < startConnections.length; i++) {
          // move the plugs to the outlets
          const plug = startConnections[i][0];
          const outlet = startConnections[i][1];

          if (connections.current[plug.label] === outlet) {
            // remove from startConnections
            startConnections.splice(i, 1);
          } else {
            // move the plug towards the outlet
            Body.setPosition(plug, {
              x: plug.position.x + (outlet.position.x - plug.position.x) / 2,
              y: plug.position.y + (outlet.position.y - plug.position.y) / 2,
            });
          }
        }
      }

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

        wires.forEach((ropeA) => {
          const plug = ropeA.bodies[ropeA.bodies.length - 1];

          if (connections.current[plug.label]) {
            // move plug to outlet
            Body.setPosition(plug, {
              x: connections.current[plug.label]!.position.x,
              y: connections.current[plug.label]!.position.y,
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
                pointA: {
                  x: connections.current[plug.label]!.position.x,
                  y: connections.current[plug.label]!.position.y,
                },
                stiffness: 0.1,
              })
            );
          }
        });
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
      wires.forEach((wire) => {
        outlets.forEach((element) => {
          const tmp = checkPlugConnection(wire, element);
        });
      });

      outlets.forEach((element) => {
        drawOutlet(ctx, element);
      });

      wires.forEach((wire) => {
        drawWire(wire, ctx);
      });

      plugs.forEach((plug) => {
        // if outside of the canvas, move it slowly to the center
        if (plug.position.x < 0 || plug.position.x > cw) {
          Body.setVelocity(plug, { x: 0, y: 0 });
          Body.setPosition(plug, {
            x: plug.position.x + (cw / 2 - plug.position.x) / 10,
            y: plug.position.y,
          });
        }
        if (plug.position.y < 0 || plug.position.y > ch) {
          Body.setVelocity(plug, { x: 0, y: 0 });
          Body.setPosition(plug, {
            x: plug.position.x,
            y: plug.position.y + (ch / 2 - plug.position.y) / 10,
          });
        }
      });
    });

    setTimeout(() => {
      Object.keys(connections.current).forEach((key) => {
        if (connections.current[key]) {
          console.log('Checking connection', plugs);
          const plug = plugs.find((plug) => plug.label === key);
          console.log(
            'Checking connection',
            key,
            plug,
            connections.current[key]
          );
          if (plug === undefined) {
            delete connections.current[key];
          }
        }
      });
    }, 1000);
  }

  function resizeCanvas() {
    console.log('Resizing canvas');

    const cw = window.innerWidth;
    const ch = window.innerHeight;

    render.current!.canvas.height = ch;
    render.current!.canvas.width = cw;

    render.current!.bounds.max.x = cw;
    render.current!.bounds.max.y = ch;

    const viewCurrent = view.current;
    if (!viewCurrent) return;

    viewCurrent.setAttribute('width', cw.toString());
    viewCurrent.setAttribute('height', ch.toString());
    viewCurrent.style.width = cw + 'px';
    viewCurrent.style.height = ch + 'px';
  }

  useEffect(() => {
    // remove all children of scene

    console.log('App mounted');

    if (scene.current) {
      scene.current.innerHTML = '';
      loadCanvas();
    }

    setTimeout(() => {
      resizeCanvas();
    }, 100);

    setInterval(() => {
      // check the connections
      // console.log(connections.current);
      setPowered(
        Object.values(connections.current).reduce((acc, value) => {
          if (value) {
            acc[value.label] = true;
          }
          return acc;
        }, {} as { [key: string]: boolean })
      );
    }, 100);

    window.addEventListener('resize', resizeCanvas);

    return () => {
      console.log('App unmounted');
      if (scene.current) {
        scene.current.innerHTML = '';
      }
      connections.current = {};
      Runner.stop(runner.current);
      // Render.stop(render.current);
      World.clear(engine.current.world, false);
      // render.current.textures = {};
    };
  }, []);

  useEffect(() => {
    if (powered['outlet2']) {
      setTheme('light');
    } else {
      setTheme('dark');
    }
    console.log('Powered:', powered);
  }, [powered]);

  return (
    <div
      className={cn(
        'h-screen w-screen',
        theme === 'light' ? 'bg-white' : 'bg-black'
      )}
    >
      <div ref={scene} className="h-screen w-screen opacity-10" />
      <canvas
        ref={view}
        className="absolute left-0 top-0 h-full w-full"
        style={{ pointerEvents: 'none' }}
      />
      {powered['outlet1'] && <div></div>}
    </div>
  );
}
