import { describe, it, expect } from 'vitest';
import { createRandom } from './seed.js';

describe('createRandom', () => {
    it('returns a function', () => {
        const random = createRandom(12345);
        expect(typeof random).toBe('function');
    });

    it('generates values in range [0, 1)', () => {
        const random = createRandom(42);
        for (let i = 0; i < 1000; i++) {
            const value = random();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });

    it('produces same sequence for same seed (reproducibility)', () => {
        const random1 = createRandom(12345);
        const random2 = createRandom(12345);

        const sequence1 = [];
        const sequence2 = [];

        for (let i = 0; i < 100; i++) {
            sequence1.push(random1());
            sequence2.push(random2());
        }

        expect(sequence1).toEqual(sequence2);
    });

    it('produces different sequences for different seeds', () => {
        const random1 = createRandom(12345);
        const random2 = createRandom(54321);

        const sequence1 = [];
        const sequence2 = [];

        for (let i = 0; i < 10; i++) {
            sequence1.push(random1());
            sequence2.push(random2());
        }

        expect(sequence1).not.toEqual(sequence2);
    });

    it('handles seed of 0', () => {
        const random = createRandom(0);
        const value = random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
    });

    it('handles negative seed', () => {
        const random = createRandom(-12345);
        const value = random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);

        // Should still be reproducible
        const random2 = createRandom(-12345);
        expect(random2()).toBe(createRandom(-12345)());
    });

    it('handles large seed values', () => {
        const random = createRandom(Number.MAX_SAFE_INTEGER);
        const value = random();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
    });

    it('handles floating point seed by truncating', () => {
        const random1 = createRandom(42.7);
        const random2 = createRandom(42);

        // Both should produce the same sequence since 42.7 >>> 0 equals 42
        expect(random1()).toBe(random2());
    });
});
