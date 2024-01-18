// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssMediaMinmax = require('postcss-media-minmax');
const autoprefixer = require('autoprefixer');
const postcssCustomMedia = require('postcss-custom-media');
const postcssCsso = require('postcss-csso');

const esbuild = require('esbuild');
const inspect = require("util").inspect;

const subdivisions = require('./src/_data/subdivisions.json');

module.exports = (config) => {

  // https://github.com/11ty/eleventy/issues/2512
  // eleventyComputed doesn't work, using filters as a workaround.

  config.addFilter("divisionname", function(division, country_id) {
    return subdivisions[country_id][division];
  });

  config.addFilter("divisionname", function(division, country_id) {
    return subdivisions[country_id][division];
  });

  config.addFilter("inspect", function(content) {
    return inspect(content);
  });

  config.addFilter("bloclang", function(bloc) {
    if (bloc.lang && bloc.lang != "en") {
      return `lang=\"${bloc.lang}\"`;
    } else {
      return "";
    }
  });

  config.addFilter("keywords", function(keywords) {
    let keywordMap = {};

    for (const [key, division] of Object.entries(keywords)) {
      const divisionID = key;
      const divisionKeywords = division.keywords ?? [];

      for (const bloc of division.blocs) {
        const blocKeywords = bloc.keywords ?? [];
        const blocID = bloc.id;

        const compoundID = `${divisionID}-${blocID}`;

        const allKeywords = divisionKeywords.concat(blocKeywords);
        for (const keyword of allKeywords) {
          if (!keywordMap.hasOwnProperty(keyword)) {
            keywordMap[keyword] = new Set();
          }

          keywordMap[keyword].add(compoundID);
        }
      }
    }

    for (const [key, value] of Object.entries(keywordMap)) {
      keywordMap[key] = Array.from(value);
    }

    return JSON.stringify(keywordMap);
  });

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
          bundle: false,
          write: false,
        });

        return output.outputFiles[0].text;
      }
    }
  });

  // passthrough
  ['src/assets'].forEach(path => {
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
