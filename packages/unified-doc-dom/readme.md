# unified-doc-dom

DOM APIs for [**unified-doc**][unified-doc].

## Contents
- [Intro](#intro)
- [Spec](#spec)
- [Packages](#packages)
- [Development](#development)


## Intro
`unified-doc` simplifies working with different document formats with a unified set of document APIs.  The `unified-doc-dom` project provides API extensions that are DOM-specific and help enrich rendering and interacting with documents rendererd to the web.

With `unified-doc-dom`, we can easily
- visually highlight active annotation nodes.
- attach click and hover events to annotated document.
- capture selected text events as annotations compatible with `unified-doc`.
- save and export file formats compatible with `unified-doc`.

## Packages
The following packages are managed under the `unified-doc-dom` project.

### API
Core DOM APIs for working with documents.

## Development
This project is:
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

# link all packages with lerna
npm run link

# lint all packages with xo + prettier + tsc
npm run lint

# test all packages with jest in --watch mode (make sure to run the 'dev' script)
npm run test

# test all packages in a single run
npm run test:run

# publish all packages with lerna
npm run publish
```

<!-- Links -->
[unified-doc]: https://github.com/unified-doc/unified-doc
