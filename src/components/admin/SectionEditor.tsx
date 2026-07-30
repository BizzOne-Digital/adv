"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { PageSection } from "@/types";
import { cn, slugify } from "@/lib/utils";

export type SectionEditorProps = {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
};

function SortableSection({
  section,
  index,
  expanded,
  onToggle,
  onChange,
  onDuplicate,
  onDelete,
  onToggleVisible,
}: {
  section: PageSection;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onChange: (section: PageSection) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleVisible: () => void;
}) {
  const id = section._id || `section-${index}-${section.key}`;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-white/10 bg-white/[0.03]",
        isDragging && "opacity-70 ring-2 ring-lime/40",
        !section.visible && "opacity-60",
      )}
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <button
          type="button"
          className="cursor-grab touch-none rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className="text-xs tabular-nums text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="truncate text-sm font-medium text-white">
            {section.heading || section.key || "Untitled section"}
          </span>
          {expanded ? (
            <ChevronUp className="ml-auto h-4 w-4 text-white/40" />
          ) : (
            <ChevronDown className="ml-auto h-4 w-4 text-white/40" />
          )}
        </button>
        <button
          type="button"
          onClick={onToggleVisible}
          className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          title={section.visible ? "Hide" : "Show"}
        >
          {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
          title="Duplicate"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded p-1.5 text-white/50 hover:bg-canada-red/20 hover:text-red-300"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded ? (
        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Key"
              value={section.key}
              onChange={(v) => onChange({ ...section, key: slugify(v) || v })}
            />
            <Field
              label="Layout"
              value={section.layout || ""}
              onChange={(v) => onChange({ ...section, layout: v })}
            />
            <Field
              label="Eyebrow"
              value={section.eyebrow || ""}
              onChange={(v) => onChange({ ...section, eyebrow: v })}
            />
            <Field
              label="Background"
              value={section.background || ""}
              onChange={(v) => onChange({ ...section, background: v })}
            />
          </div>
          <Field
            label="Heading"
            value={section.heading || ""}
            onChange={(v) => onChange({ ...section, heading: v })}
          />
          <Field
            label="Subheading"
            value={section.subheading || ""}
            onChange={(v) => onChange({ ...section, subheading: v })}
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Body</label>
            <textarea
              value={section.body || ""}
              onChange={(e) => onChange({ ...section, body: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">
              Bullet points (one per line)
            </label>
            <textarea
              value={(section.bulletPoints || []).join("\n")}
              onChange={(e) =>
                onChange({
                  ...section,
                  bulletPoints: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              rows={3}
              className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1].map((slot) => {
              const image = section.images?.[slot];
              return (
                <ImageUploadField
                  key={`section-image-${slot}`}
                  label={slot === 0 ? "Primary image" : "Secondary image"}
                  folder="pages"
                  value={image?.url || ""}
                  alt={image?.alt || section.heading || ""}
                  onChange={(url) => {
                    const images = [...(section.images || [])];
                    while (images.length <= slot) {
                      images.push({ url: "", alt: "" });
                    }
                    if (!url) {
                      images.splice(slot, 1);
                    } else {
                      images[slot] = {
                        ...images[slot],
                        url,
                        alt: images[slot]?.alt || section.heading || "",
                      };
                    }
                    onChange({
                      ...section,
                      images: images.filter((img) => Boolean(img.url)),
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-white/50">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-lime/40 focus:outline-none"
      />
    </div>
  );
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const ids = sections.map(
    (s, i) => s._id || `section-${i}-${s.key}`,
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i,
    }));
    onChange(next);
  };

  const addSection = () => {
    const order = sections.length;
    const key = `section-${order + 1}`;
    const next: PageSection = {
      key,
      heading: "New section",
      body: "",
      visible: true,
      order,
      bulletPoints: [],
      ctas: [],
      images: [],
    };
    onChange([...sections, next]);
    setExpandedId(`section-${order}-${key}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Sections</h3>
        <button
          type="button"
          onClick={addSection}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 hover:border-lime/40 hover:text-lime"
        >
          <Plus className="h-3.5 w-3.5" />
          Add section
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sections.map((section, index) => {
              const id = section._id || `section-${index}-${section.key}`;
              return (
                <SortableSection
                  key={id}
                  section={section}
                  index={index}
                  expanded={expandedId === id}
                  onToggle={() =>
                    setExpandedId((cur) => (cur === id ? null : id))
                  }
                  onChange={(updated) => {
                    const next = [...sections];
                    next[index] = updated;
                    onChange(next);
                  }}
                  onDuplicate={() => {
                    const copy: PageSection = {
                      ...section,
                      _id: undefined,
                      key: `${section.key}-copy`,
                      heading: `${section.heading || section.key} (copy)`,
                      order: sections.length,
                    };
                    onChange([...sections, copy]);
                  }}
                  onDelete={() => {
                    onChange(
                      sections
                        .filter((_, i) => i !== index)
                        .map((s, i) => ({ ...s, order: i })),
                    );
                  }}
                  onToggleVisible={() => {
                    const next = [...sections];
                    next[index] = { ...section, visible: !section.visible };
                    onChange(next);
                  }}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default SectionEditor;
