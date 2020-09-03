# Spec

## Contents
- [Intro](#intro)
  - [Where this specification fits](#where-this-specification-fits)
  - [Goals](#goals)
- [`doc`](#doc)
  - [`FileData`](#FileData)
  - [`marks`](#marks)
- [`docElement`](#docElement)
- [Glossary](#glossary)

## Intro
This document defines how the `unified-doc-dom` interface is designed to extend browser/DOM-based APIs to documents rendered by `unified-doc`.  Development of `unified-doc-dom` started in June 2020 for [**unified-doc**][unified-doc].

### Where this specification fits

`unified-doc-dom` relates to:
- the DOM in that its APIs are fully compatible with the DOM.
- [unified][] and [hast][] in that it works with documents rendered by tools and utilities in these ecosystems.
- [**unified-doc**][unified-doc] in that it is extends DOM-based methods to documents rendered by `unified-doc`.  Note that API methods in `unified-doc` are not DOM-compatible.

### Goals
`unified-doc-dom` aims to
- build useful and valuable features for `unified-doc` rendered documents, usable in the DOM.
- implement these features in a simple and modular way.
- interoperate with any `doc` instance or `docElement` rendered by `unified-doc`.
- be agnostic of underlying content type.

## `doc`
A `doc` refers to an instance of `unified-doc`.  Please visit the [**unified-doc**][unified-doc] project for more details of the `doc` interface.  `unified-doc-dom` methods may integrate with various `doc` methods to exchange data in compatible ways.  A few important integrations are elaborated below.

### `FileData`
This interface describes the relevant data that a JS `File` contains, in serializable form.  A `FileData` object can be obtained by calling the `doc.file()` method.
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

Methods to convert between `FileData` and JS `File` interface would bridge the way content is sent to `unified-doc`, or stored from `unified-doc`.  This allows `unified-doc` to process and manage content, while supporting easy ways to retrieve and save the file data as a JS `File`, which is usable in further web applications.

### `marks`
A `Mark` interface informs how text can be marked in a document.  Marks are generated in a document by providing an array of `marks` to `unified-doc`, where `mark` elements are added to the rendered document.

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

Methods to enhance marked elements with interactions can be implemented by attaching relevant callbacks.


## `docElement`
A `docElement` refers to the document DOM element (usually a `div`) rendered by `unified-doc`.  Having a reference to the actual DOM element allows us to implement features that affect only the `docElement`, without risk of influencing other sections of the web document.

The `docElement` is related to its `doc` instance, through `unified-doc`.  As a result, any DOM-based methods interacting with the `docElement`'s content is directly interacting with the `doc` instance, and by extension, its source content.  This is extremely powerful, and opens up DOM operations to manipulating the underlying source content irregardless of content type, as illustrated in the following examples:

- Capture text selection events as `Mark` objects compatible with `unified-doc` to easily support ways to add `marks` through DOM interactions.
- Marked elements rendered under a `docElement` can be programmatically iterated through declarative data since they are modeled by the `marks` data supplied to `unified-doc`.
- Potentially new ways of creating text editors where editing interactions through the `docElement` DOM node is directly updating the [hast][] tree.

Since the `docElement` is just a DOM element, we should be able to apply web technologies to build cool features for all documents rendered by `unified-doc`.  A few ideas include:
- Scalable document preview
- Printable pages
- Saving documents as images/canvas/pdf
- and other [ideas][]

## Glossary
- **`doc`**: Refers to a `unified-doc` instance.  A `doc` is compiled and rendered into a `docElement`.
- **`docElement`**: The document DOM element (usually a `div`) that is rendered by a `doc` instance.
- **`FileData`**: An object that represents relevant `File` data, in serializable form.
- **`marks`**: An array of data conforming to the `Mark` interface that is used by `unified-doc` to mark text nodes.
- **`textContent`**: The text content of a `doc` or `docElement` is equivalent to the concatenation of all text node values in the document.
- **`unified`**: The [project][unified] that unifies content as structured data.
- **`unified-doc`**: The [project][unified-doc] that unifies document APIs on top of a unified content layer.
- **`unified-doc-dom`**: This project that extends DOM-based APIs for the `unified-doc` project.


<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[ideas]: https://github.com/unified-doc/ideas
[unified-doc]: https://github.com/unified-doc/unified-doc
[unified]: https://github.com/unifiedjs/unified
