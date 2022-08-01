import p5 from 'p5';

type Maybe<T> = T | undefined;

type PoissonParams = {
  p: p5;
  r: number;

  seedPoints?: p5.Vector[];

  width?: number;
  height?: number;
  fill?: boolean;
  maxPoints?: number;
};

export default class PoissonDisc {
  p: p5;
  params: PoissonParams;
  grid: Maybe<p5.Vector>[];
  points: p5.Vector[];
  maxPoints?: number;
  gridSize: number;
  cols: number;
  rows: number;

  constructor(params: PoissonParams) {
    this.gridSize = params.r / Math.sqrt(2);

    this.params = params;
    this.p = this.params.p;
    this.params.width ||= this.p.width;
    this.params.height ||= this.p.height;

    this.cols = Math.ceil(this.params.width / this.gridSize);
    this.rows = Math.ceil(this.params.height / this.gridSize);
    this.grid = new Array(this.cols * this.rows);
    this.points = params.seedPoints || [];
    this.maxPoints = params.maxPoints;
    if (this.params.fill === undefined || this.params.fill) {
      this.fill();
    }
  }

  cell(pt: p5.Vector): [number, number] {
    return [Math.floor(pt.x / this.gridSize), Math.floor(pt.y / this.gridSize)];
  }

  near(pt: p5.Vector): boolean {
    const [gx, gy] = this.cell(pt);
    const x0 = Math.max(0, gx - 2);
    const x1 = Math.min(this.cols, gx + 2);
    const y0 = Math.max(0, gy - 2);
    const y1 = Math.min(this.rows, gy + 2);
    for (let y = y0; y < y1; y++) {
      const row = y * this.cols;
      for (let x = x0; x < x1; x++) {
        const cellPt = this.grid[row + x];
        if (cellPt) {
          if (pt.dist(cellPt) < this.params.r) {
            return true;
          }
        }
      }
    }
    return false;
  }

  add(pt: p5.Vector): boolean {
    if (this.maxPoints && this.points.length >= this.maxPoints) {
      return false;
    }
    if (!this.near(pt)) {
      const cell = this.cell(pt);
      this.grid[cell[0] + cell[1] * this.cols] = pt;
      this.points.push(pt);
      return true;
    }
    return false;
  }

  annulus(pt: p5.Vector) {
    // https://stackoverflow.com/questions/9048095/create-random-number-within-an-annulus/9048443#9048443
    const theta = this.p.random(this.p.TAU);
    const rMax = this.params.r * 2;
    const rMin = this.params.r;
    const A = 2 / (rMax * rMax - rMin * rMin);
    const radius = Math.sqrt((2 * Math.random()) / A + rMin * rMin);
    return this.p.createVector(
      pt.x + radius * this.p.cos(theta),
      pt.y + radius * this.p.sin(theta)
    );
  }

  fill() {
    if (this.points.length == 0) {
      this.add(
        new p5.Vector(
          this.p.random(this.params.width),
          this.p.random(this.params.height)
        )
      );
    }

    const startIdx = this.p.floor(this.p.random(this.points.length));
    const queue = [this.points[startIdx]];

    const max = this.p.createVector(this.cols, this.rows).mult(this.gridSize);

    while (queue.length) {
      const idx = this.p.floor(this.p.random(queue.length));
      const curr = queue[idx];
      const k = 30;
      let i;
      for (i = 0; i < k; i++) {
        const pos = this.annulus(curr);
        if (pos.x < 0 || pos.y < 0 || pos.x > max.x || pos.y > max.y) {
          continue;
        }
        if (this.add(pos)) {
          queue.push(pos);
        }
      }
      if (i == k) {
        queue[idx] = queue[queue.length - 1];
        queue.pop();
      }
    }
  }
}
