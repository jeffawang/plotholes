import p5 from 'p5';
import { radio, slider } from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';
import playaData from '../data/playaData.json';

const controls = {
  elevationScale: { type: slider, value: 0.07, min: 0, max: 1 },
  layer: { type: radio, value: 'all', options: ['all', 'playa', 'man'] },
};

export const sketcher = new Sketcher({
  title: 'Playa',
  width: 1000,
  height: 846,
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
      bg: p.color(0),
      fg: p.color(252),
    };

    const drawMan = () => {
      const xOffset = 500;
      const yOffset = 300;
      p.arc(
        xOffset + -55,
        yOffset + 30,
        100,
        100,
        (p.PI * -1.2) / 6,
        (p.PI * 1.2) / 6
      );
      p.arc(
        xOffset + 55,
        yOffset + 30,
        100,
        100,
        (p.PI * 4.8) / 6,
        (p.PI * 7.2) / 6
      );
      p.beginShape();
      p.vertex(xOffset + 0, yOffset + 0);
      p.vertex(xOffset + 8, yOffset + 5);
      p.vertex(xOffset + 0, yOffset + 17);
      p.vertex(xOffset - 8, yOffset + 5);
      p.vertex(xOffset + 0, yOffset + 0);
      p.endShape();
    };

    const playaVertices: { x: number; y: number }[][] = [];
    const drawPlaya = () => {
      const dimension = playaData.length;
      let i = 0;
      for (let y = 40; y <= 900; y += 800 / dimension) {
        p.beginShape();
        let j = 0;
        playaVertices[i] = [];
        let continuingShape = true;
        const leftXBound = 480 + (y < 330 ? (y - 300) * 0.3 : (y - 360) * -0.3);
        const rightXBound =
          520 + (y < 330 ? (y - 300) * -0.3 : (y - 360) * 0.3);

        for (let x = 100; x <= 900; x += 800 / dimension) {
          if (!playaData[i] || !playaData[i][j]) break;
          const elevationY = y - (playaData[i][j] - 1200) * u.elevationScale;
          playaVertices[i].push({ x, y: elevationY });
          const insideMan =
            x > leftXBound &&
            x < rightXBound &&
            elevationY > 300 &&
            elevationY < 360;
          if (insideMan && continuingShape) {
            p.vertex(leftXBound, y);
            continuingShape = false;
            p.endShape();
          }
          if (!insideMan && !continuingShape) {
            continuingShape = true;
            p.beginShape();
            p.vertex(rightXBound, y);
          }
          if (!insideMan) p.vertex(x, elevationY);
          j++;
        }
        p.endShape();
        i++;
      }
    };

    const drawLeft = () => {
      for (const row of playaVertices) {
        if (row[0]) {
          p.line(50 + p.noise(row[0].y) * 50, row[0].y, row[0].x, row[0].y);
        }
      }
    };

    const drawRight = () => {
      for (const row of playaVertices) {
        const i = row.length - 1;
        if (row[i]) {
          p.line(
            row[i].x,
            row[i].y,
            row[i].x + p.noise(row[i].y) * 50,
            row[i].y
          );
        }
      }
    };

    p.draw = () => {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();

      if (u.layer !== 'man') {
        drawPlaya();
        drawLeft();
        drawRight();
      }
      if (u.layer !== 'playa') drawMan();
    };
  },
});
