// Copyright © 2024 MaskBloc.org <contact@maskbloc.org>
// Licensed under the terms of the GPL-3 license.

// //// Exported Functions ////////////////////////////////////////////////// //

/**
 * Attach an
 *
 * @param {HTMLElement} searchInput The search input element to configure.
 */
const configureThemeToggle = (): void => {
  const themButtonElement = getThemeButtons();

  if (!themButtonElement) {
    return;
  }

  const darkElement = themButtonElement[0];
  const autoElement = themButtonElement[1];
  const lightElement = themButtonElement[2];

  const allButtons = [darkElement, autoElement, lightElement];

  allButtons.forEach(function (element) {
    element.addEventListener('change', function (event) {
      const element = event.target as HTMLInputElement | null;

      if (!element) {
        return;
      }

      const isChecked = element.checked;
      const elementID = element.id;

      allButtons.forEach(function (element) {
        element.removeAttribute('checked');
      });

      element.setAttribute('checked', '');

      if (isChecked) {
        updateTheme(elementID as Theme, getPreferredColorTheme());
      }
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (autoElement.checked || getCurrentTheme() === Theme.Auto) {
      updateTheme(Theme.Auto, getPreferredColorTheme());
    }
  });
};

// //// Private Functions /////////////////////////////////////////////////// //

enum Theme {
  Light = 'theme-light',
  Auto = 'theme-auto',
  Dark = 'theme-dark'
}

const getThemeButtons = (): [HTMLInputElement, HTMLInputElement, HTMLInputElement] | null => {
  const darkElement = document.getElementById(Theme.Dark) as HTMLInputElement | null;
  const autoElement = document.getElementById(Theme.Auto) as HTMLInputElement | null;
  const lightElement = document.getElementById(Theme.Light) as HTMLInputElement | null;

  if (!darkElement || !autoElement || !lightElement) {
    return null;
  }

  return [darkElement, autoElement, lightElement];
};

const getPreferredColorTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return Theme.Dark;
  } else {
    return Theme.Light;
  }
};

const applyCurrentTheme = (): void => {
  const theme = (localStorage.getItem('theme') as Theme) || Theme.Dark;

  if (theme) {
    updateTheme(theme, getPreferredColorTheme());
    updateRadioButtons(theme);
  }
};

const setCurrentTheme = (theme: Theme): void => {
  localStorage.setItem('theme', theme);
};

const getCurrentTheme = (): Theme => {
  return localStorage.getItem('theme') as Theme;
};

const updateRadioButtons = (theme: Theme) => {
  const themButtonElement = getThemeButtons();

  if (!themButtonElement) {
    return;
  }

  const darkElement = themButtonElement[0];
  const autoElement = themButtonElement[1];
  const lightElement = themButtonElement[2];

  [darkElement, autoElement, lightElement].forEach(function (element) {
    element.removeAttribute('checked');
  });

  switch (theme) {
    case Theme.Dark:
      darkElement.setAttribute('checked', '');
      break;
    case Theme.Auto:
      autoElement.setAttribute('checked', '');
      break;
    case Theme.Light:
      lightElement.setAttribute('checked', '');
      break;
    default:
      break;
  }
};

const updateTheme = (theme: Theme, preferredTheme: Theme) => {
  const rootElement = document.documentElement;

  rootElement.classList.add('no-transitions');
  rootElement.classList.remove('dark');
  rootElement.classList.remove('light');

  switch (theme) {
    case Theme.Dark:
      rootElement.classList.add('dark');
      setCurrentTheme(theme);
      break;
    case Theme.Auto:
      if (preferredTheme === Theme.Dark) {
        rootElement.classList.add('dark');
      } else {
        rootElement.classList.add('light');
      }
      setCurrentTheme(theme);
      break;
    case Theme.Light:
      rootElement.classList.add('light');
      setCurrentTheme(theme);
      break;
    default:
      break;
  }

  setTimeout(function () {
    rootElement.classList.remove('no-transitions');
  }, 100);
};

// //// Exports ///////////////////////////////////////////////////////////// //

export { configureThemeToggle, applyCurrentTheme };
