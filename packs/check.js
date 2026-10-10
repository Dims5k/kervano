// Vérifie un pack de questions : node packs/check.js packs/histoire.json [packs/histoire.en.json]
const fs = require("fs");
const [, , frPath, trPath] = process.argv;
const errs = [];
const fr = JSON.parse(fs.readFileSync(frPath, "utf8"));
if (!fr.cats || typeof fr.cats !== "object") errs.push("cats manquant");
if (!Array.isArray(fr.q)) errs.push("q doit être un tableau");
const cats = Object.keys(fr.cats || {});
const seenQ = new Set(), dist = { 1: 0, 2: 0, 3: 0 }, perCat = {};
(fr.q || []).forEach((r, i) => {
  const at = `#${i}`;
  if (!Array.isArray(r) || r.length !== 6) return errs.push(`${at} : il faut [cat, d, question, réponse, [3 fausses], note]`);
  const [c, d, q, a, w, note] = r;
  if (!cats.includes(c)) errs.push(`${at} : catégorie inconnue ${c}`);
  if (![1, 2, 3].includes(d)) errs.push(`${at} : difficulté ${d}`);
  if (typeof q !== "string" || q.length < 8) errs.push(`${at} : question vide`);
  if (typeof a !== "string" || !a.trim()) errs.push(`${at} : réponse vide`);
  if (a && a.length > 70) errs.push(`${at} : réponse trop longue (${a.length})`);
  if (!Array.isArray(w) || w.length !== 3 || w.some(x => typeof x !== "string" || !x.trim())) errs.push(`${at} : il faut 3 mauvaises réponses`);
  else { const low = [a, ...w].map(x => x.trim().toLowerCase()); if (new Set(low).size !== 4) errs.push(`${at} : réponses en double`); }
  if (typeof note !== "string") errs.push(`${at} : note doit être une chaîne`);
  const k = (q || "").toLowerCase().replace(/[^a-zà-ÿ0-9]/g, "");
  if (seenQ.has(k)) errs.push(`${at} : question en double`); seenQ.add(k);
  dist[d] = (dist[d] || 0) + 1; perCat[c] = (perCat[c] || 0) + 1;
});
console.log(frPath, "questions:", (fr.q || []).length, "niveaux:", JSON.stringify(dist), "par catégorie:", JSON.stringify(perCat));
if (trPath) {
  const tr = JSON.parse(fs.readFileSync(trPath, "utf8"));
  if (!tr.cats) errs.push("traduction : cats manquant"); else cats.forEach(c => { if (!tr.cats[c]) errs.push(`traduction : nom de catégorie ${c} manquant`); });
  const nums = s => (String(s).match(/\d+/g) || []).join(",");
  (fr.q || []).forEach((r, i) => {
    const t = tr.q && tr.q[String(i)];
    if (!t) return errs.push(`traduction #${i} manquante`);
    if (!Array.isArray(t) || t.length !== 4 || !Array.isArray(t[2]) || t[2].length !== 3) return errs.push(`traduction #${i} : forme [q, a, [3 fausses], note]`);
    if (nums(t[1]) !== nums(r[3])) errs.push(`traduction #${i} : nombres de la réponse différents (${r[3]} → ${t[1]})`);
    t[2].forEach((x, j) => { if (nums(x) !== nums(r[4][j])) errs.push(`traduction #${i} : nombres de la fausse réponse ${j + 1} différents (${r[4][j]} → ${x})`); });
    const low = [t[1], ...t[2]].map(x => String(x).trim().toLowerCase()); if (new Set(low).size !== 4) errs.push(`traduction #${i} : réponses en double`);
  });
  const extra = Object.keys(tr.q || {}).filter(k => !(+k >= 0 && +k < fr.q.length)); if (extra.length) errs.push("traduction : clés en trop " + extra.join(","));
}
if (errs.length) { console.log("PROBLÈMES (" + errs.length + ") :\n" + errs.slice(0, 60).join("\n")); process.exit(1); }
console.log("OK");
