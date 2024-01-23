// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

/**
 * Retrieve the query parameter from the URL if it exists, update
 * the given search input element and filter the list of blocs.
 *
 * @param {HTMLElement} searchInput The search input element to update.
 */
const filterFromQueryParameters = (searchInput) => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  if (params.q) {
    searchInput.value = params.q;
    filterBlocs(params.q);
  }
}

/**
 * Filters the list of blocs according to the given search term.
 *
 * Complexity: O(n2)
 * TODO: Use a tree instead?
 *
 * @param {string} searchTerm the search term to use.
 */
const filterBlocs = (searchTerm) => {
  let matchingIds = new Set();
  const searchTerms = searchTerm.trim().split(/\s+/)

  let columnNodes = document.querySelectorAll(".bloc-column");
  let regionNodes = document.querySelectorAll(".region");
  let maskBlocNodes = document.querySelectorAll(".mask-bloc")

  if (searchTerms.length === 1 && searchTerms[0] === "") {
    let listStateElement = document.getElementById("list-state");
    listStateElement.classList.add("hidden");
    listStateElement.setAttribute("aria-hidden", true);
    listStateElement.classList.remove("no-data");

    maskBlocNodes.forEach((element) => {
      element.classList.remove("hidden");
      element.removeAttribute("aria-hidden");
    })

    regionNodes.forEach((element) => {
      element.classList.remove("hidden");
      element.removeAttribute("aria-hidden");
    })

    columnNodes.forEach((element) => {
      element.classList.remove("hidden");
      element.removeAttribute("aria-hidden");
    })

    return
  }

  // Build the set of IDs matching the search terms.
  for (const term of searchTerms) {
    for (const [key, value] of Object.entries(MaskBloc.keywords)) {
        if (key.includes(term.toLowerCase())) {
          value.forEach((id) => matchingIds.add(id));
        }
    }
  }

  // Select all blocs and hide them.
  maskBlocNodes.forEach((element) => {
    element.classList.add("hidden");
    element.setAttribute("aria-hidden", true);
  })

  regionNodes.forEach((element) => {
    element.classList.add("hidden");
    element.setAttribute("aria-hidden", true);
  })

  columnNodes.forEach((element) => {
    element.classList.add("hidden");
    element.setAttribute("aria-hidden", true);
  })

  // Show blocs that match the IDs.
  for (const id of matchingIds) {
    let element = document.getElementById(id);
    element.classList.remove("hidden");
    element.removeAttribute("aria-hidden");
  }

  // Show columns if they have regions visible.
  regionNodes.forEach((element) => {
    const blocs = element.getElementsByClassName("mask-bloc");
    const shouldShow = Array.from(blocs).some((bloc) => {
      return !bloc.classList.contains("hidden");
    })

    if (shouldShow) {
      element.classList.remove("hidden");
      element.removeAttribute("aria-hidden");
    } else {
      element.classList.add("hidden");
      element.setAttribute("aria-hidden", true);
    }
  });

  columnNodes.forEach((element) => {
    const regions = element.getElementsByClassName("region");
    const shouldShow = Array.from(regions).some((region) => {
      return !region.classList.contains("hidden");
    })

    if (shouldShow) {
      element.classList.remove("hidden");
      element.removeAttribute("aria-hidden");
    } else {
      element.classList.add("hidden");
      element.setAttribute("aria-hidden", true);
    }
  });

  // Show empty state if no matches.
  let listStateElement = document.getElementById("list-state");
  listStateElement.classList.remove("hidden");
  listStateElement.removeAttribute("aria-hidden");

  if (matchingIds.size > 1) {
    listStateElement.classList.remove("no-data");
    listStateElement.innerHTML = `${matchingIds.size} blocs matching the search terms.`
  } else if (matchingIds.size == 1) {
    listStateElement.classList.remove("no-data");
    listStateElement.innerHTML = `1 bloc matching the search terms.`
  } else {
    listStateElement.classList.add("no-data");
    listStateElement.innerHTML = `No blocs matching the search terms.`
  }
}

/**
 * Attach an
 *
 * @param {HTMLElement} searchInput The search input element to configure.
 */
const configureSearchInputAccessibility = (searchInput) => {
  const listState = document.getElementById('list-state');

  searchInput.addEventListener('keyup', function ( e ) {
    if (e.key == 'Enter' && searchInput.value.length >= 0) {
      listState.focus();
    }
  });

  listState.addEventListener('keyup', function ( e ) {
    if ( e.key == "Escape" ) {
      searchInput.focus();
    }
  });
}

/**
 * Attach an
 *
 * @param {HTMLElement} searchInput The search input element to configure.
 */
const configureThemeToggle = () => {
  const darkElement = document.getElementById('theme-dark');
  const autoElement = document.getElementById('theme-auto');
  const lightElement = document.getElementById('theme-light');

  const allElements = [darkElement, autoElement, lightElement];

  [darkElement, autoElement, lightElement].forEach(function(element) {
    element.addEventListener('change', function(event) {
      const element = event.target;
      const isChecked = element.checked;
      const elementID = element.id;

      allElements.forEach(function(element) {
        element.removeAttribute("checked");
      });

      element.setAttribute("checked", "");

      if (isChecked) {
        updateTheme(elementID, getPreferredColorTheme());
      }
    });
  });

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', function() {
      if (autoElement.checked || localStorage.getItem("theme") === 'theme-auto') {
        updateTheme('theme-auto', getPreferredColorTheme());
      }
    });
}

const getPreferredColorTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "theme-dark";
  } else {
    return "theme-light";
  }
}

const setCurrentTheme = () => {
  const theme = localStorage.getItem("theme");

  if (theme) {
    updateTheme(theme, getPreferredColorTheme());
    console.log(theme);
    updateRadioButtons(theme);
  }
}

const updateRadioButtons = (theme) => {
  const darkElement = document.getElementById('theme-dark');
  const autoElement = document.getElementById('theme-auto');
  const lightElement = document.getElementById('theme-light');

  const allElements = [darkElement, autoElement, lightElement];

  allElements.forEach(function(element) {
    element.removeAttribute("checked");
  });

  switch (theme) {
    case 'theme-dark':
      darkElement.setAttribute("checked", "");
      break;
    case 'theme-auto':
      autoElement.setAttribute("checked", "");
      break;
    case 'theme-light':
      lightElement.setAttribute("checked", "");
      break;
    default: break;
  }
}

const updateTheme = (theme, preferredTheme) => {
  let rootNodes = document.querySelectorAll(":root");

  rootNodes.forEach((e) => e.classList.remove("dark"));
  rootNodes.forEach((e) => e.classList.remove("light"));

  switch (theme) {
    case 'theme-dark':
      rootNodes.forEach((e) => e.classList.add("dark"));
      localStorage.setItem("theme", theme);
      break;
    case 'theme-auto':
      if (preferredTheme === "theme-dark") {
        rootNodes.forEach((e) => e.classList.add("dark"));
      } else {
        rootNodes.forEach((e) => e.classList.add("light"));
      }
      localStorage.setItem("theme", theme);
      break;
    case 'theme-light':
      rootNodes.forEach((e) => e.classList.add("light"));
      localStorage.setItem("theme", theme);
      break;
    default: break;
  }
}

export {
  filterFromQueryParameters,
  filterBlocs,
  configureSearchInputAccessibility,
  configureThemeToggle,
  setCurrentTheme
}
