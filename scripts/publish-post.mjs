#!/usr/bin/env node
/**
 * FvP — Markdown yazıyı Sanity'ye yayınlar (bülten / rehber / podcast notu).
 *
 * Kullanım:
 *   node scripts/publish-post.mjs <markdown.md> --title "..." --slug "..." \
 *        --category gundem --excerpt "..." [--date 2026-07-18T09:00:00Z] [--featured] [--dry]
 *
 * Neden bu script var: dataset `production` PUBLIC (okuma token istemez) ama YAZMA için
 * Editor rollü SANITY_API_TOKEN şart. Token .env.local'de durur, repoya/memory'ye YAZILMAZ.
 *
 * createOrReplace kullanır → aynı slug ile tekrar çalıştırmak günceller, mükerrer yaratmaz.
 */
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

// .env.local'i elle yükle (dotenv/config sadece .env okur)
for (const line of fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_TOKEN;
const API = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01';

if (!TOKEN) { console.error('🔴 SANITY_API_TOKEN yok (.env.local). Editor rollü token gerekli.'); process.exit(1); }

// ---- argümanlar ----
const argv = process.argv.slice(2);
const file = argv.find(a => !a.startsWith('--'));
const arg = (n, d = null) => { const i = argv.indexOf('--' + n); return i > -1 ? argv[i + 1] : d; };
const has = n => argv.includes('--' + n);
if (!file) { console.error('Kullanım: publish-post.mjs <dosya.md> --title .. --slug .. --category ..'); process.exit(1); }

const title = arg('title');
const slug = arg('slug');
const category = arg('category');
const excerpt = arg('excerpt', '');
const date = arg('date', new Date().toISOString());
if (!title || !slug || !category) { console.error('🔴 --title --slug --category zorunlu'); process.exit(1); }

// ---- markdown → Portable Text ----
let key = 0;
const k = () => `k${(++key).toString(36)}`;

/** Satır içi işaretleme: **kalın**, *italik*, [metin](url), `kod` */
function inline(text) {
  const spans = [];
  const markDefs = [];
  // linkleri önce çıkar
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0, m;
  const push = (t, marks = []) => { if (t) spans.push({ _type: 'span', _key: k(), text: t, marks }); };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[2] !== undefined) push(m[2], ['strong']);
    else if (m[4] !== undefined) push(m[4], ['em']);
    else if (m[6] !== undefined) push(m[6], ['code']);
    else if (m[8] !== undefined) {
      const dk = k();
      markDefs.push({ _type: 'link', _key: dk, href: m[9] });
      push(m[8], [dk]);
    }
    last = m.index + m[0].length;
  }
  push(text.slice(last));
  return { spans: spans.length ? spans : [{ _type: 'span', _key: k(), text: '', marks: [] }], markDefs };
}

const block = (style, text, listItem) => {
  const { spans, markDefs } = inline(text);
  const b = { _type: 'block', _key: k(), style, markDefs, children: spans };
  if (listItem) { b.listItem = listItem; b.level = 1; }
  return b;
};

function mdToPortableText(md) {
  const out = [];
  const lines = md.split('\n');
  let para = [];
  const flush = () => { if (para.length) { out.push(block('normal', para.join(' '))); para = []; } };

  for (let raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { flush(); continue; }
    if (/^---+$/.test(line.trim())) { flush(); continue; }        // yatay çizgi → atla
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) { flush(); out.push(block(['h1','h2','h3','h4'][h[1].length - 1], h[2])); continue; }
    const q = line.match(/^>\s?(.*)$/);
    if (q) { flush(); out.push(block('blockquote', q[1])); continue; }
    const li = line.match(/^\s*[-*•]\s+(.*)$/);
    if (li) { flush(); out.push(block('normal', li[1], 'bullet')); continue; }
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ol) { flush(); out.push(block('normal', ol[1], 'number')); continue; }
    para.push(line.trim());
  }
  flush();
  return out;
}

// ---- gövdeyi hazırla ----
let md = fs.readFileSync(file, 'utf8');
md = md.replace(/^---\n[\s\S]*?\n---\n/, '');                      // frontmatter
md = md.replace(/^#\s+.*\n/, '');                                  // H1 (başlık ayrı alanda)
md = md.replace(/^\*\*Konu satırı:\*\*.*\n/m, '')                  // e-posta üstbilgisi
       .replace(/^\*\*Önizleme:\*\*.*\n/m, '');

const body = mdToPortableText(md);

const doc = {
  _id: `post-${slug}`,
  _type: 'post',
  title,
  slug: { _type: 'slug', current: slug },
  excerpt,
  category: { _type: 'reference', _ref: `cat-${category}` },
  publishedAt: date,
  featured: has('featured'),
  body,
};

// --inspect: çeviriyi göster, yayınlama (markdown→Portable Text sağlaması)
if (has('inspect')) {
  const hs = body.filter(b => b.style !== 'normal');
  console.log(`BLOK: ${body.length}\n\nBAŞLIK/ALINTI (${hs.length}):`);
  hs.forEach(b => console.log('  ', b.style.padEnd(11), b.children.map(c => c.text).join('').slice(0, 56)));
  const links = body.flatMap(b => b.markDefs || []).filter(d => d._type === 'link');
  console.log(`\nLİNK (${links.length}):`);
  links.forEach(d => console.log('  ', d.href.slice(0, 64)));
  console.log(`\nLİSTE ÖĞESİ : ${body.filter(b => b.listItem).length}`);
  console.log(`KALIN İÇEREN: ${body.filter(b => b.children.some(c => c.marks?.includes('strong'))).length}`);
  const empty = body.filter(b => !b.children.map(c => c.text).join('').trim()).length;
  console.log(`BOŞ BLOK    : ${empty} ${empty ? '⚠️' : '✅'}`);
  process.exit(0);
}

const dry = has('dry');
const url = `https://${PROJECT}.api.sanity.io/v${API}/data/mutate/${DATASET}?returnIds=true${dry ? '&dryRun=true' : ''}`;
const res = await fetch(url, {
  method: 'POST',
  headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
  body: JSON.stringify({ mutations: [{ createOrReplace: doc }] }),
});
const j = await res.json();
if (j.error) { console.error('🔴', j.error.description || j.error.message || JSON.stringify(j.error)); process.exit(1); }

console.log(`${dry ? '🧪 KURU ÇALIŞTIRMA' : '✅ YAYINLANDI'} — ${title}`);
console.log(`   blok: ${body.length} · kategori: cat-${category} · id: post-${slug}`);
if (!dry) console.log(`   https://fitnessvepazarlama.com/yazi/${slug}`);
