import DOMPurify from "isomorphic-dompurify";

const DEFAULT_ALLOWED_TAGS = [
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "code",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

const DEFAULT_ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "src",
  "alt",
  "title",
  "width",
  "height",
  "class",
  "id",
];

export interface SanitizeOptions {
  allowedTags?: string[];
  allowedAttr?: string[];
}

export function sanitizeHtml(
  dirty: string,
  options: SanitizeOptions = {},
): string {
  if (!dirty) {
    return "";
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: options.allowedTags ?? DEFAULT_ALLOWED_TAGS,
    ALLOWED_ATTR: options.allowedAttr ?? DEFAULT_ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
  });
}

export function sanitizePlainText(value: string): string {
  if (!value) {
    return "";
  }

  return DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}
