import { sound, SoundBuilder, useRandom } from '@motion-canvas/core';

type Range = [number, number] | number;

interface SoundOpts {
  detune?: Range;
  gain?: Range;
}

const numbered = (prefix: string, count: number, startAt = 1) =>
  Array.from({ length: count }, (_, i) => `${prefix}${i + startAt}`);

const makeSound = (
  source: string | string[],
  opts: SoundOpts = {},
): (() => SoundBuilder) => {
  const sources = (Array.isArray(source) ? source : [source]).map((p) =>
    sound(`/audio/${p}.flac`),
  );
  return () => {
    const random = useRandom();
    const pick = (r?: Range) =>
      r === undefined ? 0 : typeof r === 'number' ? r : random.nextInt(r[0], r[1]);
    const s =
      sources.length === 1 ? sources[0] : sources[random.nextInt(0, sources.length)];
    return sound(s).detune(pick(opts.detune)).gain(pick(opts.gain));
  };
};

export const padlockOnSound = makeSound(numbered('padlock/on', 6), {
  detune: [-100, 100],
  gain: [0, 3],
});
export const padlockOffSound = makeSound(numbered('padlock/off', 5), {
  detune: [-100, 100],
  gain: [0, 3],
});
export const clockworkTickSound = makeSound(numbered('clockwork/clockwork-tick-', 5), {
  detune: [-100, 100],
  gain: [-2, -0],
});
export const boxStartSound = makeSound('box-start', {
  detune: [-100, 100],
  gain: [-1, 1],
});
export const boxCloseEndSound = makeSound('box-close-end', {
  detune: [-100, 100],
  gain: [-1, 1],
});
export const boxOpenEndSound = makeSound('box-open-end', {
  detune: [-100, 100],
  gain: [-10, -9],
});
export const keyAttemptSound = makeSound('key-attempt', {
  detune: [-100, 100],
  gain: [5, 6],
});
export const lensSound = makeSound('lens/lens_0', { detune: -500, gain: -12 });
export const spinSound = makeSound('spin-2x');
export const clickSound = makeSound(numbered('click/click_', 4, 0), {
  gain: [-12, -10],
});
export const successSound = makeSound('polylog_success');
export const failureSound = makeSound('polylog_failure');

const CLOCKWORK_SOURCES: Record<
  1 | 2 | 4,
  { src: ReturnType<typeof sound>; length: number }
> = {
  1: { src: sound('/audio/clockwork/clockwork-1x.flac'), length: 47 },
  2: { src: sound('/audio/clockwork/clockwork-2x.flac'), length: 23.5 },
  4: { src: sound('/audio/clockwork/clockwork-4x.flac'), length: 11.7 },
};

export const clockworkSound = (
  duration: number,
  speedup: 1 | 2 | 4 = 4,
): SoundBuilder => {
  const random = useRandom();
  const { src, length } = CLOCKWORK_SOURCES[speedup];
  const start = random.nextFloat(0, Math.max(0, length - duration));
  return sound(src)
    .trim(start, start + duration)
    .gain(-8);
};

const TYPING_SOURCE = sound('/audio/typing.flac');
const TYPING_LENGTH = 17.35;

export const typingSound = (duration: number): SoundBuilder => {
  const random = useRandom();
  const start = random.nextFloat(0, Math.max(0, TYPING_LENGTH - duration));
  return sound(TYPING_SOURCE)
    .trim(start, start + duration)
    .gain(-6);
};

export const jingleSound = makeSound('polylogo_jingle');
