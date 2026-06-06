export interface CyclotomicPoint {
  id: number;
  coeffs: number[];
  x: number;
  y: number;
  minkowskiNormSquared: number;
  spiralProgress: number;
}

export interface CyclotomicTranslation {
  rootPower: number;
  coeffs: number[];
  dx: number;
  dy: number;
}

export interface CyclotomicWindow {
  m: number;
  degree: number;
  normBound: number;
  points: CyclotomicPoint[];
  translations: CyclotomicTranslation[];
  unitEdges: number;
}

const TWO_PI = 2 * Math.PI;

function gcd(a: number, b: number) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return Math.abs(a);
}

function divisors(n: number) {
  const result: number[] = [];
  for (let d = 1; d <= n; d++) {
    if (n % d === 0) {
      result.push(d);
    }
  }
  return result;
}

function divideMonicPolynomials(numerator: number[], denominator: number[]) {
  const remainder = [...numerator];
  const quotient = Array(numerator.length - denominator.length + 1).fill(0);

  for (let offset = quotient.length - 1; offset >= 0; offset--) {
    const factor = remainder[offset + denominator.length - 1];
    quotient[offset] = factor;

    for (let j = 0; j < denominator.length; j++) {
      remainder[offset + j] -= factor * denominator[j];
    }
  }

  return quotient.map((value) => Math.round(value));
}

const cyclotomicCache = new Map<number, number[]>();

function cyclotomicPolynomial(n: number): number[] {
  const cached = cyclotomicCache.get(n);
  if (cached) {
    return cached;
  }

  let polynomial = Array(n + 1).fill(0);
  polynomial[0] = -1;
  polynomial[n] = 1;

  for (const divisor of divisors(n)) {
    if (divisor === n) {
      continue;
    }
    polynomial = divideMonicPolynomials(polynomial, cyclotomicPolynomial(divisor));
  }

  cyclotomicCache.set(n, polynomial);
  return polynomial;
}

function multiplyByRoot(coeffs: number[], polynomial: number[]) {
  const degree = polynomial.length - 1;
  const result = Array(degree).fill(0);
  const overflow = coeffs[degree - 1];

  for (let j = degree - 2; j >= 0; j--) {
    result[j + 1] = coeffs[j];
  }

  for (let j = 0; j < degree; j++) {
    result[j] -= overflow * polynomial[j];
  }

  return result.map((value) => Math.round(value));
}

function rootPowersInBasis(m: number, degree: number, polynomial: number[]) {
  const powers: number[][] = [];
  powers.push([1, ...Array(degree - 1).fill(0)]);

  for (let power = 1; power < m; power++) {
    powers.push(multiplyByRoot(powers[power - 1], polynomial));
  }

  return powers;
}

function mainEmbedding(m: number, degree: number) {
  return Array.from({ length: degree }, (_, j) => ({
    x: Math.cos((TWO_PI * j) / m),
    y: Math.sin((TWO_PI * j) / m),
  }));
}

function unitGroupModulo(m: number) {
  return Array.from({ length: m }, (_, a) => a).filter((a) => gcd(a, m) === 1);
}

function minkowskiGram(m: number, degree: number) {
  const units = unitGroupModulo(m);
  return Array.from({ length: degree }, (_, j) =>
    Array.from({ length: degree }, (_, k) =>
      units.reduce((sum, a) => sum + Math.cos((TWO_PI * a * (j - k)) / m), 0),
    ),
  );
}

function quadraticForm(coeffs: number[], gram: number[][]) {
  let total = 0;

  for (let j = 0; j < coeffs.length; j++) {
    if (coeffs[j] === 0) {
      continue;
    }

    for (let k = 0; k < coeffs.length; k++) {
      if (coeffs[k] === 0) {
        continue;
      }
      total += coeffs[j] * coeffs[k] * gram[j][k];
    }
  }

  return total;
}

function coordinate(coeffs: number[], embedding: { x: number; y: number }[]) {
  let x = 0;
  let y = 0;

  for (let j = 0; j < coeffs.length; j++) {
    x += coeffs[j] * embedding[j].x;
    y += coeffs[j] * embedding[j].y;
  }

  return { x, y };
}

function assignSpiralProgress(points: Omit<CyclotomicPoint, 'spiralProgress'>[]) {
  const maxRadius = Math.max(...points.map((point) => Math.hypot(point.x, point.y)));
  const turns = 9.25;
  const thetaMax = TWO_PI * turns;
  const spiralScale = (maxRadius * 1.07) / thetaMax;

  return points
    .map((point) => {
      const radius = Math.hypot(point.x, point.y);
      let angle = Math.atan2(point.y, point.x);
      if (angle < 0) {
        angle += TWO_PI;
      }

      const idealTheta = radius / spiralScale;
      const winding = Math.max(0, Math.round((idealTheta - angle) / TWO_PI));
      const before = angle + TWO_PI * winding;
      const after = before + TWO_PI;
      let theta = before;

      if (after <= thetaMax && Math.abs(spiralScale * after - radius) < Math.abs(spiralScale * before - radius)) {
        theta = after;
      }

      const radialError = Math.abs(radius - spiralScale * theta) / (maxRadius || 1);
      return {
        ...point,
        spiralProgress: Math.min(1, theta / thetaMax + 0.006 * radialError),
      };
    })
    .sort((a, b) => a.spiralProgress - b.spiralProgress || a.id - b.id);
}

function coeffKey(coeffs: number[]) {
  return coeffs.join(',');
}

function countUnitEdges(
  points: Omit<CyclotomicPoint, 'spiralProgress'>[],
  translations: CyclotomicTranslation[],
) {
  const pointKeys = new Set(points.map((point) => coeffKey(point.coeffs)));
  let edges = 0;

  for (const point of points) {
    for (const translation of translations) {
      const target = point.coeffs.map((value, index) => value + translation.coeffs[index]);
      if (pointKeys.has(coeffKey(target))) {
        edges += 1;
      }
    }
  }

  return edges;
}

export function generateCyclotomicWindow(m = 21, normBound = 44): CyclotomicWindow {
  const polynomial = cyclotomicPolynomial(m);
  const degree = polynomial.length - 1;
  const powers = rootPowersInBasis(m, degree, polynomial);
  const embedding = mainEmbedding(m, degree);
  const gram = minkowskiGram(m, degree);
  const coeffs = Array(degree).fill(-1);
  const points: Omit<CyclotomicPoint, 'spiralProgress'>[] = [];

  function visit(index: number) {
    if (index === degree) {
      const norm = quadraticForm(coeffs, gram);
      if (norm <= normBound + 1e-9) {
        points.push({
          id: points.length,
          coeffs: [...coeffs],
          ...coordinate(coeffs, embedding),
          minkowskiNormSquared: norm,
        });
      }
      return;
    }

    for (let value = -1; value <= 1; value++) {
      coeffs[index] = value;
      visit(index + 1);
    }
  }

  visit(0);

  const translations = powers.map((coeffVector, rootPower) => ({
    rootPower,
    coeffs: coeffVector,
    dx: Math.cos((TWO_PI * rootPower) / m),
    dy: Math.sin((TWO_PI * rootPower) / m),
  }));

  return {
    m,
    degree,
    normBound,
    points: assignSpiralProgress(points),
    translations,
    unitEdges: countUnitEdges(points, translations),
  };
}
