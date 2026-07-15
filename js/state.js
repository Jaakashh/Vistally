const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const STATUSES = ["Planned","Pending","Completed","Cancelled"];

let appState = {
  visitTypes: [],
  visitPurposes: [],
  expenseTypes: [],
  visits: [],
  expenses: [],
  profile: { full_name: "", mobile_no: "" },
  dashboardMonth: new Date().getMonth(),
  dashboardYear: new Date().getFullYear(),
  dashboardSearchTerm: "",
  allVisitsSearchTerm: "",
  allVisitsSortBy: "plan_date",
  allVisitsSortDir: "desc",
  allVisitsCurrentPage: 1,
  allVisitsItemsPerPage: 5,
  reportFromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
  reportToDate: new Date().toISOString().slice(0, 10),
  reportTab: "visit",
  undoTimeout: 7000 // Default value in ms
};

function parseLocalDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}
async function loadAppState() {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("User not found");

    const [
      { data: visitTypes },
      { data: visitPurposes },
      { data: expenseTypes },
      { data: visits },
      { data: expenses },
      { data: profile }
    ] = await Promise.all([
      supabaseClient.from('visit_types').select('*'),
      supabaseClient.from('visit_purposes').select('*'),
      supabaseClient.from('expense_types').select('*'),
      supabaseClient.from('visits').select('*'),
      supabaseClient.from('expenses').select('*'),
      supabaseClient.from('profiles').select('*').eq('id', user.id).single()
    ]);

    appState.visitTypes = visitTypes || [];
    appState.visitPurposes = visitPurposes || [];
    appState.expenseTypes = expenseTypes || [];
    appState.visits = visits || [];
    appState.expenses = expenses || [];
    // Ensure profile exists and includes the user's email
    appState.profile = profile || { full_name: "", mobile_no: "", email: user.email };
    if (!appState.profile.email) appState.profile.email = user.email;

    // Load undo timeout from localStorage
    const savedUndoTimeout = localStorage.getItem('vistallyUndoTimeout');
    if (savedUndoTimeout && !isNaN(parseInt(savedUndoTimeout, 10))) {
      appState.undoTimeout = parseInt(savedUndoTimeout, 10);
    }

  } catch (error) {
    console.error("Failed to load application state:", error);
    showToast("Failed to load application data. Please refresh the page.", "error");
  }
}

function lookupMasterName(list, id) {
  const item = list.find(i => i.id === id);
  return item ? item.name : "";
}

function formatDisplayDate(isoString) {
  if (!isoString) return "—";
  const dateObj = parseLocalDate(isoString);
  if (!dateObj || isNaN(dateObj.getTime())) return "—";
  return dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function calculateVisitExpenseTotal(visitId) {
  return appState.expenses
    .filter(e => e.visit_id === visitId)
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
}

function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str).replace(/[&<>"']/g, function (match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match];
  });
}