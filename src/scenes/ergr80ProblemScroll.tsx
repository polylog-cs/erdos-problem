import { Img, Node, Rect } from '@motion-canvas/2d';
import { makeScene2D } from '@motion-canvas/2d/lib/scenes';
import {
  all,
  createRef,
  easeOutCubic,
  linear,
  type Reference,
  waitFor,
} from '@motion-canvas/core';

import {
  ergr80Problems,
  type ErdosProblemCard,
} from '../data/ergr80Problems';
import erdosPortrait from '../assets/images/people/paul-erdos-vitalyos.jpg';
import { PolyLatex } from '../utilities/latex';
import { PolyTxt } from '../utilities/text';

const paper = '#F7EFE2';
const cardFill = '#FFFDF8';
const ink = '#111111';
const rule = '#D9CEC1';
const openStroke = '#C9362E';
const solvedStroke = '#23864D';
const openTint = '#FBE7E3';
const solvedTint = '#E4F2E8';

const contentCenterX = -320;
const viewportWidth = 1220;
const viewportHeight = 850;
const cardWidth = 1120;
const cardGap = 24;
const headerHeight = 86;
const horizontalPadding = 54;
const textWidth = cardWidth - 2 * horizontalPadding;
const slotCount = 7;
const viewTop = -viewportHeight / 2 + 18;
const scrollPixelsPerSecond = 220;
const introHeight = 920;
const introGap = 40;
const introScrollPixelsPerSecond = 300;
const introStartOffsetY = -60;
const focusProblemId = 90;
const focusTargetY = 80;
const focusScrollPixelsPerSecond = 820;

type InlineSegment = {
  kind: 'text' | 'math';
  value: string;
};

interface PreparedProblem {
  problem: ErdosProblemCard;
  ordinal: number;
  tex: string;
  lineCount: number;
  metric: CardMetric;
}

interface CardMetric {
  height: number;
  fontSize: number;
}

interface CardSlotRefs {
  root: Reference<Rect>;
  bar: Reference<Rect>;
  id: Reference<PolyTxt>;
  statusBox: Reference<Rect>;
  status: Reference<PolyTxt>;
  prizeBox: Reference<Rect>;
  prize: Reference<PolyTxt>;
  rule: Reference<Rect>;
  latex: Reference<PolyLatex>;
}

function statusStroke(status: ErdosProblemCard['status']) {
  return status === 'open' ? openStroke : solvedStroke;
}

function statusTint(status: ErdosProblemCard['status']) {
  return status === 'open' ? openTint : solvedTint;
}

function statusBoxWidth(status: ErdosProblemCard['status']) {
  return status === 'disproved' ? 172 : 132;
}

function statusLabel(status: ErdosProblemCard['status']) {
  if (status === 'open') {
    return 'OPEN';
  }

  return status === 'disproved' ? 'DISPROVED' : 'SOLVED';
}

function prizeLabel(prize: number | null) {
  return `$${(prize ?? 0).toLocaleString('en-US')}`;
}

function texEscapeText(text: string) {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\$/g, '\\$')
    .replace(/%/g, '\\%')
    .replace(/&/g, '\\&')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\^/g, '\\^{}')
    .replace(/~/g, '\\~{}');
}

function mathWeight(math: string) {
  return (
    math
      .replace(/\\[a-zA-Z]+/g, 'mm')
      .replace(/[{}]/g, '')
      .replace(/\s+/g, '').length * 0.75 +
    4
  );
}

function splitProblemSource(text: string) {
  const parts: InlineSegment[] = [];
  let cursor = 0;

  const pushText = (value: string) => {
    if (value.length > 0) {
      parts.push({ kind: 'text', value });
    }
  };

  while (cursor < text.length) {
    if (text.startsWith('\\[', cursor)) {
      const end = text.indexOf('\\]', cursor + 2);
      if (end === -1) {
        parts.push({ kind: 'math', value: text.slice(cursor) });
        break;
      }

      const previous = text[cursor - 1] ?? '';
      const next = text[end + 2] ?? '';

      if (previous && !/\s/.test(previous)) {
        pushText(' ');
      }

      parts.push({
        kind: 'math',
        value: text.slice(cursor + 2, end).trim(),
      });

      if (next && !/\s/.test(next) && !/[.,;:?!)\]}]/.test(next)) {
        pushText(' ');
      }

      cursor = end + 2;
      continue;
    }

    if (text[cursor] === '$') {
      const end = text.indexOf('$', cursor + 1);
      if (end === -1) {
        parts.push({ kind: 'text', value: text.slice(cursor) });
        break;
      }

      parts.push({
        kind: 'math',
        value: text.slice(cursor + 1, end).trim(),
      });
      cursor = end + 1;
      continue;
    }

    const nextInline = text.indexOf('$', cursor);
    const nextDisplay = text.indexOf('\\[', cursor);
    const nextCandidates = [nextInline, nextDisplay].filter((index) => index >= 0);
    const next = nextCandidates.length ? Math.min(...nextCandidates) : text.length;
    pushText(text.slice(cursor, next));
    cursor = next;
  }

  return parts;
}

