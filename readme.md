# unified-doc
DOM APIs for [**unified-doc**][unified-doc].

---

## Contents
- [Intro](#intro)
- [Spec](#spec)
- [Packages](#packages)
- [Development](#development)

## Intro
`unified-doc` provides a set of unified document APIs to streamline working with content across varying types.  `unified-doc-dom` extends a set of useful browser/DOM-based APIs for documents that are rendered with `unified-doc`.

With `unified-doc-dom`, we can easily
- highlight and emphasize marked elements in a document.
- convert and save supported file formats.
- capture text selections and create `Mark` data compatible with `unified-doc`.
- extend future features to all document types supported by `unified-doc`.
- evolve with interoperable web technologies.

## Spec
Please refer to the [Spec](./spec.md) documentation for more details on goals, definitions, and implementations in `unified-doc-dom`.

## Packages
The following packages are managed under the `unified-doc-dom` project.

### API
Unified DOM methods
- [`unified-doc-dom`][unified-doc-dom]

### Parsers
DOM-baesd parsers that parse source content into [hast][] trees.
- [`unified-doc-dom-parse-pdfjs`][unified-doc-dom-parse-pdfjs] (in development)


## Development
This project is:
- implemented with the `unified-doc` interface.
- linted with `xo` + `prettier` + `tsc`.
- developed and built with `microbundle`.
- tested with `jest`.
- softly-typed with `typescript` with `checkJs` (only public APIs are typed).
- managed with `lerna`

Monorepo scripts:
```sh
# install dependencies and bootstrap with lerna
npm run bootstrap

# build all packages with microbundle
npm run build

# clean all packages (rm dist + node_modules)
npm run clean

# watch/rebuild all packages with microbundle
npm run dev

# lint all packages with xo + prettier + tsc
npm run lint

# test all packages with jest in --watch mode (make sure to run the 'dev' script)
npm run test

# test all packages in a single run
npm run test:run

# publish all packages with lerna
npm run publish
```

<!-- Definitions -->
[hast]: https://github.com/syntax-tree/hast
[unified-doc]: https://github.com/unified-doc/unified-doc
[unified-doc-dom]: https://github.com/unified-doc/unified-doc-dom/tree/main/packages/unified-doc-dom
[unified-doc-dom-parse-pdfjs]: https://github.com/unified-doc/unified-doc-dom/tree/main/packages/unified-doc-dom-parse-pdfjs
