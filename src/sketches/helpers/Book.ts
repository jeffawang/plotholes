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
