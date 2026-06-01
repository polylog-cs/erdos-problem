import { Layout, makeScene2D, Txt } from '@motion-canvas/2d';
import { waitFor } from '@motion-canvas/core';

import { Solarized } from '../../utilities/color';
import { PolyLatex } from '../../utilities/latex';
import { PolyTxt } from '../../utilities/text';

export default makeScene2D(function* (view) {
  view.fill(Solarized.background);

  const big = 'The quick brown fox jumps over the lazy dog. 0123456789';
  const small = 'The quick brown fox jumps over the lazy dog. — 0123456789';

  view.add(
    <Layout
      layout
      direction={'column'}
      gap={28}
      padding={60}
      width={'100%'}
      height={'100%'}
      alignItems={'start'}
    >
      <PolyTxt fontSize={70} text={big} />
      <PolyTxt fontSize={70} fontStyle={'italic'} text={big} />
      <PolyTxt fontSize={70} fontWeight={700} text={big} />

      <PolyTxt fontSize={32} text={small} />
      <PolyTxt fontSize={32} fontStyle={'italic'} text={small} />
      <PolyTxt fontSize={32} fontWeight={700} text={small} />

      <Layout direction={'column'} gap={20} marginTop={20}>
        <PolyLatex fontSize={48} tex={'a^2 + b^2 = c^2 \\qquad e^{i\\pi} + 1 = 0'} />
        <PolyLatex
          fontSize={48}
          tex={
            '\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2} \\qquad \\int_0^{\\infty} e^{-x^2}\\,dx = \\frac{\\sqrt{\\pi}}{2}'
          }
        />
        <PolyLatex
          fontSize={48}
          tex={
            '\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!} \\qquad \\alpha,\\beta,\\gamma,\\Gamma,\\Delta,\\Omega'
          }
        />
        <PolyLatex
          fontSize={48}
          tex={
            '\\sqrt{2} \\approx 1.41421356237 \\qquad 12345 \\cdot 67890 = 838\\,102\\,050'
          }
        />
      </Layout>
    </Layout>,
  );

  yield* waitFor(2);
});
