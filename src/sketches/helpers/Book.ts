import p5 from 'p5';

// Stuff for the
export const MARGIN = {
  left: 150,
  right: 50,
  top: 50,
  bottom: 50,
};

export function scaledMargin(scale: number) {
  const scaled = {};
  Object.keys(MARGIN).forEach((v) => {
    scaled[v] = MARGIN[v] * scale;
  });
  return scaled;
}

export function effectiveCenter(
  width: number,
  height: number,
  margin: typeof MARGIN
): p5.Vector {
  const left = margin.left;
  const right = width - margin.right;
  const top = margin.top;
  const bottom = height - margin.bottom;
  const h = bottom - top;
  const w = right - left;
  return new p5.Vector(left + w / 2, top + h / 2);
}
