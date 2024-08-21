// Copyright © 2024 MaskBloc.org <contact@maskbloc.org>
// Licensed under the terms of the GPL-3 license.

const inspect = require("util").inspect;
const subdivisions = require('../src/_data/subdivisions.json');

function getDivisionName (division, countryID) {
  return subdivisions[countryID][division];
}

module.exports = {
  getDivisionName: getDivisionName,

  getBlocTitleAriaLabel: function (bloc, countryID) {
    // {% set aria_bloc_title = [subdivision_name, ": ", bloc.name] | join %}
    const title = bloc.name;

    if (bloc.subdivisions && Array.isArray(bloc.subdivisions) && bloc.subdivisions.length > 0) {
      const subdivisionNames = bloc.subdivisions.map((division) => {
        getDivisionName(division, countryID);
      });

      return `${subdivisionNames.join(', ')}: ${title}`;
    } else {
      return title;
    }
  },

  getTagIcon: function (tag) {
    switch (tag) {
      case 'upcoming':
        return '🚀 ';
      case 'new':
        return '✨ ';
      case 'charity':
        return '💝 ';
      case 'advocacy-group':
        return '📢 ';
      case 'clean-air-club':
        return '☁️ ';
      case 'mask-bank':
        return '😷 ';
      case 'covid-safe-campus':
        return '🎓 ';
      case 'care-collective':
        return '💞 ';
      case 'inactive':
        return '💤 ';
      default:
        return '';
    }
  },

  getTagLabel: function (tag) {
    switch (tag) {
      case 'upcoming':
        return 'Getting started';
      case 'new':
        return 'New';
      case 'charity':
        return 'Charity';
      case 'advocacy-group':
        return 'Advocacy Group';
      case 'clean-air-club':
        return 'Clean Air Club';
      case 'mask-bank':
        return 'Mask Bank';
      case 'covid-safe-campus':
        return 'COVID Safe Campus';
      case 'care-collective':
        return 'Care Collective';
      case 'inactive':
        return 'Inactive';
      default:
        return '';
    }
  },

  getTagKeywords: function (tag) {
    switch (tag) {
      case 'upcoming':
        return ['upcoming', 'getting', 'started'];
      case 'new':
        return ['new'];
      case 'charity':
        return ['charity'];
      case 'advocacy-group':
        return ['advocacy', 'group'];
      case 'clean-air-club':
        return ['clean', 'air', 'club'];
      case 'mask-bank':
        return ['bank'];
      case 'covid-safe-campus':
        return ['safe', 'campus'];
      case 'care-collective':
        return ['care', 'collective'];
      default:
        return '';
    }
  },

  getBlocLanguage: function (bloc) {
    if (bloc.lang && bloc.lang != 'en') {
      return `lang="${bloc.lang}"`;
    } else {
      return '';
    }
  },

  inspect: function (content) {
    return inspect(content);
  },

  log: function (content) {
    return console.log(content);
  }
};
