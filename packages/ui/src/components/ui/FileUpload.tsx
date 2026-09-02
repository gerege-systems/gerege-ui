'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type ReactNode,
} from 'react';
import { File as FileIcon, Upload, X } from '@/icons';
import { cn } from '@/lib/utils';
import { useStrings } from '@/hooks/use-strings';
import { formatString, type UiStrings } from '@/lib/strings';

export type FileRejectReason = 'size' | 'type';

export interface FileUploadProps {
  /** Accepted file types, e.g. `image/*` or `.pdf,.docx`. */
  accept?: string;
  /** Allow multiple files. */
  multiple?: boolean;
  /** Max file size in bytes. Files larger than this are rejected. */
  maxSize?: number;
  /** Controlled file list. */
  value?: File[];
  /** Called when files are added or removed. */
  onChange?: (files: File[]) => void;
  /** Called with the files that were dropped because of `maxSize` or `accept`. */
  onReject?: (files: File[], reason: FileRejectReason) => void;
  /** Helper text inside the drop zone. */
  hint?: ReactNode;
  /** Disable the picker entirely. */
  disabled?: boolean;
  className?: string;
}

function formatSize(bytes: number, s: UiStrings['fileUpload']) {
  if (bytes < 1024) return formatString(s.bytes, { n: bytes });
  if (bytes < 1024 * 1024) return formatString(s.kilobytes, { n: (bytes / 1024).toFixed(1) });
  return formatString(s.megabytes, { n: (bytes / 1024 / 1024).toFixed(1) });
}

/** Mirror the browser's `accept` matching for dropped files (which skip the picker filter). */
function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const rules = accept
    .split(',')
    .map((r) => r.trim().toLowerCase())
    .filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/**
 * Drag-and-drop file picker with an inline file list. Uncontrolled by default;
 * pass `value` + `onChange` to control externally.
 */
export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  { accept, multiple, maxSize, value, onChange, onReject, hint, disabled, className },
  ref,
) {
  const strings = useStrings();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [internal, setInternal] = useState<File[]>([]);
  const [over, setOver] = useState(false);
  // dragenter/dragleave fire for every child element; count nesting depth so
  // the highlight does not flicker while the pointer crosses the label's children.
  const dragDepth = useRef(0);
  const files = value ?? internal;

  const update = useCallback(
    (next: File[]) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const accepted: File[] = [];
      const tooLarge: File[] = [];
      const wrongType: File[] = [];
      for (const f of Array.from(incoming)) {
        if (!matchesAccept(f, accept)) wrongType.push(f);
        else if (maxSize && f.size > maxSize) tooLarge.push(f);
        else accepted.push(f);
      }
      if (wrongType.length) onReject?.(wrongType, 'type');
      if (tooLarge.length) onReject?.(tooLarge, 'size');
      if (!accepted.length) return;
      update(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
    },
    [accept, files, maxSize, multiple, onReject, update],
  );

  const remove = (idx: number) => update(files.filter((_, i) => i !== idx));

  const onDrop = (e: ReactDragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    dragDepth.current = 0;
    setOver(false);
    if (disabled) return;
    addFiles(e.dataTransfer.files);
  };

  return (
    <div ref={ref} className={cn('flex flex-col gap-3', className)}>
      <label
        data-slot="file-upload"
        htmlFor={inputId}
        onDragEnter={() => {
          dragDepth.current += 1;
          if (!disabled) setOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => {
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setOver(false);
        }}
        onDrop={onDrop}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center gap-2',
          'border-border-input bg-background-subtle rounded-md border border-dashed px-6 py-8',
          'text-center transition-colors',
          'hover:border-border-strong hover:bg-background-muted',
          'focus-within:ring-ring focus-within:ring-offset-background focus-within:ring-2 focus-within:ring-offset-2',
          over && 'border-accent bg-accent-soft',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Upload className="text-foreground-muted size-5" aria-hidden />
        <div className="space-y-1">
          <p className="text-sm font-medium">{strings.fileUpload.drop}</p>
          {hint && <p className="text-foreground-muted text-xs">{hint}</p>}
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            // Allow re-selecting the same file after removing it.
            e.target.value = '';
          }}
        />
      </label>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${idx}`}
              className="border-border bg-card flex items-center gap-3 rounded-md border px-3 py-2"
            >
              <FileIcon className="text-foreground-muted size-4 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm" title={file.name}>
                  {file.name}
                </p>
                <p className="text-foreground-muted text-xs">
                  {formatSize(file.size, strings.fileUpload)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-foreground-muted hover:bg-background-muted hover:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm p-1 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label={formatString(strings.fileUpload.remove, { name: file.name })}
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
FileUpload.displayName = 'FileUpload';
