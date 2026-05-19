/**
 * Property-based tests for dateHelpers
 * Validates: Requirements 8.2
 */
import * as fc from 'fast-check';
import { calculateExpiry, extendExpiry, classifyExpiry } from '../../src/utils/dateHelpers';

describe('calculateExpiry properties', () => {
  it('∀ joinDate, planDuration >= 1 → calculateExpiry(joinDate, planDuration) > joinDate', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') }),
        fc.integer({ min: 1, max: 120 }),
        (joinDate, planDuration) => {
          const expiry = calculateExpiry(joinDate, planDuration);
          return expiry.getTime() > joinDate.getTime();
        }
      )
    );
  });
});

describe('classifyExpiry properties', () => {
  it('∀ expiryDate → classifyExpiry(expiryDate) ∈ { active, expiring_soon, expired }', () => {
    const validStatuses = new Set(['active', 'expiring_soon', 'expired']);
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') }),
        (expiryDate) => {
          const status = classifyExpiry(expiryDate);
          return validStatuses.has(status);
        }
      )
    );
  });
});

describe('extendExpiry properties', () => {
  it('∀ currentExpiry, planDuration >= 1 → extendExpiry(currentExpiry, planDuration) > today', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') }),
        fc.integer({ min: 1, max: 120 }),
        (currentExpiry, planDuration) => {
          const today = new Date();
          const result = extendExpiry(currentExpiry, planDuration);
          return result.getTime() > today.getTime();
        }
      )
    );
  });
});
