import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_INPUT =
  'view-source_https___www.erdosproblems.com_search_bib_ErGr80_sources_only=1.html';
const DEFAULT_OUTPUT = 'src/data/ergr80Problems.ts';

const inputPath = process.argv[2] ?? DEFAULT_INPUT;
const outputPath = process.argv[3] ?? DEFAULT_OUTPUT;

function decodeHtmlEntities(value) {
  const named = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name] ?? match);
}

function stripViewSourceTags(value) {
  return decodeHtmlEntities(value.replace(/<br>/g, '').replace(/<[^>]*>/g, ''));
}

function originalHtmlFromViewSource(source) {
  const sourceLines = [
    ...source.matchAll(/<td class="line-content">([\s\S]*?)<\/td>/g),
  ].map((match) => stripViewSourceTags(match[1]));

  return sourceLines.length > 0 ? sourceLines.join('\n') : source;
}

function plainProblemText(value) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, ''))
    .trim()
    .replace(/[ \t\n]+/g, ' ')
    .replace(/\\\[\s+/g, '\\[')
    .replace(/\s+\\\]/g, '\\]')
    .replace(/\\\]([A-Za-z])/g, '\\] $1')
    .replace(/([.!?])([A-Z])/g, '$1 $2');
}

function normalizeStatus(status) {
  if (status === 'open' || status === 'solved' || status === 'disproved') {
    return status;
  }

  return null;
}

function extractProblems(html) {
  const boxes = [
    ...html.matchAll(
      /<div class="problem-box">([\s\S]*?)(?=<div class="problem-box">|<footer|<\/body>)/g,
    ),
  ].map((match) => match[1]);

  const problems = [];

  for (const box of boxes) {
    const match = box.match(
      /<div class="problem-text" id="([^"]+)">([\s\S]*?)<div id="content">([\s\S]*?)<\/div>\s*<div id="problem_id"><a href="\/(\d+)">#\d+<\/a>/,
    );

    if (!match) {
      continue;
    }

    const [, rawStatus, prizeHtml, contentHtml, id] = match;
    const status = normalizeStatus(rawStatus);

    if (!status) {
      continue;
    }

    const prizeMatch = prizeHtml.match(/-\s*\$(\d[\d,]*)/);
    const prize = prizeMatch ? Number(prizeMatch[1].replace(/,/g, '')) : null;

    problems.push({
      id: Number(id),
      status,
      prize,
      text: plainProblemText(contentHtml),
    });
  }

  return problems;
}

function prizeDistribution(problems) {
  return problems.reduce((counts, problem) => {
    const key = problem.prize === null ? 'none' : `$${problem.prize}`;
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function renderTypeScript(problems) {
  const stats = {
    total: problems.length,
    open: problems.filter((problem) => problem.status === 'open').length,
    solved: problems.filter((problem) => problem.status === 'solved').length,
    disproved: problems.filter((problem) => problem.status === 'disproved').length,
    withPrize: problems.filter((problem) => problem.prize !== null).length,
  };

  return `export type ErdosProblemStatus = "open" | "solved" | "disproved";

export interface ErdosProblemCard {
  id: number;
  status: ErdosProblemStatus;
  prize: number | null;
  text: string;
}

export const ergr80Stats = ${JSON.stringify(stats, null, 2)} as const;

export const ergr80PrizeDistribution = ${JSON.stringify(
    prizeDistribution(problems),
    null,
    2,
  )} as const;

export const ergr80Problems: ErdosProblemCard[] = ${JSON.stringify(
    problems,
    null,
    2,
  )};
`;
}

const source = fs.readFileSync(inputPath, 'utf8');
const html = originalHtmlFromViewSource(source);
const problems = extractProblems(html);

if (problems.length === 0) {
  throw new Error(`No problems extracted from ${inputPath}`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, renderTypeScript(problems));

console.log(
  `Extracted ${problems.length} problems to ${outputPath} (${problems.filter(
    (problem) => problem.prize !== null,
  ).length} with listed prizes).`,
);
