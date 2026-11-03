import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bookingPath, productionPath, productions, resolveBooking } from './productions.ts';

test('booking and information pages are separate URLs of the same event', () => {
  for (const { slug } of productions) {
    assert.equal(productionPath(slug), `/events/${slug}`);
    assert.equal(bookingPath(slug), `/events/${slug}/booking`);
  }
});

test('online booking needs a provider link and must be enabled', () => {
  const url = 'https://vibetix.io/example';
  assert.deepEqual(resolveBooking({ booking: { provider: 'vibetix', url, enabled: true } }), { provider: 'Vibetix', url });
  assert.equal(resolveBooking({ booking: { provider: 'vibetix', url, enabled: false } }), null);
  assert.equal(resolveBooking({ booking: { provider: 'vibetix', url: null, enabled: true } }), null);
});

test('production slugs are unique', () => {
  const slugs = productions.map((production) => production.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
