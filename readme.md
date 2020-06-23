# unified-doc-dom

DOM APIs for [**unified-doc**][unified-doc].

## Install
```sh
npm install unified-doc-dom
```

## Use

The following example demonstrates simple usage with React components.

> Note that the API methods are simple Javascript functions and can be used in any ecosystem.  React is **not** a prerequisite.

```js
import React, { createElement, useEffect } from 'react';
import rehype2react from 'rehype-react';
import { highlight, selectText } from 'unified-doc-dom';
import unifiedDoc from 'unified-doc';

function MyDocument() {
  const docRef = useRef();

  useEffect(() => {
    function callback(selectedText) {
      console.log(selectedText);
    };
    return selectText(docRef.current, { callback }); // returns a cleanup function
  });

  const doc = unifiedDoc({
    annotations: [{ id: 'annotation-a', start: 5, end: 10 }],
    compiler: [rehype2react, { createElement }],
    content: '> **some** markdown content',
    filename: 'doc.md',
  });

  return (
    <div>
      <div ref={docRef}>
        {doc.compile().result}
      </div>
      <button onClick={() => highlight(docRef.current, 'annotation-a')}>
        Highlight Annotation
      </button>
    </div>
  );
}
```

## API

`unified-doc-dom` is designed to be used with a `doc` DOM element created by `unified-doc`.  The APIs should work for general DOM elements but the library does not guarantee backwards-compatibility for these general use cases.

### Methods

#### `highlight(doc: HTMLElement, elementId: string, options: HighlightOptions): () => void`
```ts
function highlight(
  doc: HTMLElement,
  elementId: string,
  options: HighlightOptions,
): () => void;
```

Accepts a root `doc` element and `elementId` with configurable `HighlightOptions` and applies a highlight effect to the target `element`.  Returns a cleanup function.

The highlighter is implemented as a simple temporal element that assumes the `doc` width and target `element` height and is rendered absolutely in relation to the target `element`.

Use the `HighlightOptions` to configure behaviors of the highlighter:
- `callback`: captures the targeted element.
- `durationMs`: specifies how long the highlight effect should last (in milliseconds).
- `highlighterClassName`: optionally style the highlighter with a custom class.  A default class is provided and highlighter animation effects can be accessed by importing the provided stylesheet (i.e. `import 'unified-doc-dom/lib/highlight.css';`).
- `highlighterId`: provide a custom ID for the highlighter element.  A default value is provided if no ID is specified.
- `style`: provides constrained ways to style the highlighter.

#### `selectText(doc: HTMLElement, options: SelectTextOptions): () => void`
```ts
function selectText(
  doc: HTMLElement,
  options: SelectTextOptions,
): () => void;
```

Accepts a root `doc` element and configurable `SelectTextOptions` and captures the `SelectedText` object for a text selection event.  Returns a cleanup function.

The `SelectedText` is an object specifying the `start`, `end` offset relative to the `textContent` of the `doc` element.  This object is useful and interoperable with many `unified-doc` APIs (`annotations`, `search`).

### Interfaces
```ts
interface HighlightOptions {
  callback?: (element: HTMLElement) => void;
  durationMs?: number;
  highlighterClassName?: string;
  highlighterId?: string;
  style?: {
    animationTimingFunction?: string;
    background?: string;
  };
}

interface SelectedText {
  start: number;
  end: number;
  value: string;
}

interface SelectTextOptions {
  callback?: (selectedText: SelectedText) => void;
}
```

## Development
This project is:
- linted with `xo` + `prettier` + `tsc`.
- developed and bundled with `microbundle`.
- softly-typed with `typescript` using `checkJs` (only public APIs are typed).

```sh
# bootstrap package
npm run bootstrap

# clean package (rm dist + node_modules)
npm run clean

# lint package with xo + prettier + tsc
npm run lint

# watch/rebuild package with microbundle
npm run dev

# test package with cypress (make sure to run the 'dev' script)
npm run test

# build package with microbundle
npm run build
```

<!-- Links -->
[rangy]: https://github.com/timdown/rangy
[unified-doc]: https://github.com/unified-doc/unified-doc
