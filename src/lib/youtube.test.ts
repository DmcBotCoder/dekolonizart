import assert from 'node:assert/strict';
import { test } from 'node:test';
import { youTubeEmbedUrl, youTubeId } from './youtube.ts';

const ID = 'aqz-KE-bpKQ';

test('reads the id from every common YouTube link form', () => {
  for (const link of [
    `https://www.youtube.com/watch?v=${ID}`,
    `https://www.youtube.com/watch?v=${ID}&t=42s`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}?autoplay=1`,
  ]) {
    assert.equal(youTubeId(link), ID, link);
  }
});

test('rejects links that are not a single YouTube video', () => {
  for (const link of [
    'not a url',
    'https://vimeo.com/123456789',
    'https://www.youtube.com/',
    'https://www.youtube.com/@dekolonizart',
    'https://www.youtube.com/watch?v=short',
    'https://evil.example/watch?v=aqz-KE-bpKQ',
  ]) {
    assert.throws(() => youTubeId(link), /Intro video/, link);
  }
});

test('autoplaying embeds are muted and loop the same video', () => {
  const url = new URL(youTubeEmbedUrl(ID, { autoplay: true }));
  assert.equal(url.hostname, 'www.youtube-nocookie.com');
  assert.equal(url.pathname, `/embed/${ID}`);
  assert.equal(url.searchParams.get('autoplay'), '1');
  assert.equal(url.searchParams.get('mute'), '1');
  assert.equal(url.searchParams.get('loop'), '1');
  assert.equal(url.searchParams.get('playlist'), ID);
});

test('without autoplay the video starts paused and with sound', () => {
  const url = new URL(youTubeEmbedUrl(ID, { autoplay: false }));
  assert.equal(url.searchParams.get('autoplay'), '0');
  assert.equal(url.searchParams.get('mute'), '0');
  assert.equal(url.searchParams.get('loop'), '1');
});
