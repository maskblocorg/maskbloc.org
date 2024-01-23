// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

const inspect = require("util").inspect;
const subdivisions = require('../src/_data/subdivisions.json');

module.exports = {
  getDivisionName: function(division, country_id) {
    return subdivisions[country_id][division];
  },

  getIcon: function(tag) {
    switch (tag) {
      case "getting started":
        return "🚀 ";
      case "new":
        return "✨ ";
      case "charity":
        return "💝 ";
      case "not a mask bloc":
        return "😷 ";
      default: return "";
    }
  },

  getBlocLanguage: function(bloc) {
    if (bloc.lang && bloc.lang != "en") {
      return `lang=\"${bloc.lang}\"`;
    } else {
      return "";
    }
  },

  inspect: function(content) {
    return inspect(content);
  }
}
