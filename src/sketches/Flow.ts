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
import { scaledMargin, effectiveCenter } from './helpers/Book';

const controls = {
  flow: {
    type: radio,
    value: 'swirl',
    options: ['noise', 'attractor', 'swirl'],
  },

  reset: { type: button, value: false },

  ttl: { type: slider, value: 400, min: 10, max: 240 },
  speed: { type: slider, value: 5, min: 1, max: 240 },
  frameIter: { type: slider, value: 50, min: 0, max: 100 },
  minDist: { type: slider, value: 5, min: 3, max: 100 },
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
    value: 'random',
    options: ['poisson', 'random', 'jobard'],
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
  maxLength: { type: slider, value: 100, min: 1, max: 200, step: 1 },
  debug: { type: checkbox, value: false },
};

export const sketcher = new Sketcher({
  title: 'flow',
  width: 1400 * 0.5,
  height: 1100 * 0.5,
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

    const MARGIN = scaledMargin(0.75);

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
          { length: p.floor(p.random(u.minLength, u.maxLength)) },
          () => pos.copy()
        );
      }

      update(vf: velocityFunc) {
        if (this.ttl-- <= 0) {
          // this.reset(placePoint());
          return;
        }
        const curr = this.points[this.i];
        const nextI = (this.i + 1) % this.points.length;

        const v = vf(curr);
        this.vel.set(v);

        this.vel.limit(u.speed);

        const maybeNext = curr.copy().add(this.vel);
        const neighbors = grid.neighbors(maybeNext);

        if (
          maybeNext.x < MARGIN.left ||
          maybeNext.x > p.width - MARGIN.right ||
          maybeNext.y < MARGIN.top ||
          maybeNext.y > p.height - MARGIN.bottom
        )
          return;

        for (const neighbor of neighbors.values()) {
          if (neighbor === this) {
            continue;
          }
          for (const pt of neighbor.points) {
            if (maybeNext.dist(pt) < grid.size) {
              return;
            }
          }
        }
        this.points[nextI].set(maybeNext);
        grid.add(this.points[nextI], this);
        this.i = nextI;
      }

      edges() {
        const pos = this.points[this.i];
        return pos.x < 0 || pos.y < 0 || pos.x > p.width || pos.y > p.height;
      }

      reset(pos?: p5.Vector) {
        if (!pos) return;
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

    let grid: Grid;

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

    function jobard() {
      const attempts = 50;
      for (let i = 0; i < attempts; i++) {
        if (particles.length == 0) {
          return p.createVector(p.random(p.width), p.random(p.height));
        }
        const randomParticle = particles[p.floor(p.random(particles.length))];
        const randomPoint =
          randomParticle.points[
            p.floor(p.random(randomParticle.points.length))
          ];

        // const pos = p.createVector(p.random(p.width), p.random(p.height));
        const pos = grid.annulus(randomPoint);
        if (grid.check(pos)) {
          return pos;
        }
      }
      return undefined;
    }

    function placePoint() {
      switch (u.spawn) {
        case 'poisson':
          return disc.points[p.floor(p.random(disc.points.length))];
        case 'jobard':
          return jobard();
        case 'random':
        default: {
          const pos = p.createVector(p.random(p.width), p.random(p.height));
          if (grid.check(pos)) return pos;
        }
      }
    }

    const gridSize = 3;

    class Grid {
      grid: Set<Particle>[];
      size: number;

      private rows: number;
      private cols: number;

      constructor(gridSize: number) {
        this.size = gridSize;
        this.rows = p.ceil(p.height / gridSize);
        this.cols = p.ceil(p.width / gridSize);
        this.grid = Array.from(
          { length: this.rows * this.cols },
          () => new Set()
        );
      }

      cellID(pos: p5.Vector) {
        return (
          p.floor(pos.y / this.size) * this.cols + p.floor(pos.x / this.size)
        );
      }

      cell(pos: p5.Vector): Set<Particle> {
        // console.log(this.grid.length, this.cellID(pos));
        return this.grid[this.cellID(pos)];
      }

      neighbors(pos: p5.Vector): Set<Particle> {
        const neighbors = new Set<Particle>();
        const i = Math.floor(pos.x / this.size);
        const j = Math.floor(pos.y / this.size);
        const x0 = Math.max(0, i - 2);
        const x1 = Math.min(this.cols, i + 2);
        const y0 = Math.max(0, j - 2);
        const y1 = Math.min(this.rows, j + 2);

        for (let y = y0; y < y1; y++) {
          const row = y * this.cols;
          for (let x = x0; x < x1; x++) {
            const cell = this.grid[row + x];
            for (const particle of cell) {
              neighbors.add(particle);
            }
          }
        }
        return neighbors;
      }

      add(pos: p5.Vector, part: Particle) {
        const cell = this.cell(pos);
        cell.add(part);
      }

      annulus(pt: p5.Vector) {
        // https://stackoverflow.com/questions/9048095/create-random-number-within-an-annulus/9048443#9048443
        const theta = p.random(p.TAU);
        const rMax = this.size * 2;
        const rMin = this.size;
        const A = 2 / (rMax * rMax - rMin * rMin);
        const radius = Math.sqrt((2 * Math.random()) / A + rMin * rMin);
        return p.createVector(
          pt.x + radius * Math.cos(theta),
          pt.y + radius * Math.sin(theta)
        );
      }
      check(pos: p5.Vector): boolean {
        const neighbors = this.neighbors(pos);
        for (const neighbor of neighbors.values()) {
          for (const pt of neighbor.points) {
            if (pos.dist(pt) < this.size) {
              return false;
            }
          }
        }
        return true;
      }
    }

    function init() {
      img = fnoiseImg(u.noiseParams.noiseIterations);
      disc = new PoissonDisc({ p, r: 80 });
      particles = disc.points.map((v) => new Particle(v));
      attractors = new PoissonDisc({
        p,
        r: p.width / 5,
        maxPoints: 5,
        seedPoints: [p.createVector(p.width / 2, p.height / 2)],
      }).points;

      grid = new Grid(u.minDist);
      particles = [];
      resetAttractors();
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
          // TODO(jw): fix this stuff.
          // eslint-disable-next-line no-case-declarations
          const da = p.TAU / u.attractors.count;
          // eslint-disable-next-line no-case-declarations
          const center = effectiveCenter(p.width, p.height, MARGIN);
          // eslint-disable-next-line no-case-declarations
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
      init;
    (s.params.controls.attractors.value.count as UniformSlider).onChange = init;

    (s.params.controls.noiseParams.value.inc as UniformSlider).onChange = init;
    (s.params.controls.minDist as UniformSlider).onChange = init;
    // (s.params.controls.spawn as UniformRadio).onChange = init;

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

      // console.log('particle count:', particles.length);

      for (let i = 0; i < u.frameIter; i++) {
        for (const particle of particles) {
          const vf = velFuncs[u.flow] || velFuncs.swirl;
          particle.update(vf);

          if (particle.edges()) {
            particle.reset(placePoint());
          }
        }

        const pos = placePoint();
        if (pos) {
          particles.push(new Particle(pos));
        }
      }

      for (const particle of particles) {
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
