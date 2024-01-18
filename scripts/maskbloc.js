// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

module.exports = {
  getKeywords: function(keywords) {
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
  },
}
