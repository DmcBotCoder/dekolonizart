import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchesQuery, normalizeForSearch } from './search.ts';

const haystack = normalizeForSearch('Douala Manga Bell – Der König der sein Recht wollte · La Tragédie de Melilla · Théâtre');

test('ignores case and accents', () => {
  assert.ok(matchesQuery(haystack, 'DOUALA'));
  assert.ok(matchesQuery(haystack, 'konig'));
  assert.ok(matchesQuery(haystack, 'tragedie'));
  assert.ok(matchesQuery(haystack, 'Théâtre'));
});

test('every word must match, in any order', () => {
  assert.ok(matchesQuery(haystack, 'bell douala'));
  assert.ok(!matchesQuery(haystack, 'douala tam'));
});

test('an empty or blank query matches everything', () => {
  assert.ok(matchesQuery(haystack, ''));
  assert.ok(matchesQuery(haystack, '   '));
});

test('typographic quotes and dashes match their plain forms', () => {
  const text = normalizeForSearch('L’atelier – mouvement');
  assert.ok(matchesQuery(text, "l'atelier"));
  assert.ok(matchesQuery(text, 'atelier - mouvement'));
});
