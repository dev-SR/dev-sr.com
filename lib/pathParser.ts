// pathParser.ts
import YAML from 'yaml';

export type TopicItem = {
  name: string;
  slug?: string;
};

export type CurriculumNode = {
  id: string;
  label: string;
  title: string;
  topics?: TopicItem[];
  monthLabel: string; // e.g., "Month 1 — Foundations"
  weekLabel: string; // e.g., "Week 1"
  optional?: boolean;
};

export type CurriculumEdge = {
  id: string;
  source: string;
  target: string;
};

export type ParsedCurriculum = {
  nodes: CurriculumNode[];
  edges: CurriculumEdge[];
  order: string[]; // linear order by week for progress slider
  monthColors: Record<string, string>;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// The incoming script can be YAML string or JSON string or object
export function parseCurriculum(script: unknown, theme?: { monthColors?: Record<string, string> }): ParsedCurriculum {
  let data: any;
  if (typeof script === 'string') {
    try {
      // try JSON first for speed
      data = JSON.parse(script);
    } catch {
      data = YAML.parse(script);
    }
  } else {
    data = script;
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid curriculum script: expected YAML/JSON object');
  }

  const nodes: CurriculumNode[] = [];
  const edges: CurriculumEdge[] = [];
  const order: string[] = [];

  const monthColors: Record<string, string> = {
    // defaults; can be overridden by theme
    'Month 1': '#d4e4ff',
    'Month 2': '#ffe6cc',
    'Month 3': '#eadcff',
    'Month 4': '#dfffea',
    'Month 5': '#ffe4ec',
    ...(theme?.monthColors ?? {}),
  };

  // Top-level keys are months like "MONTH 1 — Foundations"
  for (const rawMonthKey of Object.keys(data)) {
    const monthBlock = data[rawMonthKey];
    if (!monthBlock || typeof monthBlock !== 'object') continue;

    // Normalize month label
    const monthMatch = /month\s*(\d+)/i.exec(rawMonthKey);
    const monthNumber = monthMatch ? parseInt(monthMatch[1], 10) : undefined;
    const monthBase = monthNumber ? `Month ${monthNumber}` : rawMonthKey;
    const monthLabel = rawMonthKey;

    const weeks = monthBlock.Weeks || monthBlock.weeks || [];
    if (!Array.isArray(weeks)) continue;

    for (const weekEntry of weeks) {
      // Week entries can be either:
      // 1) { "Week 1": { Title, Topics, DependsOn } }
      // 2) { Title, Topics, DependsOn, Name: "Week 1" }
      let weekLabel = '';
      let details: any = weekEntry;
      if (typeof weekEntry === 'object' && !Array.isArray(weekEntry)) {
        const keys = Object.keys(weekEntry);
        if (keys.length === 1 && /week\s*\d+/i.test(keys[0])) {
          weekLabel = keys[0];
          details = weekEntry[keys[0]];
        } else {
          weekLabel = (weekEntry.Week || weekEntry.week || weekEntry.name || weekEntry.Name || '').toString();
          details = weekEntry;
          if (!/week\s*\d+/i.test(weekLabel)) {
            // last resort: make a running label
            weekLabel = `Week ${order.length + 1}`;
          }
        }
      }

      // normalize week label
      weekLabel = (weekLabel || '').toString().trim();

      const id = `${slugify(monthBase)}-${slugify(weekLabel)}`;
      const title: string = details?.Title || details?.title || weekLabel;

      const rawTopics = details?.Topics ?? details?.topics ?? [];
      const topics: TopicItem[] = Array.isArray(rawTopics)
        ? rawTopics
          .map((t: any) => {
            if (typeof t === 'string') {
              return { name: t, slug: slugify(t) } as TopicItem;
            } else if (t && typeof t === 'object') {
              const name = (t.name ?? t.title ?? '').toString();
              const slug = t.slug ? t.slug.toString() : name ? slugify(name) : undefined;
              if (!name) return null;
              return { name, slug } as TopicItem;
            }
            return null;
          })
          .filter(Boolean) as TopicItem[]
        : [];

      const optional: boolean = !!(details?.Optional || details?.optional);

      nodes.push({ id, label: title, title, topics, monthLabel, weekLabel, optional });
      order.push(id);
    }
  }

  // Build a map from week label within each month to node id
  const monthWeekToId = new Map<string, string>();
  for (const n of nodes) {
    const weekKey = (n.weekLabel || '').toString().trim().toLowerCase();
    const monthMatch = /month\s*(\d+)/i.exec(n.monthLabel);
    const monthBase = monthMatch ? `Month ${parseInt(monthMatch[1], 10)}` : n.monthLabel;
    const variants = [
      n.monthLabel,
      monthBase,
      slugify(monthBase),
      n.monthLabel.toLowerCase(),
      monthBase.toLowerCase(),
      slugify(monthBase).toLowerCase(),
    ].filter(Boolean);
    for (const v of variants) {
      monthWeekToId.set(`${v.toString().trim().toLowerCase()}::${weekKey}`, n.id);
    }
  }

  // Create edges based on DependsOn
  for (const rawMonthKey of Object.keys(data)) {
    const monthBlock = data[rawMonthKey];
    const weeks = monthBlock?.Weeks || monthBlock?.weeks || [];
    if (!Array.isArray(weeks)) continue;

    for (const weekEntry of weeks) {
      let weekLabel = '';
      let details: any = weekEntry;
      if (typeof weekEntry === 'object' && !Array.isArray(weekEntry)) {
        const keys = Object.keys(weekEntry);
        if (keys.length === 1 && /week\s*\d+/i.test(keys[0])) {
          weekLabel = keys[0];
          details = weekEntry[keys[0]];
        } else {
          weekLabel = (weekEntry.Week || weekEntry.week || weekEntry.name || weekEntry.Name || '').toString();
          details = weekEntry;
          if (!/week\s*\d+/i.test(weekLabel)) {
            weekLabel = `Week ${order.length + 1}`;
          }
        }
      }

      // normalize week label
      weekLabel = (weekLabel || '').toString().trim();

      // Resolve target using multiple month variants
      const targetWeekLower = weekLabel.toLowerCase();
      const monthMatch = /month\s*(\d+)/i.exec(rawMonthKey);
      const monthBase = monthMatch ? `Month ${parseInt(monthMatch[1], 10)}` : rawMonthKey;
      const monthVariants = [
        rawMonthKey,
        monthBase,
        slugify(monthBase),
        rawMonthKey.toLowerCase(),
        monthBase.toLowerCase(),
        slugify(monthBase).toLowerCase(),
      ].filter(Boolean);
      let targetId: string | undefined;
      for (const mv of monthVariants) {
        const k = `${mv.toLowerCase()}::${targetWeekLower}`;
        const found = monthWeekToId.get(k);
        if (found) {
          targetId = found;
          break;
        }
      }
      if (!targetId) {
        // fallback: unique week-only match across all months
        const candidates = Array.from(monthWeekToId.entries()).filter(([k]) => k.endsWith(`::${targetWeekLower}`));
        if (candidates.length === 1) targetId = candidates[0][1];
      }
      if (!targetId) {
        console.warn(`parseCurriculum: couldn't resolve target for week "${weekLabel}" in month "${rawMonthKey}"`);
        continue;
      }

      // Accept DependsOn as array or a single string
      const rawDepends = details?.DependsOn ?? details?.dependsOn;
      const depends: string[] = typeof rawDepends === 'string'
        ? [rawDepends]
        : Array.isArray(rawDepends)
          ? rawDepends
          : [];

      for (const dep of depends) {
        // dep could be "Week 1" or "Month 1: Week 1"
        if (!dep || typeof dep !== 'string') continue;
        const depLower = dep.toString().trim().toLowerCase();

        // try same-month variants first
        let sourceId: string | undefined;
        for (const mv of monthVariants) {
          const k = `${mv.toLowerCase()}::${depLower}`;
          const found = monthWeekToId.get(k);
          if (found) {
            sourceId = found;
            break;
          }
        }

        // if not found, try "Month X: Week Y" style in dep string
        if (!sourceId && dep.includes(':')) {
          const parts = dep.split(':', 2);
          const depMonth = parts[0].trim();
          const depWeek = parts[1].trim().toLowerCase();
          const depMonthVariants = [
            depMonth,
            depMonth.toLowerCase(),
            slugify(depMonth),
            slugify(depMonth).toLowerCase(),
          ].filter(Boolean);
          for (const dm of depMonthVariants) {
            const k = `${dm.toLowerCase()}::${depWeek}`;
            const found = monthWeekToId.get(k);
            if (found) {
              sourceId = found;
              break;
            }
          }
        }

        // fallback: week-only unique match
        if (!sourceId) {
          const candidates = Array.from(monthWeekToId.entries()).filter(([k]) =>
            k.endsWith(`::${depLower}`)
          );
          if (candidates.length === 1) sourceId = candidates[0][1];
        }

        if (sourceId) {
          // use a safe separator for edge ids (avoid "->" in ids)
          edges.push({ id: `${sourceId}__${targetId}`, source: sourceId, target: targetId });
        } else {
          console.warn(
            `parseCurriculum: couldn't resolve dependency "${dep}" for target "${targetId}" (week "${weekLabel}" in month "${rawMonthKey}")`
          );
        }
      }
    }
  }

  // debug: surface node/edge ids so it's easy to inspect mismatches
  try {
    // eslint-disable-next-line no-console
    console.debug && console.debug('parseCurriculum nodes:', nodes.map(n => n.id));
    // eslint-disable-next-line no-console
    console.debug && console.debug('parseCurriculum edges:', edges.map(e => ({ id: e.id, src: e.source, dst: e.target })));
  } catch (e) {
    // noop
  }

  return { nodes, edges, order, monthColors };
}