function trimLineSegments(segments: InlineSegment[]) {
  const line = segments
    .map((segment) => ({ ...segment }))
    .filter((segment) => segment.kind === 'math' || segment.value.length > 0);

  while (line[0]?.kind === 'text') {
    line[0].value = line[0].value.replace(/^\s+/, '');
    if (line[0].value.length) {
      break;
    }
    line.shift();
  }

  while (line[line.length - 1]?.kind === 'text') {
    const last = line[line.length - 1];
    last.value = last.value.replace(/\s+$/, '');
    if (last.value.length) {
      break;
    }
    line.pop();
  }

  return line;
}

function lineToTex(segments: InlineSegment[]) {
  const line = trimLineSegments(segments);

  if (line.length === 0) {
    return '\\quad';
  }

  return line
    .map((segment) =>
      segment.kind === 'math'
        ? `{${segment.value}}`
        : `\\text{${texEscapeText(segment.value)}}`,
    )
    .join('');
}

function lineLimitForFontSize(fontSize: number) {
  return Math.floor(textWidth / (fontSize * 0.63));
}

function fontSizeFor(text: string) {
  return text.length > 680
    ? 22
    : text.length > 500
      ? 24
      : text.length > 330
        ? 26
        : 30;
}

function problemTexLines(text: string, lineLimit: number) {
  const lines: string[] = [];
  let current: InlineSegment[] = [];
  let lineWeight = 0;

  const flushCurrent = () => {
    const tex = lineToTex(current);
    if (tex !== '\\quad') {
      lines.push(tex);
    }
    current = [];
    lineWeight = 0;
  };

  const pushTextToken = (token: string, weight: number) => {
    if (lineWeight + weight > lineLimit && current.length) {
      flushCurrent();
    }

    if (!current.length && /^\s+$/.test(token)) {
      return;
    }

    current.push({ kind: 'text', value: token });
    lineWeight += weight;
  };

  for (const part of splitProblemSource(text)) {
    if (part.kind === 'math') {
      const weight = mathWeight(part.value);
      if (lineWeight + weight > lineLimit && current.length) {
        flushCurrent();
      }

      current.push(part);
      lineWeight += weight;
      continue;
    }

    for (const token of part.value.split(/(\s+)/).filter(Boolean)) {
      pushTextToken(token, /^\s+$/.test(token) ? 0.7 : token.length);
    }
  }

  flushCurrent();
  return lines.length ? lines : ['\\quad'];
}

function cardMetrics(lineCount: number, fontSize: number): CardMetric {
  const height = Math.max(184, headerHeight + lineCount * fontSize * 1.88 + 90);

  return { height, fontSize };
}

function problemTex(lines: string[]) {
  return `\\begin{array}{@{}l@{}}${lines.join('\\\\[0.28em]')}\\end{array}`;
}

const unitDistanceProblem: ErdosProblemCard = {
  id: focusProblemId,
  status: 'disproved',
  prize: 500,
  text:
    'Does every set of $n$ distinct points in $\\mathbb{R}^2$ contain at most ' +
    '$n^{1+O(1/\\log\\log n)}$ many pairs which are distance $1$ apart?',
};

// Restore the ergr80Problems line to show every extracted ErGr80 problem again.
const displayedProblems = [
  ...ergr80Problems.filter((problem) => (problem.prize ?? 0) > 0),
  unitDistanceProblem,
].sort((a, b) => a.id - b.id);

const preparedProblems: PreparedProblem[] = displayedProblems.map((problem, index) => {
  let fontSize = fontSizeFor(problem.text);
  let lines = problemTexLines(problem.text, lineLimitForFontSize(fontSize));

  if (lines.length > 9 && fontSize > 22) {
    fontSize = Math.max(22, fontSize - 2);
    lines = problemTexLines(problem.text, lineLimitForFontSize(fontSize));
  }

  return {
    problem,
    ordinal: problem.id,
    tex: problemTex(lines),
    lineCount: lines.length,
    metric: cardMetrics(lines.length, fontSize),
  };
});

function initialProblem(index: number) {
  return preparedProblems[Math.min(index, preparedProblems.length - 1)];
}

