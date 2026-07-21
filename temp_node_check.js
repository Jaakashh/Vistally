const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync('js/modules.js', 'utf8');
try {
  vm.runInNewContext(code, {
    console,
    appState: {},
    parseLocalDate: () => {},
    lookupMasterName: () => {},
    escapeHtml: () => {},
    renderActiveView: () => {},
    openVisitExpenseDrawer: () => {},
    showToast: () => {},
    confirmationModalBootstrapInstance: null,
    supabaseClient: {
      from: () => ({
        delete: () => ({ eq: () => ({}) }),
        update: () => ({ eq: () => ({ select: () => ({ single: () => ({}) }) }) }),
        insert: () => ({ select: () => ({ single: () => ({}) }) })
      })
    }
  });
  console.log('modules.js syntax OK');
} catch (e) {
  console.error('modules.js syntax error:');
  console.error(e.stack);
}
