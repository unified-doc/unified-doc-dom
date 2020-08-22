# unified-doc-dom

DOM APIs for [**unified-doc**][unified-doc].

---

## Install
```sh
npm install unified-doc-dom
```

## Use

```js
import unifiedDoc from 'unified-doc';
import {
  fromFile,
  highlight,
  registerMarks,
  saveFile,
  selectText
} from 'unified-doc-dom';

const file = new File(...);
const marks: [
  { id: 'a', start: 0, end: 5 },
  { id: 'b', start: 7, end: 10 },
];

// prepare data from file and initialize a doc instance
const fileData = await fromFile(file);
const doc = unifiedDoc({
  content: fileData.content,
  filename: fileData.name,
  marks,
});

// save files in different format
function saveAsHtml() {
  saveFile(doc.file('.html'));
}
function saveAsText() {
  saveFile(doc.file('.txt'));
}

// render the document and retrieve the docElement DOM element
const docElement = ... // via doc.compile()

// register click events and custom tooltip implementations with registerMarks
function createTooltip(event, mark) {...}
function destroyTooltip(event, mark) {...}
function register() {
  registerMarks(docElement, marks, {
    onClick: (event, mark) => console.log(mark.id),
    onMouseEnter: (event, mark) => createTooltip(event, mark),
    onMouseLeave: (event, mark) => destroyTooltip(event, mark),
  })
}

// highlights a mark (e.g. triggered from a button's click event)
function highlightMark(markId) {
  const cleanup = highlight(docElement, markId);
  // use the cleanup function appropriately in a controlled manner
}

// update/add marks on text selection
function register() {
  function callback(selectedText) {
    marks.push(selectedText);
  }
  const cleanup = selectText(docElement, { callback });
  // use the cleanup function appropriately in a controlled manner
}
```

## API

- [`fromFile`](#fromFile)
- [`toFile`](#toFile)
- [`saveFile`](#saveFile)
- [`highlight`](#highlight)
- [`registerMarks`](#registerMarks)
- [`selectText`](#selectText)

The term `doc` used below refers to a `unified-doc` instance.  Please refer to [**unified-doc**][unified-doc] for detailed documentation of `doc` API methods.

### `fromFile`
#### Interface
```ts
function fromFile(file: File): Promise<FileData>
```
Returns `FileData` from a JS `File`.

Can only be used **asynchronously**.  This method is useful to prepare file data that will be passed to `unified-doc` during initialization (e.g. `name`, `content`).

#### Example
```js
import { fromFile } from 'unified-doc-dom';

const file = File(['> some **strong** content'], 'doc.md', { type: 'text/markdown' });
const fileData = await fromFile(file);

expect(fileData).toEqual({
  content: '> some **strong** content',
  extension: '.md',
  name: 'doc.md',
  stem: 'doc',
  type: 'text/markdown',
});
```

### `toFile`
#### Interface
```ts
function toFile(fileData: FileData): File;
```
Returns a JS `File` from `FileData`.

This method is useful to convert file data into a JS `File` object.  When used together with `doc.file()`, this is an easy way to retrieve file representations in supported formats.

#### Example
```js
import { toFile } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';

const doc = unifiedDoc({
  content: '> some **strong** content',
  filename: 'doc.md',
})

expect(toFile(doc.file('.txt')))
  .toEqual(File(
    ['some strong content'],
    'doc.txt',
    { type: 'text/plain' },
  ));
expect(toFile(doc.file('.html')))
  .toEqual(File(
    ['<blockquote>some <strong>strong</strong> content<blockquote>'],
    'doc.html',
    { type: 'text/html' }
  ));
```

### `saveFile`
#### Interface
```ts
function saveFile(fileData: FileData): void;
```
Saves a JS `File` from `FileData`.

Implemented using the [`file-saver`][file-saver] package and `toFile` method.  This method is useful to save the file data returned by the `doc.file()`.

#### Example
```js
import { saveFile } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';

const doc = unifiedDoc({
  content: '> some **strong** content',
  filename: 'doc.md',
})

function saveAsSource() {
  saveFile(doc.file());
}

function saveAsHtml() {
  saveFile(doc.file('.html'));
}

function saveAsText() {
  saveFile(doc.file('.txt'));
}
```

#### Related interfaces
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

### `highlight`
#### Interface
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

The highlighter draws a bounding box around all queried elements and removes itself after a specified duration.  The method returns a cleanup function that can be called appropriately.

#### Example
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

#### Related interfaces
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

### `registerMarks`
#### Interface
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

#### Related interfaces
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

### `selectText`
#### Interface
```ts
function selectText(
  /** document DOM element rendered by `unified-doc` */
  docElement: HTMLElement,
  /** options to configure `selectText` behavior */
  options?: SelectTextOptions,
): () => void;
```
Capture selected text under the `docElement` rendered by `unified-doc`.

Implemented using the [`rangy`][rangy] package.  The selected text object is `Mark`-compatible, allowing easy integration with `marks` used by `unified-doc`.

#### Related interfaces
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

<!-- Definitions -->
[unified-doc]: https://github.com/unified-doc/unified-doc
[file-saver]: https://github.com/eligrey/FileSaver.js
[rangy]: https://github.com/timdown/rangy 
