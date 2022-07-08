import p5 from "p5";
import p5svg from "p5.js-svg";
p5svg(p5);

const sketch = function (p: p5) {
    const CELL_COUNT = 20;

    const rect = (x: number, y: number, width: number, color: p5.Color) => {
        const cellWidth = width / CELL_COUNT;

        for (let col = 0; col < CELL_COUNT; col++) {
            for (let row = 0; row < CELL_COUNT; row++) {
                const alpha = p.noise(row, col) * 255;
                color.setAlpha(alpha);
                p.fill(color);
                p.rect(x + cellWidth * row, y + cellWidth * col, cellWidth, cellWidth);
            }
        }
    }
    p.setup = function () {
        p.createCanvas(420, 420, p.SVG);
        p.noLoop();
        p.noStroke();
    }

    p.draw = function () {
        p.background(0);
        const color = p.color('red');
        rect(0, 0, 420, color);
    };
};

// export const makeArt = (node: HTMLElement) => {
//     new p5(sketch, node);
// }

const art = document.getElementById('art') as HTMLElement;

new p5(sketch, art);