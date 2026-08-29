/**
 * Mini renderer Markdown → HTML (sin dependencias).
 * Cubre lo que generan los artículos: headings, párrafos, listas, tablas,
 * blockquotes, code fences, negritas, enlaces, citas [n].
 */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inline(s: string): string {
  let t = esc(s);
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, "<em>$1</em>");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\[(\d+)\]/g, '<span class="cite">[$1]</span>');
  return t;
}

export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  const flushTable = (rows: string[]): string => {
    if (rows.length < 2) return "";
    const head = rows[0].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    const bodyRows = rows.slice(2).map((r) =>
      r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
    let h = '<div class="table-wrap"><table><thead><tr>';
    h += head.map((c) => `<th>${inline(c)}</th>`).join("");
    h += "</tr></thead><tbody>";
    for (const cells of bodyRows) {
      h += "<tr>" + cells.map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>";
    }
    return h + "</tbody></table></div>";
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) { i += 1; continue; }

    // tabla
    if (line.startsWith("|") && i + 1 < lines.length && /^\|[\s\-|:]+\|$/.test(lines[i + 1].trim())) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i]); i += 1; }
      out.push(flushTable(rows));
      continue;
    }

    // heading
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i += 1; continue; }

    // hr
    if (/^(---|\*\*\*|___)$/.test(line)) { out.push("<hr>"); i += 1; continue; }

    // blockquote
    if (line.startsWith("> ")) {
      const block: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        block.push(lines[i].trim().replace(/^>\s*/, "")); i += 1;
      }
      out.push(`<blockquote><p>${inline(block.join(" "))}</p></blockquote>`);
      continue;
    }

    // code fence
    if (line.startsWith("```")) {
      const block: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) { block.push(lines[i]); i += 1; }
      i += 1;
      out.push(`<pre><code>${esc(block.join("\n"))}</code></pre>`);
      continue;
    }

    // lista no ordenada
    if (/^[-*]\s+/.test(line) && !line.startsWith("---")) {
      const items: string[] = [];
      while (i < lines.length) {
        const mm = /^[-*]\s+(.*)$/.exec(lines[i].trim());
        if (!mm) break;
        items.push(mm[1]); i += 1;
      }
      out.push(`<ul>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ul>`);
      continue;
    }

    // lista ordenada
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, "")); i += 1;
      }
      out.push(`<ol>${items.map((it) => `<li>${inline(it)}</li>`).join("")}</ol>`);
      continue;
    }

    // párrafo
    const block = [line];
    i += 1;
    while (i < lines.length) {
      const s2 = lines[i].trim();
      const esBloque = !s2 || s2.startsWith("#") || s2.startsWith("|") ||
        s2.startsWith(">") || s2.startsWith("```") || s2.startsWith("- ") ||
        s2.startsWith("* ") || /^\d+\.\s+/.test(s2) ||
        /^(---|\*\*\*|___)$/.test(s2);
      if (esBloque) break;
      block.push(s2); i += 1;
    }
    out.push(`<p>${inline(block.join(" "))}</p>`);
  }
  return out.join("\n");
}
