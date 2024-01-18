# MaskBloc.org

Source code of [maskbloc.org].

[maskbloc.org]: https://maskbloc.org

## Table of Content

- [Table of Content](#table-of-content)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Background](#background)
  - [Previewing Locally](#previewing-locally)
  - [Adding new Mask Blocs](#adding-new-mask-blocs)
- [License](#license)
  - [Source Code](#source-code)
  - [Iconography](#iconography)
  - [Third-party content](#third-party-content)

# Contributing

## Requirements

- Node.js 14+

## Getting Started

### Background

MaskBloc.org is a static website, built with [Eleventy] and hosted on Github
pages. It's designed to be as barebone and light as possible and strives to
be fully accessible.

[`src/_data/`] stores information about Mask Blocs as JSON files.

[Eleventy]: https://www.11ty.dev/
[`src/_data/`]: src/_data/

### Previewing Locally

1. Clone the project
2. Run `npm install`
3. Run `npx @11ty/eleventy --serve` to start previewing the website locally.

### Adding new Mask Blocs

TBA

## License

### Source Code

MaskBloc.org's source code is licensed under the terms of the
GNU Public License v3.0.

See [LICENSE.GPL-3] for more information.

### Iconography

MaskBloc.org's visual identity (`src/assets/images/mb`), including icons, the mask logos,
and wordmarks are licensed under the terms of the CC-BY-SA-4.0 license, see [LICENSE.CC-BY-SA-4] for more information.

### Third-party content

- Icons from `src/assets/images/vendor` are licensed by third parties.
- Content from `src/_data_` is publicly available and owned by their respective creators.

[LICENSE.GPL-3]: LICENSE.GPL-3
[LICENSE.CC-BY-SA-4]: LICENSE.CC-BY-SA-4
