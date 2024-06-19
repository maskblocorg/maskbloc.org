// Copyright © 2024 MaskBloc.org <contact@maskbloc.org>
// Licensed under the terms of the GPL-3 license.

import {
  filterFromQueryParameters,
  filterBlocs,
  configureSearchInputAccessibility
} from './_includes/filtering';

import { configureThemeToggle, applyCurrentTheme } from './_includes/themes';

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    const searchInput = document.getElementById('bloc-filter') as HTMLInputElement | null;

    if (searchInput) {
      configureSearchInputAccessibility(searchInput);
      filterFromQueryParameters(searchInput);

      searchInput.addEventListener('input', function (element: Event) {
        if (element && element.target) {
          const inputNode = element.target as HTMLInputElement;
          filterBlocs(inputNode.value);
        }
      });
    }

    configureThemeToggle();
    applyCurrentTheme();

    setTimeout(function () {
      document.documentElement.classList.remove('no-transitions');
    }, 100);
  }
};
