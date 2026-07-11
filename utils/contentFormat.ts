export type ContentFormat = 'json' | 'html' | 'invalid';

export interface CustomElementAttribute {
  name: string;
  value: string;
}

export interface ParsedCustomElement {
  tagName: string;
  attrs: CustomElementAttribute[];
  outerHtml: string;
  innerHtml: string;
}

export type DetectedContent =
  | { format: 'json'; value: any }
  | { format: 'html'; value: ParsedCustomElement }
  | { format: 'invalid'; error: string };

const INVALID_JSON_MESSAGE = 'Content does not begin with JSON ([ or {) or a custom HTML element (<).';

const trimStart = (raw: string): string => raw.replace(/^\s+/, '');

export const isValidCustomElementTagName = (tag: string): boolean => {
  return /^[a-z][a-z0-9]*-[a-z0-9-]+$/.test(tag);
};

export const detectContentFormat = (raw: string | null | undefined): ContentFormat => {
  if (raw == null) return 'invalid';
  const trimmed = trimStart(String(raw));
  if (!trimmed) return 'invalid';
  const first = trimmed[0];
  if (first === '{' || first === '[') return 'json';
  if (first === '<') return 'html';
  return 'invalid';
};

const parseCustomElement = (raw: string): ParsedCustomElement | { error: string } => {
  if (typeof DOMParser === 'undefined') {
    // Server-side path: best-effort regex extraction. Browser parser is more
    // accurate and runs at the editor + preview call sites.
    const match = raw.match(/^<\s*([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>([\s\S]*)<\s*\/\s*\1\s*>\s*$/);
    if (!match) {
      return { error: 'HTML must contain a single custom element with matching open/close tags.' };
    }
    const [, tagName, attrString, innerHtml] = match;
    if (!isValidCustomElementTagName(tagName)) {
      return { error: `Invalid custom element tag name: "${tagName}". Tag must contain a hyphen (e.g. "my-element").` };
    }
    const attrs = parseAttributeString(attrString);
    return { tagName, attrs, innerHtml: innerHtml.trim(), outerHtml: match[0] };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, 'text/html');
  const bodyChildren = Array.from(doc.body.children);

  if (bodyChildren.length !== 1) {
    return {
      error:
        bodyChildren.length === 0
          ? 'HTML content is empty or could not be parsed.'
          : `HTML must contain exactly one root element (found ${bodyChildren.length}).`,
    };
  }

  const root = bodyChildren[0];
  const tagName = root.tagName.toLowerCase();

  if (!isValidCustomElementTagName(tagName)) {
    return {
      error: `Invalid custom element tag name: "<${tagName}>". Tag must contain a hyphen (e.g. "my-element").`,
    };
  }

  if (root instanceof HTMLUnknownElement) {
    return {
      error: `Unknown element "<${tagName}>". Custom element tags must contain a hyphen.`,
    };
  }

  const attrs: CustomElementAttribute[] = [];
  for (const attr of Array.from(root.attributes)) {
    attrs.push({ name: attr.name, value: attr.value });
  }

  return {
    tagName,
    attrs,
    innerHtml: root.innerHTML,
    outerHtml: root.outerHTML,
  };
};

// Extract {name, value} pairs from the raw attribute text between a tag's
// angle brackets. Handles double-quoted, single-quoted, unquoted, and
// boolean (valueless) attributes. Later duplicates of the same name are
// ignored (HTML treats the first one as authoritative).
const parseAttributeString = (attrString: string): CustomElementAttribute[] => {
  const attrs: CustomElementAttribute[] = [];
  const seen = new Set<string>();
  const attrRegex = /([a-zA-Z_:][a-zA-Z0-9_:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = attrRegex.exec(attrString)) !== null) {
    const name = m[1];
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    attrs.push({ name, value });
  }
  return attrs;
};

export const parseContent = (raw: string | null | undefined): DetectedContent => {
  if (raw == null) return { format: 'invalid', error: 'Content is empty.' };
  const trimmed = trimStart(String(raw));
  if (!trimmed) return { format: 'invalid', error: 'Content is empty.' };

  const format = detectContentFormat(trimmed);
  if (format === 'json') {
    try {
      return { format: 'json', value: JSON.parse(trimmed) };
    } catch (e: any) {
      return { format: 'invalid', error: `Invalid JSON: ${e?.message || 'syntax error'}` };
    }
  }

  if (format === 'html') {
    const result = parseCustomElement(trimmed);
    if ('error' in result) {
      return { format: 'invalid', error: result.error };
    }
    return { format: 'html', value: result };
  }

  return { format: 'invalid', error: INVALID_JSON_MESSAGE };
};

export const getFormatLabel = (format: ContentFormat): string => {
  switch (format) {
    case 'json':
      return 'JSON';
    case 'html':
      return 'HTML Custom Element';
    default:
      return 'Invalid';
  }
};

/**
 * Normalize a raw `content` value coming from PocketBase into the in-memory
 * shape used by the rest of the app:
 *   - null/undefined         -> as-is
 *   - object/array           -> as-is (already JSON)
 *   - string starting with JSON -> parsed value
 *   - string starting with `<`  -> preserved verbatim (custom element)
 *   - any other string       -> preserved verbatim (legacy markdown)
 *
 * This is the single source of truth for read-path normalization; it
 * supersedes the older `parseLessonContent` helper that blindly
 * `JSON.parse`'d strings and destroyed custom-element content.
 */
export const normalizeContent = (raw: any): any => {
  if (raw == null) return raw;
  if (typeof raw !== 'string') return raw;
  const detected = parseContent(raw);
  if (detected.format === 'json') return detected.value;
  return raw;
};
