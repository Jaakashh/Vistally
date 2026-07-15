let currentPage = "dashboard";

function navigateToPage(pageId) {
  currentPage = pageId;
  document.querySelectorAll(".nav-item").forEach(node => {
    node.classList.toggle("active", node.dataset.page === pageId);
  });
  renderActiveView();
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function renderActiveView() {
  const root = document.getElementById("page-root");
  if (currentPage === "dashboard") {
    root.innerHTML = renderDashboardView();
    renderCalendarGrid();
    renderExpenseChart();
  } else if (currentPage === "visits") {
    root.innerHTML = renderVisitsView();
  } else if (currentPage === "reports") {
    root.innerHTML = renderReportsView();
  } else if (currentPage === "visitType") { // Corresponds to appState.visitTypes
    root.innerHTML = renderMasterGridView("visit_types", "Visit Type Master", "Categorize how you engage with a client — e.g., cold calls, system maintenance, executive briefings.");
  } else if (currentPage === "visitPurpose") { // Corresponds to appState.visitPurposes
    root.innerHTML = renderMasterGridView("visit_purposes", "Visit Purpose", "Track business-driven motives — e.g., hardware delivery, contract review, dispute resolution.");
  } else if (currentPage === "expenseType") { // Corresponds to appState.expenseTypes
    root.innerHTML = renderMasterGridView("expense_types", "Expense Type", "Financial wrappers used to bucket ledger itemizations incurred during transit.");
  } else if (currentPage === "settings") {
    root.innerHTML = renderSettingsView();
  }
}

/**
 * Checks if a realtime data change is relevant to the currently displayed view.
 * @param {string} tableName The name of the table that changed.
 * @returns {boolean} True if the change is relevant, otherwise false.
 */
function isChangeRelevantToCurrentView(tableName) {
  // Always re-render if the dashboard is active, as it shows data from multiple tables.
  if (currentPage === 'dashboard') return true;

  // If on the reports page, re-render for changes to visits or expenses.
  if (currentPage === 'reports' && (tableName === 'visits' || tableName === 'expenses')) return true;

  // If on the main visits list, re-render for changes to visits.
  if (currentPage === 'visits' && tableName === 'visits') return true;

  // For master grid pages, check if the table name matches the current page.
  const pageToTableMap = {
    'visitType': 'visit_types',
    'visitPurpose': 'visit_purposes',
    'expenseType': 'expense_types'
  };
  if (pageToTableMap[currentPage] === tableName) return true;

  return false; // By default, the change is not relevant.
}

function handleRealtimeChange(payload, tableName) {
  console.log(`Realtime event on [${tableName}]:`, payload);
  const { eventType, new: newRecord, old: oldRecord } = payload;

  // Convert snake_case table name to camelCase appState key
  // e.g., 'visit_purposes' -> 'visitPurposes'
  const tableKey = tableName.replace(/_(\w)/g, (_, p1) => p1.toUpperCase());

  if (!appState[tableKey]) return; // Safety check
  
  switch (eventType) {
    case 'INSERT':
      // Add the new record to our local state
      appState[tableKey].push(newRecord);
      break;
    case 'UPDATE':
      // Find and update the record in our local state
      const indexToUpdate = appState[tableKey].findIndex(item => item.id === newRecord.id);
      if (indexToUpdate !== -1) {
        appState[tableKey][indexToUpdate] = newRecord;
      }
      break;
    case 'DELETE':
      // Remove the old record from our local state
      appState[tableKey] = appState[tableKey].filter(item => item.id !== oldRecord.id);
      break;
    default:
      // Do nothing for other event types
      break;
  }
  // Re-render the view only if the change is relevant to what's being shown.
  if (isChangeRelevantToCurrentView(tableName)) {
    renderActiveView();
  }
}

function initializeRealtimeSubscriptions() {
  const channel = supabaseClient.channel('public-changes');

  const tablesToWatch = ['visits', 'expenses', 'visit_types', 'visit_purposes', 'expense_types'];

  tablesToWatch.forEach(tableName => {
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: tableName
    }, (payload) => {
      handleRealtimeChange(payload, tableName);
    });
  });

  channel.subscribe();
}

// App Initialization
(async function initializeApplication() {
  // Apply the theme as the very first step to avoid a flash of the wrong theme.
  applyTheme();

  const { data: { session } } = await supabaseClient.auth.getSession();

  if (!session) {
    // If no user is logged in, redirect to the login page
    window.location.href = 'Login.html';
    return; // Stop the rest of the initialization
  }

  // If we have a session, proceed with loading the app
  document.getElementById("modals-container").innerHTML = injectAllModalsMarkup();
  document.getElementById("page-root").innerHTML = `<div class="empty-state"><i class="bi bi-hourglass-split"></i>Initializing local sandboxes...</div>`;
  await loadAppState();
  renderActiveView();
  initializeRealtimeSubscriptions(); // Start listening for real-time changes
})();