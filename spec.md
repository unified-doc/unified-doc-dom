# Spec

## Content
- [Intro](#intro)
  - [Where this specification fits](#where-this-specification-fits)
  - [Goals](#goals)
- [`doc`](#doc)
  - [`FileData`](#FileData)
  - [`marks`](#marks)
- [`docElement`](#docElement)
- [Glossary](#glossary)

## Intro
This document defines how the `unified-doc-dom` interface is designed and organized to extend unified DOM-based APIs to documents rendered by `unified-doc`.  Development of `unified-doc-dom` started in June 2020 for [unified-doc][].

### Where this specification fits

`unified-doc-dom`:
- enhances documents rendered by `unified-doc` via extension of DOM-based APIs.  Note that `unified-doc` document APIs do not support DOM-specific features.
- relates to the DOM in that its APIs are fully compatible with the DOM.
- relates to [unified][] and [hast][] in that it works with documents rendered as a result of these ecosystems of tools and utilities.

### Goals
`unified-doc-dom` aims to
- build useful and valuable DOM-specific features for `unified-doc` rendered documents.
- implement these features in a simple and modular way.
- be agnostic of underlying content type, (just like `unified-doc`).
- be interoperable with any `doc` instance or `docElement` rendered by `unified-doc`.

## `doc`
A `doc` refers to an instance of `unified-doc`.  Please visit the [unified-doc][] project for more details of the `doc` interface.  `unified-doc-dom` methods may integrate with various `doc` methods to exchange data in compatible ways.  A few important integrations are explored below.

### `FileData`
A `FileData` interface describes the relevant data that a JS `File` would contain, in serializable form.  A `FileData` object is returned by calling the `doc.file()` method.
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

Methods to convert between `FileData` and JS `File` interface would bridge the way content is sent to `unified-doc`, or stored from `unified-doc`.  This allows `unified-doc` to process and manage content, while supporting easy ways to retrieve and save the file data as JS `File` that are interoperable with the rest of the web stack.

### `marks`
A `Mark` interface informs how text can be marked in a document.  Marks are generated in a document by providing an array of `marks` to `unified-doc`, where `mark` elements are applied to the document.

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
```

Methods to enhance marked elements with interactions can be supplied with `unified-doc-dom` by querying marked elements under the rendered document and attaching relevant callbacks.


## `docElement`
A `docElement` refers to the document DOM element (usually a `div`) rendered by `unified-doc`.  Having a reference to the actual DOM element allows us to implement features that affect only the `docElement`, without risk of influencing other areas of the web document.

With the knowledge that a `docElement` is related to its `doc` instance, and by that assocation, to its source content, we can interface DOM-based methods directly with the document's source content.  This is extremely powerful because we do not need to write any logic against varying source content types when working with DOM-based methods since `unified-doc` has solved that layer.  Some examples of DOM-based methods being interoperable with the source content are presented below:
- Capture text selection events as `mark` objects (i.e. tracking the `start`, `end` offsets relative to the `textContent` of the document).  This allows us to easily mark/annotate documents through DOM-based interaction.
- Marked elements under a `docElement` are directly related to `marks` specified on a `doc` instance.  As a result, we can iterate over `marks` to further enhance marked elements with DOM-specific features (e.g. adding interaction callbacks, highlighting marked elements in richer).
- Apply any interoperable web technologies to the `docElement` that are otherwise not applicable outside of the browser.

This is an exciting area to build powerful and useful document features.  A few ideas that come to mind:
- Scaled document preview
- Printable pages
- Saving documents as images/canvas/pdf
- much more in [ideas][]

## Glossary
- **`doc`**: Refers to a `unified-doc` instance.  A `doc` can be compiled and rendered into a `docElement`.
- **`docElement`**: The document DOM element (usually a `div`) that is rendered by a `doc` instance.
- **`FileData`**: An object that represents relevant `File` data in serializable form.
- **`marks`**: An array of data conforming to the `Mark` interface that is used by `unified-doc` to mark text nodes.
- **`textContent`**: The text content of a `doc` or `docElement` is equivalent to the concatenation of all text node values in the document.
- **`unified`**: the [project][unified] that unifies content as structured data.
- **`unified-doc`**: the [project][unified-doc] that unifies document APIs on top of a unified content layer.
- **`unified-doc-dom`**: this [project][unified-doc] that extends DOM-based APIs for the `unified-doc` project.



<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[ideas]: https://github.com/unified-doc/ideas
[unified-doc]: https://github.com/unified-doc/unified-doc
[unified]: https://github.com/unifiedjs/unified
