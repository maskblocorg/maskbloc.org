// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

// //// Exported Functions ////////////////////////////////////////////////// //

/**
 * Retrieve the query parameter from the URL if it exists, update
 * the given search input element and filter the list of blocs.
 *
 * @param {HTMLElement} searchInput The search input element to update.
 */
const filterFromQueryParameters = (searchInput: HTMLInputElement): void => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (query) {
    searchInput.value = query;
    filterBlocs(query);
  }
};

/**
 * Filters the list of blocs according to the given search term.
 *
 * Complexity: O(n2)
 * TODO: Use a tree instead?
 *
 * @param {string} searchTerm the search term to use.
 */
const filterBlocs = (searchTerm: string): void => {
  if (!MaskBloc) {
    return;
  }

  const matchingIds = new Set<string>();
  const searchTerms = searchTerm.trim().split(/\s+/);

  const columnNodes = document.querySelectorAll('.bloc-column');
  const regionNodes = document.querySelectorAll('.region');
  const maskBlocNodes = document.querySelectorAll('.mask-bloc');

  if (searchTerms.length === 1 && searchTerms[0] === '') {
    const listStateElement = document.getElementById('list-state');

    if (listStateElement) {
      hide(listStateElement);
      listStateElement.classList.remove('no-data');
    }

    maskBlocNodes.forEach((e) => show(e));
    regionNodes.forEach((e) => show(e));
    columnNodes.forEach((e) => show(e));

    return;
  }

  // Build the set of IDs matching the search terms.
  for (const term of searchTerms) {
    for (const [key, value] of Object.entries(MaskBloc.keywords)) {
      if (key.includes(term.toLowerCase())) {
        value.forEach((id: string) => matchingIds.add(id));
      }
    }
  }

  // Select all blocs and hide them.
  maskBlocNodes.forEach((e) => hide(e));
  regionNodes.forEach((e) => hide(e));
  columnNodes.forEach((e) => hide(e));

  // Show blocs that match the IDs.
  for (const id of matchingIds) {
    const element = document.getElementById(id);

    if (element) {
      show(element);
    }
  }

  // Show columns if they have regions visible.
  regionNodes.forEach((element) => {
    const blocs = element.getElementsByClassName('mask-bloc');
    const shouldShow = Array.from(blocs).some((bloc) => {
      return !bloc.classList.contains('hidden');
    });

    if (shouldShow) {
      show(element);
    } else {
      hide(element);
    }
  });

  columnNodes.forEach((element) => {
    const regions = element.getElementsByClassName('region');
    const shouldShow = Array.from(regions).some((region) => {
      return !region.classList.contains('hidden');
    });

    if (shouldShow) {
      show(element);
    } else {
      hide(element);
    }
  });

  // Show empty state if no matches.
  const listStateElement = document.getElementById('list-state');

  if (listStateElement) {
    show(listStateElement);

    if (matchingIds.size > 1) {
      listStateElement.classList.remove('no-data');
      listStateElement.innerHTML = `${matchingIds.size} blocs matching the search terms.`;
    } else if (matchingIds.size == 1) {
      listStateElement.classList.remove('no-data');
      listStateElement.innerHTML = `1 bloc matching the search terms.`;
    } else {
      listStateElement.classList.add('no-data');
      listStateElement.innerHTML = `No blocs matching the search terms.`;
    }
  }
};

/**
 * Attach an
 *
 * @param {HTMLElement} searchInput The search input element to configure.
 */
const configureSearchInputAccessibility = (searchInput: HTMLInputElement): void => {
  const listState = document.getElementById('list-state');

  if (listState) {
    searchInput.addEventListener('keyup', function (e) {
      if (e.key == 'Enter' && searchInput.value.length >= 0) {
        listState.focus();
      }
    });

    listState.addEventListener('keyup', function (e) {
      if (e.key == 'Escape') {
        searchInput.focus();
      }
    });
  }
};

// //// Private Functions /////////////////////////////////////////////////// //

interface KeywordStore {
  keywords: [string: [string]];
}

declare let MaskBloc: KeywordStore;

const show = (element: HTMLElement | Element): void => {
  element.classList.remove('hidden');
  element.removeAttribute('aria-hidden');
};

const hide = (element: HTMLElement | Element): void => {
  element.classList.add('hidden');
  element.setAttribute('aria-hidden', 'true');
};

// //// Exports ///////////////////////////////////////////////////////////// //

export { filterFromQueryParameters, filterBlocs, configureSearchInputAccessibility };
