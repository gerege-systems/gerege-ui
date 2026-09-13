import { FileUpload } from '@/components/ui/FileUpload';
import type { ComponentDoc } from '../registry/types';

const doc: ComponentDoc = {
  slug: 'file-upload',
  name: 'FileUpload',
  group: 'Inputs',
  description:
    'Drag-and-drop file picker with click fallback. Reports selected files via onChange — does not perform the upload itself.',
  i18n: 'Reads `fileUpload.drop`, `fileUpload.remove`, and the size units `fileUpload.bytes` / `kilobytes` / `megabytes`.',
  exports: ['FileUpload'],
  sourceFile: 'FileUpload.tsx',
  examples: [
    {
      title: 'Default',
      preview: <FileUpload className="w-full max-w-md" hint="PDF, PNG up to 5 MB" />,
      code: `<FileUpload hint="PDF, PNG up to 5 MB" onChange={(files) => upload(files)} />`,
    },
    {
      title: 'Multiple + accept',
      preview: (
        <FileUpload className="w-full max-w-md" multiple accept="image/*" hint="Images only" />
      ),
      code: `<FileUpload multiple accept="image/*" hint="Images only" />`,
    },
    {
      title: 'States',
      description:
        'Disabled drop zone — drops and clicks are ignored. Loading and error are owned by the host: show a Progress bar and an Alert next to the zone.',
      preview: (
        <FileUpload
          className="w-full max-w-md"
          disabled
          hint="Uploads are paused while the workspace is read-only"
        />
      ),
      code: `<FileUpload disabled hint="Uploads are paused while the workspace is read-only" />`,
    },
  ],
  api: [
    {
      rows: [
        {
          name: 'onChange',
          type: '(files: File[]) => void',
          description: 'Fires when files are dropped or picked.',
        },
        {
          name: 'accept',
          type: 'string',
          description: 'MIME types or extensions, comma-separated.',
        },
        {
          name: 'multiple',
          type: 'boolean',
          default: 'false',
          description: 'Allow more than one file.',
        },
        {
          name: 'maxSize',
          type: 'number',
          description: 'Per-file byte cap. Files over the cap trigger an error.',
        },
        { name: 'hint', type: 'string', description: 'Hint shown below the drop zone.' },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables both drop and click.',
        },
      ],
    },
  ],
  accessibility: [
    'The drop zone is a <label> around a visually hidden file input — Tab reaches the input, Enter / Space open the OS file picker.',
    'Rejections (accept / maxSize) and the `error` prop render as a role="alert" line under the zone; the input is marked aria-invalid.',
  ],
  keyboard: [
    {
      key: 'Tab',
      action: 'Focus the (visually hidden) file input — the drop zone shows the focus ring.',
    },
    { key: 'Enter / Space', action: 'Open the OS file picker.' },
    { key: 'Tab / Shift+Tab', action: "Move to each listed file's remove button." },
    { key: 'Enter / Space', action: 'On a remove button: drop that file from the list.' },
  ],
  states: [
    {
      name: 'Error',
      how: '`error` node under the drop zone (role="alert"); the input gets aria-invalid.',
    },
    {
      name: 'Rejected',
      how: 'Files failing `accept` / `maxSize` are dropped, `onReject` fires and a built-in notice shows until the next accepted file.',
    },
    {
      name: 'Disabled',
      how: '`disabled` — the zone fades, drops are ignored and the input is disabled.',
    },
  ],
};

export default doc;
