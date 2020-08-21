# unified-doc

DOM APIs for [**unified-doc**][unified-doc].

## Contents
- [Install](#install)
- [API](#api)
  - [File Data Module](#file-data-module)
    - [`fromFile`](#fromFile)
    - [`toFile`](#toFile)
    - [`saveFile`](#saveFile)
  - [Highlight Module](#highlight-module)
    - [`highlight`](#highlight)
  - [Marks Module](#marks-module)
    - [`registerMarks`](#registerMarks)
  - [Select Text Module](#select-text-module)
    - [`selectText`](#selectText)

## Install
```sh
npm install unified-doc-dom
```

## API

The following documentation organizes the API methods by functionality.  The term `doc` used in the documentation refers to a `unified-doc` instance.

## File Data Module

This module provides methods that work with the `FileData` interface .  A `FileData` object is usually returned by calling the `doc.file()` method.

#### `fromFile`
##### Interface
```ts
function fromFile(file: File): Promise<FileData>
```
Returns `FileData` from a JS `File`.

Can only be used **asynchronously**.  This method is useful to extract file data that will be passed to `unified-doc` during initialization (e.g. `name`, `content`).

##### Use
```js
import { fromFile } from 'unified-doc-dom';

const file = File(['some content'], 'file.html', { type: 'text/html' });
const fileData = fromFile(file);
expect(fileData).toEqual({
  content: 'some content',
  extension: '.html',
  name: 'file.html',
  stem: 'file',
  type: 'text/html',
});
```

#### `toFile`
##### Interface
```ts
function toFile(fileData: FileData): File;
```
Returns a JS `File` from `FileData`.

This method is useful to convert the file data returned by the `doc.file()` API method into a JS `File` object.

##### Use
```js
import { toFile } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';

const doc = unifiedDoc({
  content: 'some content',
  filename: 'file.html',
})

const file = toFile(doc.file());
expect(file).toEqual(File(['some content'], 'file.html', { type: 'text/html' }));
```

#### `saveFile`
##### Interface
```ts
function saveFile(fileData: FileData): void;
```
Saves a JS `File` from `FileData`.

Implemented using the [`file-saver`][file-saver] package and `toFile` method.  This method is useful to save the file data returned by the `doc.file()`.

##### Use
```js
import { saveFile } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';

const doc = unifiedDoc({
  content: 'some content',
  filename: 'file.html',
})

function handleSaveSourceFile() {
  saveFile(doc.file());
}

function handleSaveHtmlFile() {
  saveFile(doc.file('.html'));
}

function handleSaveTextFile() {
  saveFile(doc.file('.txt'));
}
```

##### Related interfaces
```ts
interface FileData {
  /** file content in string form */
  content: string;
  /** file extension (includes preceding '.') */
  extension: string;
  /** file name (includes extension) */
  name: string;
  /** file name (without extension) */
  stem: string;
  /** mime type of file */
  type: string;
}
```

### Highlight Module

This module provides methods that allow highlighting DOM elements under a provided `docElement` (created by `unified-doc`).

#### `highlight`
##### Interface
```ts
function highlight(
  /** document DOM element rendered by `unified-doc` */
  docElement: HTMLElement,
  /** target element ID of interest */
  elementId: string,
  /** options to configure `highlight` behavior */
  options?: HighlightOptions,
): () => void;
```
Highlights all elements that match a provided `elementId` under a `docElement` rendered by `unified-doc`.

The highlighter draws a bounding box around all queried elements and is removed after a specified duration.  The method returns a cleanup function that can be called appropriately.

##### Use
```js
import { highlight } from 'unified-doc-dom';

// optionally import provided css highlight effects, or specify your own
import 'unified-doc-dom/css/highlight.css';

const docElement = ...; // document DOM element rendered by unified-doc

const options = {
  background: 'rgba(255, 0, 0, 0.3)',
  durationMs: 4000,
  highlighterClassName: 'custom-highlighter',
  selector: elementId => `[data-mark-id='${elementId}']`
};

function handleHighlightElement(elementId) {
  const cleanup = highlight(docElement, elementId, options);
  // you can use and call the cleanup method in a controlled way
}
```

##### Related interfaces
```ts
interface HighlightOptions {
  /** background color of the highlighter.  A low opacity is recommended e.g. rgba(0, 0, 255, 0.2) */
  background?: string;
  /** removes/fades the highlight after some elapsed duration (in ms) */
  durationMs?: number;
  /** customize highlighter behaviors with optional CSS */
  highlighterClassName?: string;
  /** custom `querySelector` pattern for selecting elements based on the provided `elementId` */
  selector?: (elementId: string) => string;
}
```

### Marks Module

This module provides methods that enhance the `marks` rendered by `unified-doc`.

#### `registerMarks`
##### Interface
```ts
function registerMarks(
  /** document DOM element rendered by `unified-doc` */
  docElement: HTMLElement,
  /** array of `marks` data used by `unified-doc` **/
  marks: Mark[],
  /** callbacks to apply to marked elements */
  callbacks: MarkCallbacks,
);
```
Registers all `mark` elements with provided `callbacks` under a `docElement` rendered by `unified-doc`

##### Related interfaces
```ts
interface Mark {
  /** unique ID for mark (required for mark algorithm to work) */
  id: string;
  /** start offset of the mark relative to `textContent` of the `doc` */
  start: number;
  /** end offset of the mark relative to `textContent` of the `doc` */
  end: number;
  /** apply optional CSS classnames to marked nodes */
  classNames?: string[];
  /** apply optional dataset attributes (i.e. `data-*`) to marked nodes */
  dataset?: Record<string, any>;
  /** contextual data can be stored here */
  data?: Record<string, any>;
  /** apply optional styles to marked nodes */
  style?: Record<string, any>;
}

type MarkCallback = (event: MouseEvent, mark: Mark) => void;

interface MarkCallbacks {
  onClick?: MarkCallback;
  onMouseEnter?: MarkCallback;
  onMouseOut?: MarkCallback;
}
```

### Select Text Module

#### `selectText`
##### Interface
```ts
function selectText(
  /** document DOM element rendered by `unified-doc` */
  docElement: HTMLElement,
  /** options to configure `selectText` behavior */
  options?: SelectTextOptions,
): () => void;
```
Capture text selection values (`mark`-compatible) under the `docElement` rendered by `unified-doc`.

The selected text has a similar interface as a `Mark`, allowing the captured selected text to be easily integrated as `marks` to update marks/annotations used by `unified-doc`.

##### Related interfaces
```ts
interface SelectedText {
  /** start offset of selected text relative to `textContent` of the `docElement` */
  start: number;
  /** end offset of selected text relative to `textContent` of the `docElement` */
  end: number;
  /** selected text value */
  value: string;
}

interface SelectTextOptions {
  /** captures the `SelectedText` object in a callback */
  callback?: (selectedText: SelectedText) => void;
}
```

<!-- Links -->
[unified-doc]: https://github.com/unified-doc/unified-doc
[file-saver]: https://github.com/eligrey/FileSaver.js
