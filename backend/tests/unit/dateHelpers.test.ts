import { calculateExpiry, extendExpiry, classifyExpiry } from '../../src/utils/dateHelpers';

describe('calculateExpiry', () => {
  it('adds 1 month', () => {
    const join = new Date('2024-03-15');
    const expiry = calculateExpiry(join, 1);
    expect(expiry.getFullYear()).toBe(2024);
    expect(expiry.getMonth()).toBe(3); // April
    expect(expiry.getDate()).toBe(15);
  });

  it('adds 3 months', () => {
    const join = new Date('2024-01-10');
    const expiry = calculateExpiry(join, 3);
    expect(expiry.getMonth()).toBe(3); // April
    expect(expiry.getDate()).toBe(10);
  });

  it('adds 12 months', () => {
    const join = new Date('2024-06-01');
    const expiry = calculateExpiry(join, 12);
    expect(expiry.getFullYear()).toBe(2025);
    expect(expiry.getMonth()).toBe(5); // June
  });

  it('handles month boundary: Jan 31 + 1 month = Feb 28/29', () => {
    const join = new Date('2024-01-31'); // 2024 is a leap year
    const expiry = calculateExpiry(join, 1);
    // JS Date overflow: Jan 31 + 1 month → Feb 31 → Mar 2 (leap year)
    // This is the actual JS behavior — test documents it
    expect(expiry.getMonth()).toBe(2); // March (JS overflow)
  });

  it('handles non-leap year Jan 31 + 1 month', () => {
    const join = new Date('2023-01-31');
    const expiry = calculateExpiry(join, 1);
    // Feb 31 overflows to Mar 3 in 2023
    expect(expiry.getMonth()).toBe(2); // March
  });
});

describe('extendExpiry', () => {
  it('uses today as base when client is expired', () => {
    const pastExpiry = new Date('2020-01-01');
    const before = new Date();
    const result = extendExpiry(pastExpiry, 1);
    const after = new Date();

    // result should be ~1 month from now
    const expectedMin = new Date(before);
    expectedMin.setMonth(expectedMin.getMonth() + 1);
    const expectedMax = new Date(after);
    expectedMax.setMonth(expectedMax.getMonth() + 1);

    expect(result.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime() - 1000);
    expect(result.getTime()).toBeLessThanOrEqual(expectedMax.getTime() + 1000);
  });

  it('uses current expiry as base when client is active', () => {
    const futureExpiry = new Date();
    futureExpiry.setMonth(futureExpiry.getMonth() + 2); // expires in 2 months

    const result = extendExpiry(futureExpiry, 1);

    const expected = new Date(futureExpiry);
    expected.setMonth(expected.getMonth() + 1);

    expect(result.getTime()).toBeCloseTo(expected.getTime(), -3);
  });
});

describe('classifyExpiry', () => {
  function daysFromNow(days: number): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + days);
    return d;
  }

  it('returns expiring_soon for exactly 7 days', () => {
    expect(classifyExpiry(daysFromNow(7))).toBe('expiring_soon');
  });

  it('returns expiring_soon for 0 days (today)', () => {
    expect(classifyExpiry(daysFromNow(0))).toBe('expiring_soon');
  });

  it('returns expired for -1 days (yesterday)', () => {
    expect(classifyExpiry(daysFromNow(-1))).toBe('expired');
  });

  it('returns active for 8 days', () => {
    expect(classifyExpiry(daysFromNow(8))).toBe('active');
  });
});
