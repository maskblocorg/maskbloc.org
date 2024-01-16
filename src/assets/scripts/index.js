// Copyright © 2024 MaskBloc.org <maskbloc.org@proton.me>
// Licensed under the terms of the GPL-3 license.

/**
 * Filters the list of blocs according to the given search term.
 *
 * Complexity: O(n2)
 * TODO: Use a tree instead?
 *
 * @param {*} searchTerm the search term to use.
 */
var filterBlocs = (searchTerm) => {
  let matchingIds = new Set();
  const searchTerms = searchTerm.trim().split(/\s+/)

  if (searchTerms.length === 1 && searchTerms[0] === "") {
    let listStateElement = document.getElementById("list-state");
    listStateElement.classList.add("hidden");
    listStateElement.setAttribute("aria-hidden", true);
    listStateElement.classList.remove("no-data");
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
  document.querySelectorAll(".mask-bloc").forEach((element) => {
    element.classList.add("hidden");
    element.setAttribute("aria-hidden", true);
  })

  // Show blocs that match the IDs.
  for (const id of matchingIds) {
    let element = document.getElementById(id);
    element.classList.remove("hidden");
    element.removeAttribute("aria-hidden");
  }

  // Hide country containers if they are empty.
  document.querySelectorAll(".country").forEach((element) => {
    const blocs = element.getElementsByClassName("mask-bloc");
    const shouldHide = Array.from(blocs).every((bloc) => {
      return bloc.classList.contains("hidden");
    })

    if (shouldHide) {
      element.classList.add("hidden");
      element.setAttribute("aria-hidden", true);
    } else {
      element.classList.remove("hidden");
      element.removeAttribute("aria-hidden");
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
