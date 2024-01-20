// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssMediaMinmax = require('postcss-media-minmax');
const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCsso = require('postcss-csso');

const esbuild = require('esbuild');

const filters = require('./scripts/filters.js');
const maskbloc = require('./scripts/maskbloc.js');

module.exports = (config) => {
  config.addNunjucksGlobal("keywords", maskbloc.makeKeywords);

  // === Filters ===============================================================
  config.addFilter("divisionname", filters.getDivisionName);
  config.addFilter("bloclang", filters.getBlocLanguage);
  config.addFilter("icon", filters.getIcon);
  config.addFilter("inspect", filters.inspect);

    // === Templates ===========================================================
  config.addTemplateFormats('css');
  config.addTemplateFormats('js');

  config.addExtension('css', {
    outputFileExtension: 'css',
    compile: async (content, path) => {
      if (path !== './src/assets/styles/index.css') {
        return;
      }

      return async () => {
        let output = await postcss([
          postcssImport,
          postcssMediaMinmax,
          postcssCustomMedia,
          autoprefixer,
          postcssCsso,
        ]).process(content, {
          from: path,
        });

        return output.css;
      }
    }
  });

  config.addExtension('js', {
    outputFileExtension: 'js',
    compile: async (content, path) => {
      return async () => {
        if (path !== './src/assets/scripts/index.js') {
          return;
        }

        let output = await esbuild.build({
          target: 'es2020',
          entryPoints: [path],
          minify: true,
          bundle: true,
          sourcemap: process.env.ELEVENTY_ENV !== "production",
          write: false,
        });

        return output.outputFiles[0].text;
      }
    }
  });

  // === Copy ==================================================================
  ["src/assets", "src/robots.txt"].forEach(path => {
    config.addPassthroughCopy(path, {
        filter: path => !path.endsWith('.css') && !path.startsWith('_')
    })
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts",
      data: "_data"
    },
  };
};
