import p5 from 'p5';
import {
  button,
  checkbox,
  group,
  radio,
  slider,
  UniformButton,
  UniformRadio,
  UniformSlider,
} from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';
import PoissonDisc from './helpers/PoissonDisc';

const controls = {
  flow: {
    type: radio,
    value: 'swirl',
    options: ['noise', 'attractor', 'swirl'],
  },

  reset: { type: button, value: false },

  ttl: { type: slider, value: 40, min: 10, max: 240 },
  speed: { type: slider, value: 5, min: 1, max: 240 },
  alternate: { type: checkbox, value: false },

  angle: {
    type: slider,
    value: Math.PI / 3,
    min: 0,
    max: Math.PI * 2,
    step: 0.001,
  },

  spawn: {
    type: radio,
    value: 'poisson',
    options: ['poisson', 'random'],
  },
  attractors: {
    type: group,
    value: {
      distribution: {
        type: radio,
        value: 'poisson',
        options: ['poisson', 'circle'],
      },
      count: { type: slider, value: 4, min: 1, max: 10, step: 1 },
    },
  },
  noiseParams: {
    type: group,
    value: {
      inc: {
        type: slider,
        value: 0.0005,
        min: 0.0001,
        max: 0.005,
        step: 0.0001,
      },
      noiseIterations: { type: slider, value: 0, min: 0, max: 5 },
    },
  },
  minLength: { type: slider, value: 10, min: 1, max: 200, step: 1 },
  length: { type: slider, value: 50, min: 1, max: 200, step: 1 },
  debug: { type: checkbox, value: false },
};

