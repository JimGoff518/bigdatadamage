// Code node "Parse & validate" — extracts frontmatter + body from Gemini's
// output (handles ```yaml fences, --- delimiters, or whole-doc-wrapped output),
// normalizes to quoted --- YAML, validates, and base64-encodes the final .md.
const TB = String.fromCharCode(96, 96, 96);
const parts = $json.candidates?.[0]?.content?.parts || [];
let text = parts.map(p => p.text || '').join('');
text = text.replace(/\r\n/g, '\n').trim();
text = text.replace(new RegExp('^' + TB + '[a-zA-Z]*[ \\t]*\\n'), '');
text = text.replace(new RegExp('\\n?' + TB + '[ \\t]*$'), '');
text = text.trim();

const keys = ['title','excerpt','date','author','harm','location','seoTitle','seoDescription'];
const lines = text.split('\n');
const data = {};
let i = 0;
if (lines[0] && lines[0].trim() === '---') i = 1;
for (; i < lines.length; i++) {
  const t = lines[i].trim();
  if (t === '---') { i++; break; }
  if (t.startsWith(TB)) { if (Object.keys(data).length) { i++; break; } else { continue; } }
  const mm = lines[i].match(/^([A-Za-z]+):\s*(.*)$/);
  if (mm && keys.includes(mm[1])) { data[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, ''); }
  else if (t === '') { if (Object.keys(data).length) { i++; break; } }
  else { break; }
}
let body = lines.slice(i).join('\n').trim();

if (!data.title) { throw new Error('No title. First 200: ' + text.slice(0, 200)); }
const fm = keys.filter(k => data[k]).map(k => k + ': "' + data[k].replace(/"/g, '\\"') + '"').join('\n');
const title = data.title;
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

const stripped = body.replace(/^\s*https?:\/\/\S+\s*$/gim, '');
if (/<\/?[a-z][\s\S]*?>/i.test(stripped)) { throw new Error('Raw HTML detected in body'); }
const wc = body.split(/\s+/).filter(Boolean).length;
if (wc < 250) { throw new Error('Draft too short: ' + wc + ' words'); }

const finalMd = '---\n' + fm + '\n---\n\n' + body + '\n';
const contentB64 = Buffer.from(finalMd, 'utf8').toString('base64');
return [{ json: { slug: slug, path: 'src/content/articles/' + slug + '.md', title: title, contentB64: contentB64, row_number: $('Build Gemini request').item.json.row_number } }];
