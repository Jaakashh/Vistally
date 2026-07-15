/**
 * Disables a button and replaces its content with a loading spinner.
 * @param {HTMLButtonElement} button The button element to update.
 */
function setButtonLoadingState(button) {
  if (!button) return;
  button.disabled = true;
  button.dataset.originalHtml = button.innerHTML;
  button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
}

/**
 * Restores a button to its original state after a loading operation.
 * @param {HTMLButtonElement} button The button element to restore.
 */
function revertButtonLoadingState(button) {
  if (!button || !button.dataset.originalHtml) return;
  button.disabled = false;
  button.innerHTML = button.dataset.originalHtml;
}

/**
 * Applies the user's preferred color theme (light/dark) by setting the data-bs-theme attribute.
 */
function applyTheme() {
  const isDarkMode = localStorage.getItem('vistallyDarkMode') === 'true';
  document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');

  // If the expense chart exists, re-render it to apply theme colors
  // This check ensures we only try to render it if it's on the current page (Dashboard)
  if (typeof renderExpenseChart === 'function' && document.getElementById('expenseChart')) {
    renderExpenseChart();
  }
}