function CardSlot({ index, refs }: { index: number; refs: CardSlotRefs }) {
  const prepared = initialProblem(index);
  const { problem, ordinal, tex, metric } = prepared;
  const stroke = statusStroke(problem.status);

  return (
    <Rect
      ref={refs.root}
      width={cardWidth}
      height={metric.height}
      radius={8}
      fill={cardFill}
      stroke={stroke}
      lineWidth={4}
    >
      <Rect
        ref={refs.bar}
        x={-cardWidth / 2 + 13}
        width={10}
        height={metric.height - 26}
        radius={5}
        fill={stroke}
      />
      <PolyTxt
        ref={refs.id}
        text={`#${ordinal}`}
        x={-cardWidth / 2 + horizontalPadding}
        y={-metric.height / 2 + 38}
        offsetX={-1}
        fontSize={31}
        fontWeight={700}
        fill={ink}
      />
      <Rect
        ref={refs.statusBox}
        x={-cardWidth / 2 + 205}
        y={-metric.height / 2 + 38}
        width={statusBoxWidth(problem.status)}
        height={42}
        radius={6}
        fill={statusTint(problem.status)}
        stroke={stroke}
        lineWidth={2}
      >
        <PolyTxt
          ref={refs.status}
          text={statusLabel(problem.status)}
          fontSize={21}
          fontWeight={700}
          fill={stroke}
        />
      </Rect>
      <Rect
        ref={refs.prizeBox}
        x={cardWidth / 2 - 170}
        y={-metric.height / 2 + 38}
        width={270}
        height={42}
        radius={6}
        fill={'#F6F0E6'}
        stroke={rule}
        lineWidth={2}
      >
        <PolyTxt
          ref={refs.prize}
          text={prizeLabel(problem.prize)}
          fontSize={26}
          fontWeight={700}
          fill={ink}
        />
      </Rect>
      <Rect
        ref={refs.rule}
        y={-metric.height / 2 + headerHeight - 13}
        width={cardWidth - 2 * horizontalPadding}
        height={2}
        fill={rule}
      />
      <PolyLatex
        ref={refs.latex}
        tex={tex}
        x={-cardWidth / 2 + horizontalPadding}
        y={-metric.height / 2 + headerHeight + 8}
        offsetX={-1}
        offsetY={-1}
        fontSize={metric.fontSize}
        fill={ink}
      />
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  view.fill(paper);

  const stage = createRef<Node>();
  const list = createRef<Node>();
  const intro = createRef<Node>();
  const cardSlots: CardSlotRefs[] = Array.from({ length: slotCount }, () => ({
    root: createRef<Rect>(),
    bar: createRef<Rect>(),
    id: createRef<PolyTxt>(),
    statusBox: createRef<Rect>(),
    status: createRef<PolyTxt>(),
    prizeBox: createRef<Rect>(),
    prize: createRef<PolyTxt>(),
    rule: createRef<Rect>(),
    latex: createRef<PolyLatex>(),
  }));
  const slotPrepared: PreparedProblem[] = [];

  function applyProblem(slotIndex: number, prepared: PreparedProblem) {
    const refs = cardSlots[slotIndex];
    const { problem, ordinal, tex, metric } = prepared;
    const stroke = statusStroke(problem.status);

    refs.root().height(metric.height);
    refs.root().stroke(stroke);
    refs.root().opacity(1);
    refs.bar().height(metric.height - 26);
    refs.bar().fill(stroke);
    refs.id().text(`#${ordinal}`);
    refs.id().y(-metric.height / 2 + 38);
    refs.statusBox().y(-metric.height / 2 + 38);
    refs.statusBox().width(statusBoxWidth(problem.status));
    refs.statusBox().fill(statusTint(problem.status));
    refs.statusBox().stroke(stroke);
    refs.status().text(statusLabel(problem.status));
    refs.status().fill(stroke);
    refs.prizeBox().y(-metric.height / 2 + 38);
    refs.prize().text(prizeLabel(problem.prize));
    refs.prize().fontSize(26);
    refs.prize().fontWeight(700);
    refs.prize().fill(ink);
    refs.rule().y(-metric.height / 2 + headerHeight - 13);
    refs.latex().tex(tex);
    refs.latex().y(-metric.height / 2 + headerHeight + 8);
    refs.latex().fontSize(metric.fontSize);
    slotPrepared[slotIndex] = prepared;
  }

  function layoutInitialSlots() {
    let nextProblemIndex = 0;
    let top = viewTop + introHeight + introGap;

    for (let slotIndex = 0; slotIndex < slotCount; slotIndex++) {
      const prepared = preparedProblems[nextProblemIndex++];
      applyProblem(slotIndex, prepared);
      cardSlots[slotIndex].root().y(top + prepared.metric.height / 2);
      top += prepared.metric.height + cardGap;
    }

    return nextProblemIndex;
  }

  view.add(
    <Node ref={stage} opacity={0}>
      <Rect
        x={contentCenterX}
        y={40}
        width={viewportWidth}
        height={viewportHeight}
        clip
        fill={paper}
      >
        <Node ref={list}>
          <Node ref={intro} y={viewTop + introHeight / 2 + introStartOffsetY}>
            <PolyTxt
              text={'Paul Erd\u0151s'}
              y={-370}
              fontSize={70}
              fontWeight={700}
              fill={ink}
            />
            <PolyTxt
              text={'1913 - 1996'}
              y={-300}
              fontSize={44}
              fontWeight={500}
              fill={ink}
            />
            <Img
              src={erdosPortrait}
              y={95}
              width={560}
              height={750}
              radius={10}
              stroke={rule}
              lineWidth={3}
            />
          </Node>
          {cardSlots.map((refs, index) => (
            <CardSlot
              index={index}
              refs={refs}
            />
          ))}
        </Node>
      </Rect>
    </Node>,
  );

  let nextProblemIndex = layoutInitialSlots();
  let firstProblemIndex = 0;
  const slotOrder = cardSlots.map((_, index) => index);

  yield* stage().opacity(1, 0.45, easeOutCubic);
  yield* waitFor(10);
  yield* waitFor(0.75);

  const introDy = introHeight + introGap;
  yield* all(
    intro().y(
      intro().y() - introDy,
      introDy / introScrollPixelsPerSecond,
      linear,
    ),
    ...slotOrder.map((slotIndex) =>
      cardSlots[slotIndex].root().y(
        cardSlots[slotIndex].root().y() - introDy,
        introDy / introScrollPixelsPerSecond,
        linear,
      ),
    ),
  );

  yield* waitFor(0.25);

  while (nextProblemIndex < preparedProblems.length) {
    const firstSlot = slotOrder[0];
    const dy = slotPrepared[firstSlot].metric.height + cardGap;
    const duration = dy / scrollPixelsPerSecond;

    yield* all(
      ...slotOrder.map((slotIndex) =>
        cardSlots[slotIndex].root().y(
          cardSlots[slotIndex].root().y() - dy,
          duration,
          linear,
        ),
      ),
    );

    slotOrder.shift();
    firstProblemIndex++;

    const recycledSlot = firstSlot;
    const prepared = preparedProblems[nextProblemIndex++];
    const lastSlot = slotOrder[slotOrder.length - 1];
    const lastBottom =
      cardSlots[lastSlot].root().y() + slotPrepared[lastSlot].metric.height / 2;

    applyProblem(recycledSlot, prepared);
    cardSlots[recycledSlot].root().y(
      lastBottom + cardGap + prepared.metric.height / 2,
    );
    slotOrder.push(recycledSlot);
  }

  yield* waitFor(0.35);

  const focusProblemIndex = preparedProblems.findIndex(
    ({ problem }) => problem.id === focusProblemId,
  );
  const focusStartIndex = Math.max(
    0,
    Math.min(focusProblemIndex, preparedProblems.length - slotCount),
  );

  while (firstProblemIndex > focusStartIndex) {
    const recycledSlot = slotOrder.pop()!;
    const firstSlot = slotOrder[0];
    const prepared = preparedProblems[firstProblemIndex - 1];
    const firstTop =
      cardSlots[firstSlot].root().y() - slotPrepared[firstSlot].metric.height / 2;
    const dy = prepared.metric.height + cardGap;

    applyProblem(recycledSlot, prepared);
    cardSlots[recycledSlot].root().y(firstTop - cardGap - prepared.metric.height / 2);
    slotOrder.unshift(recycledSlot);
    firstProblemIndex--;

    yield* all(
      ...slotOrder.map((slotIndex) =>
        cardSlots[slotIndex].root().y(
          cardSlots[slotIndex].root().y() + dy,
          dy / focusScrollPixelsPerSecond,
          linear,
        ),
      ),
    );
  }

  const focusSlot = slotOrder.find(
    (slotIndex) => slotPrepared[slotIndex].problem.id === focusProblemId,
  )!;
  const centerDy = focusTargetY - cardSlots[focusSlot].root().y();
  const centerDuration = Math.max(
    0.18,
    Math.abs(centerDy) / focusScrollPixelsPerSecond,
  );

  yield* all(
    ...slotOrder.map((slotIndex) =>
      cardSlots[slotIndex].root().y(
        cardSlots[slotIndex].root().y() + centerDy,
        centerDuration,
        linear,
      ),
    ),
  );

  yield* waitFor(0.25);
  yield* all(
    ...slotOrder
      .filter((slotIndex) => slotIndex !== focusSlot)
      .map((slotIndex) => cardSlots[slotIndex].root().opacity(0, 0.5, easeOutCubic)),
  );

  yield* waitFor(1.4);
});
