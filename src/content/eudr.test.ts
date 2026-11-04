import { describe, expect, it } from 'vitest';
import { OFFER_ENDS, offerCountdown } from './eudr';

describe('offerCountdown', () => {
  const day = 86_400_000;
  it('counts whole days left, rounding up like the original page', () => {
    expect(offerCountdown('en', OFFER_ENDS.getTime() - 17.2 * day)).toBe('Ends in 18 days');
    expect(offerCountdown('id', OFFER_ENDS.getTime() - 2 * day)).toBe('Berakhir dalam 2 hari');
  });
  it('says "today" on the last day', () => {
    expect(offerCountdown('en', OFFER_ENDS.getTime() - 3_600_000)).toBe('Ends today');
    expect(offerCountdown('id', OFFER_ENDS.getTime() - 3_600_000)).toBe('Berakhir hari ini');
  });
  it('ends at the close of 13 November 2026 in Jakarta', () => {
    expect(OFFER_ENDS.toISOString()).toBe('2026-11-13T16:59:59.000Z');
  });
});
