#!/usr/bin/env node
// One-time parser/validator for bulk question-bank imports into question-paper-studio.html.
// Mirrors the app's parsePipeText/resolveCorrectIndex logic exactly (see question-paper-studio.html)
// so the parsed result matches what the in-app Import screen would produce.
import fs from 'fs';

const SRC = process.argv[2];
const OUT_JSON = process.argv[3]; // optional: write parsed qp:bank-shaped array here
if (!SRC) { console.error('Usage: node parse-question-bank.mjs <input.txt> [out.json]'); process.exit(1); }

const OPTION_LETTERS = 'ABCDEFGH'.split('');
function uid(){ return Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4); }
function normQ(s){ return String(s||'').trim().toLowerCase().replace(/\s+/g,' '); }

function resolveCorrectIndex(token, optionTexts){
  const t = String(token==null?'':token).trim();
  if(!t) return -1;
  if(/^[A-Za-z]$/.test(t)){
    const idx = t.toUpperCase().charCodeAt(0)-65;
    if(idx>=0 && idx<optionTexts.length) return idx;
  }
  if(/^\d+$/.test(t)){
    const idx = parseInt(t,10)-1;
    if(idx>=0 && idx<optionTexts.length) return idx;
  }
  const lower = t.toLowerCase();
  return optionTexts.findIndex(o=>o.trim().toLowerCase()===lower);
}
function parsePipeText(text){
  const lines = text.split(/\r?\n/);
  const results = [];
  lines.forEach((raw,i)=>{
    const line = raw.trim();
    if(!line || line.startsWith('#')) return;
    const parts = line.split('|').map(p=>p.trim());
    if(parts.length<4){ results.push({ok:false, lineNo:i+1, raw:line, reason:'Need at least: Question | Option | Option | CorrectAnswer'}); return; }
    const question = parts[0];
    const correctToken = parts[parts.length-1];
    const optionTexts = parts.slice(1, parts.length-1);
    if(!question){ results.push({ok:false, lineNo:i+1, raw:line, reason:'Missing question text'}); return; }
    if(optionTexts.some(o=>!o)){ results.push({ok:false, lineNo:i+1, raw:line, reason:'Empty option text'}); return; }
    const idx = resolveCorrectIndex(correctToken, optionTexts);
    if(idx<0){ results.push({ok:false, lineNo:i+1, raw:line, reason:`Correct answer "${correctToken}" doesn't match any option`}); return; }
    const options = optionTexts.map(t=>({id:uid(), text:t}));
    results.push({ok:true, q:{ id:uid(), question, options, correctOptionId:options[idx].id, createdAt:new Date().toISOString() }});
  });
  return results;
}

const text = fs.readFileSync(SRC, 'utf8');
const results = parsePipeText(text);

const errors = results.filter(r=>!r.ok);
const oks = results.filter(r=>r.ok);

// Duplicate detection (same normalization the app uses)
const seen = new Map(); // normQ -> first lineIndex
const dupGroups = [];
oks.forEach((r, idx) => {
  const n = normQ(r.q.question);
  if (seen.has(n)) {
    dupGroups.push({ question: r.q.question, firstIndex: seen.get(n), dupIndex: idx });
  } else {
    seen.set(n, idx);
  }
});

console.log('=== Parse report ===');
console.log('Total lines           :', results.length);
console.log('Parsed OK             :', oks.length);
console.log('Errors                :', errors.length);
console.log('Unique questions      :', seen.size);
console.log('Duplicate questions   :', dupGroups.length);

if (errors.length) {
  console.log('\n--- Errors (up to 20) ---');
  errors.slice(0, 20).forEach(e => console.log(`Line ${e.lineNo}: ${e.reason}\n  -> ${e.raw.slice(0,120)}`));
}
if (dupGroups.length) {
  console.log('\n--- Duplicates (up to 20) ---');
  dupGroups.slice(0, 20).forEach(d => console.log(`"${d.question.slice(0,80)}" (first at #${d.firstIndex+1}, again at #${d.dupIndex+1})`));
}

// Option-count distribution (sanity check: this file claims 4 options, i.e. A-D)
const optCounts = {};
oks.forEach(r => { const n = r.q.options.length; optCounts[n] = (optCounts[n]||0)+1; });
console.log('\nOption-count distribution:', JSON.stringify(optCounts));

// Correct-letter distribution (sanity check against answer-bias, using original file's letter not resolved index)
const letterCounts = {};
text.split(/\r?\n/).forEach(line => {
  const parts = line.trim().split('|');
  if (parts.length < 4) return;
  const letter = parts[parts.length-1].trim().toUpperCase();
  letterCounts[letter] = (letterCounts[letter]||0)+1;
});
console.log('Answer-letter distribution:', JSON.stringify(letterCounts));

// Spot-check: print 3 parsed questions (first, middle, last)
console.log('\n--- Spot checks ---');
[0, Math.floor(oks.length/2), oks.length-1].forEach(i => {
  const q = oks[i].q;
  const correctText = q.options.find(o=>o.id===q.correctOptionId).text;
  console.log(`\n#${i+1}: ${q.question}`);
  q.options.forEach((o,oi)=> console.log(`  ${OPTION_LETTERS[oi]}) ${o.text}${o.id===q.correctOptionId?'  <-- correct':''}`));
});

if (OUT_JSON) {
  fs.writeFileSync(OUT_JSON, JSON.stringify(oks.map(r=>r.q), null, 0));
  console.log(`\nWrote ${oks.length} parsed questions to ${OUT_JSON}`);
}