export const sketcher = new Sketcher({
  title: 'flow',
  width: 1400 * 0.75,
  height: 1100 * 0.75,
  controls: controls,
  settings: {
    loop: true,
    redrawOnChanges: true,
  },

  sketch: (
    p: p5,
    s: Sketcher<typeof controls>,
    u: Uniforms<typeof controls>
  ) => {
    const COLORS = {
      BG: p.color(252),
      FG: p.color(42),
    };

    function fnoise(count: number, xoff: number, yoff: number) {
      let n = p.noise(xoff, yoff);
      for (let i = 0; i < count; i++) {
        n = p.noise(xoff + n, yoff + n);
      }
      return n;
    }

    function fnoiseImg(count: number) {
      const img = p.createImage(p.width, p.height);
      let yoff = 0;

      p.noiseDetail(8, 0.6);

      img.loadPixels();
      for (let y = 0; y < img.height; y++) {
        let xoff = 0;
        for (let x = 0; x < img.width; x++) {
          const index = (x + y * img.width) * 4;
          // let r = random(255);
          // const r = p.noise(xoff, yoff) * 255;

          const r = fnoise(count, xoff, yoff) * 255;

          img.pixels[index + 0] = r;
          img.pixels[index + 1] = 0;
          img.pixels[index + 2] = 0;
          img.pixels[index + 3] = 255;

          xoff += u.noiseParams.inc + 0.00001;
        }
        yoff += u.noiseParams.inc + 0.00001;
      }
      img.updatePixels();
      return img;
    }

    const MARGIN = {
      left: 150 * 0.75,
      right: 50 * 0.75,
      top: 50 * 0.75,
      bottom: 50 * 0.75,
    };

    class Particle {
      vel: p5.Vector;

      ttl: number;

      points: p5.Vector[];
      i: number;

      constructor(pos: p5.Vector) {
        this.vel = p.createVector(0);
        this.ttl = p.floor(p.random(10, u.ttl));

        this.i = 0;
        this.points = Array.from(
          { length: p.floor(p.random(u.minLength, u.length)) },
          () => pos.copy()
        );
      }

      update(vf: velocityFunc) {
        if (this.ttl-- <= 0) {
          this.reset(placePoint());
        }
        const curr = this.points[this.i];
        const nextI = (this.i + 1) % this.points.length;

        const v = vf(curr);
        this.vel.set(v);

        this.vel.limit(u.speed);

        this.points[nextI].set(curr);
        this.points[nextI].add(this.vel);
        this.i = nextI;
      }

      edges() {
        const pos = this.points[this.i];
        return pos.x < 0 || pos.y < 0 || pos.x > p.width || pos.y > p.height;
      }

      reset(pos: p5.Vector) {
        for (let i = 0; i < this.points.length; i++) {
          this.points[i].set(pos);
        }

        this.ttl = p.floor(p.random(10, u.ttl));

        this.vel.set(0);
      }

      show() {
        p.beginShape();

        function vert(pt: p5.Vector) {
          if (
            pt.x > MARGIN.left &&
            pt.x < p.width - MARGIN.right &&
            pt.y > MARGIN.top &&
            pt.y < p.height - MARGIN.bottom
          ) {
            p.vertex(pt.x, pt.y);
          }
        }

        for (const pt of this.points.slice(this.i + 1)) {
          vert(pt);
        }
        for (const pt of this.points.slice(0, this.i + 1)) {
          vert(pt);
        }
        p.endShape();
      }
    }

    let img: p5.Image;
    let disc: PoissonDisc;
    let particles: Particle[];
    let attractors: p5.Vector[];

    type velocityFunc = (p: p5.Vector) => p5.Vector;
    const velFuncs: {
      [Property: string]: velocityFunc;
    } = {
      noise: function (pt: p5.Vector): p5.Vector {
        // const sample = img.get(pt.x, pt.y)[0];
        const sample = fnoise(
          u.noiseParams.noiseIterations,
          pt.x * u.noiseParams.inc,
          pt.y * u.noiseParams.inc
        );
        const a = sample * p.TAU * 2;
        return p.createVector(Math.cos(a) * u.speed, Math.sin(a) * u.speed);
      },
      attractor: function (pt: p5.Vector): p5.Vector {
        const vel = p.createVector(0);
        for (let i = 0; i < attractors.length; i++) {
          const attractor = attractors[i];
          const diff = p5.Vector.sub(attractor, pt);
          const dist = diff.mag();
          diff.setMag(200 / dist);
          if (u.alternate && i % 2 == 0) {
            diff.mult(-1);
          }
          vel.add(diff);
        }
        vel.normalize().setMag(3);
        return vel;
      },
      swirl: function (pt: p5.Vector): p5.Vector {
        const vel = p.createVector(0);
        for (let i = 0; i < attractors.length; i++) {
          const attractor = attractors[i];
          const a = u.alternate && i % 2 != 0 ? -u.angle : u.angle;
          const diff = p5.Vector.sub(attractor, pt).rotate(a);
          const dist = diff.mag();
          diff.setMag(200 / dist);
          vel.add(diff);
        }
        vel.normalize().setMag(3);
        return vel;
      },
    };

    function placePoint() {
      switch (u.spawn) {
        case 'poisson':
          return disc.points[p.floor(p.random(disc.points.length))];
        case 'random':
        default:
          return p.createVector(p.random(p.width), p.random(p.height));
      }
    }

    function init() {
      img = fnoiseImg(u.noiseParams.noiseIterations);
      disc = new PoissonDisc({ p, r: 8 });
      particles = disc.points.map((v) => new Particle(v));
      attractors = new PoissonDisc({
        p,
        r: p.width / 5,
        maxPoints: 5,
        seedPoints: [p.createVector(p.width / 2, p.height / 2)],
      }).points;
    }

    function reset() {
      init();
    }

    function resetAttractors() {
      switch (u.attractors.distribution) {
        case 'poisson':
          attractors = new PoissonDisc({
            p,
            r: p.width / 5,
            maxPoints: 5,
            seedPoints: [p.createVector(p.width / 2, p.height / 2)],
          }).points;
          break;
        case 'circle':
          const da = p.TAU / u.attractors.count;
          const center = p.createVector(p.width / 2, p.height / 2);
          const radius = 200;
          attractors = Array.from({ length: u.attractors.count }, (_, k) => {
            const a = da * k;
            return center
              .copy()
              .add(p.createVector(Math.cos(a) * radius, Math.sin(a) * radius));
          });
          // attractors = [
          //   p.createVector(p.width / 3, p.height / 2),
          //   p.createVector((p.width / 3) * 2, p.height / 2),
          // ];
          break;
      }
    }

    (s.params.controls.reset as UniformButton).onClick = reset;
    (s.params.controls.attractors.value.distribution as UniformRadio).onChange =
      resetAttractors;
    (s.params.controls.attractors.value.count as UniformSlider).onChange =
      resetAttractors;
    (s.params.controls.noiseParams.value.inc as UniformSlider).onChange = init;

    p.setup = function () {
      s.setup(p)();
      init();
    };

    p.draw = function () {
      p.background(COLORS.BG);
      p.stroke(COLORS.FG);
      p.strokeWeight(1);
      p.noFill();

      if (u.debug) {
        if (u.flow == 'noise') {
          p.image(img, 0, 0);
        }

        if (u.flow == 'attractor' || u.flow == 'swirl') {
          p.push();
          p.strokeWeight(10);
          p.stroke('red');
          for (const attractor of attractors) {
            p.point(attractor);
          }
          p.pop();
        }
      }

      for (const particle of particles) {
        const vf = velFuncs[u.flow] || velFuncs.swirl;
        particle.update(vf);

        if (particle.edges()) {
          particle.reset(placePoint());
        }

        particle.show();
      }

      // p.image(img, 0, 0);
      // for (const pt of particles) {
      //   pt.show();
      //   pt.update(img);
      // }
    };
  },
});
