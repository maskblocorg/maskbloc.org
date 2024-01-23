// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

import {
  filterFromQueryParameters,
  filterBlocs,
  configureSearchInputAccessibility,
  configureThemeToggle,
  setCurrentTheme
} from './_includes/functions';

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    const searchInput = document.getElementById('bloc-filter');

    configureSearchInputAccessibility(searchInput)
    filterFromQueryParameters(searchInput)

    searchInput.addEventListener("input", function(element) {
      filterBlocs(element.target.value);
    })

    configureThemeToggle();
    setCurrentTheme();
  }
}
