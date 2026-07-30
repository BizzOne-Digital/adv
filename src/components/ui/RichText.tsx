import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

export type RichTextProps = {
  html: string;
  className?: string;
};

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "code",
  "pre",
  "img",
  "figure",
  "figcaption",
  "span",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class"];

export function RichText({ html, className }: RichTextProps) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });

  return (
    <div
      className={cn(
        "prose prose-forest max-w-none text-foreground/90",
        "prose-headings:text-forest prose-a:text-tech-blue prose-a:no-underline hover:prose-a:underline",
        "prose-img:rounded-none",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

export default RichText;
