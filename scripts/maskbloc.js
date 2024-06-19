// Copyright © 2024 MaskBloc.org <contact@maskbloc.org>
// Licensed under the terms of the GPL-3 license.

const json5 = require('json5');
const fs = require('fs-extra');
const filters = require('./filters.js');

const world = json5.parse(fs.readFileSync('./src/_data/world.json'));
const blocs = json5.parse(fs.readFileSync('./src/_data/blocs.json'));

module.exports = {
  makeKeywords: function() {
    let keywordMap = {};

    for (const [regionID, region] of Object.entries(world.regions)) {
      const regionKeyword = region.keywords ?? [];

      for (const blocID of region.blocs) {
        const bloc = blocs[blocID]
        const blocKeywords = bloc.keywords ?? [];
        const blocTags = (bloc.tags ?? []).map(filters.getTagKeywords);

        const compoundID = `${regionID}-${blocID}`;

        const allKeywords = regionKeyword
          .concat(blocKeywords)
          .concat(blocTags)
          .concat([regionID, blocID]);

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
  },
}
