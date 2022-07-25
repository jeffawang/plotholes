import p5 from 'p5';
import { checkbox, slider } from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  noiseSize: { type: slider, value: 0.02, min: 0.01, max: 0.05, step: 0.001 },
  gridSize: { type: slider, value: 10, min: 8, max: 100, step: 1 },
  move: { type: slider, value: 5, min: 1, max: 25, step: 1 },
  debug: { type: checkbox, value: false },
};

export const sketcher = new Sketcher({
  title: 'sight',
  width: 600,
  height: 600,
  controls: controls,
  settings: {
    loop: false,
    redrawOnChanges: true,
  },

  sketch: (
    p: p5,
    s: Sketcher<typeof controls>,
    u: Uniforms<typeof controls>
  ) => {
    const colors = {
      bg: p.color(252),
      fg: p.color(0),
      debug: p.color('red'),
    };

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    class Shape {
      points: p5.Vector[];
      constructor(points: p5.Vector[]) {
        this.points = points;
      }
      add(point: p5.Vector) {
        this.points.push(point);
      }
      draw() {
        p.beginShape();
        for (const pt of this.points) {
          p.vertex(pt.x, pt.y);
        }
        p.endShape(p.CLOSE);
      }
    }

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.strokeWeight(1);

      const center = p.createVector(p.width / 2, p.height / 2);

      p.translate(center);

      p.push();
      p.strokeWeight(10);
      p.point(0, 0);
      p.pop();

      const shapes: Shape[] = [];
      shapes[0] = new Shape([]);
      shapes[0].add(p.createVector(10, 100));
      shapes[0].add(p.createVector(60, 100));
      shapes[0].add(p.createVector(60, 200));
      shapes[0].add(p.createVector(10, 200));
      shapes[0].draw();

      shapes[1] = new Shape([]);
      shapes[1].add(p.createVector(50, -10));
      shapes[1].add(p.createVector(160, 10));
      shapes[1].add(p.createVector(60, -200));
      shapes[1].draw();

      shapes[2] = new Shape([]);
      shapes[2].add(p.createVector(-200, -200));
      shapes[2].add(p.createVector(-250, -150));
      shapes[2].add(p.createVector(-220, -100));
      shapes[2].add(p.createVector(-150, -130));
      shapes[2].add(p.createVector(-160, -180));
      shapes[2].draw();
    };
  },
});
