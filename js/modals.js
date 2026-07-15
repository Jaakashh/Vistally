function injectAllModalsMarkup() {
  return `
    <!-- Plan Visit Modal -->
    <div class="modal fade" id="visitConfigurationModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="visitConfigurationModalTitle">Plan a Visit</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="visitConfigurationForm" novalidate>
              <input type="hidden" id="formVisitIdField">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Client Name</label>
                  <input type="text" class="form-control" id="formClientNameField" required placeholder="e.g. Akash Prajapati">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Company Name</label>
                  <input type="text" class="form-control" id="formCompanyNameField" required placeholder="e.g. Santa Softech">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Mobile No</label>
                  <input type="text" class="form-control" id="formMobileNoField" required placeholder="e.g. 757508XXXX">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Date of Planning</label>
                  <input type="date" class="form-control" id="formPlanDateField" required placeholder="e.g. Raj Mehta">
                </div>
                <div class="col-md-3">
                  <label class="form-label">Estimated Time Window</label>
                  <input type="time" class="form-control" id="formPlanTimeField">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Visit Purpose</label>
                  <select class="form-select" id="formVisitPurposeSelect" required></select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Visit Type</label>
                  <select class="form-select" id="formVisitTypeSelect" required></select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Status</label>
                  <select class="form-select" id="formVisitStatusSelect" required></select>
                </div>
                <div class="col-md-12">
                  <label class="form-label">Supplemental Operational Briefings / Strategic Field Notes</label>
                  <textarea class="form-control" id="formNotesField" rows="3" placeholder="Anything worth remembering before the visit..."></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-amber" onclick="executeVisitFormSaveWorkflow(this)">Save Visit</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Expense Mapping Modal -->
    <div class="modal fade" id="expenseMappingModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Expanse Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="expenseMappingForm" novalidate>
              <input type="hidden" id="formExpenseTargetVisitId">
              <div class="mb-3">
                <label class="form-label">Financial Ledger Categorization Bucket</label>
                <select class="form-select" id="formExpenseTypeSelect" required></select>
              </div>
              <div class="mb-3">
                <label class="form-label">Amount (INR)</label>
                <div class="input-group">
                  <span class="input-group-text" style="background: var(--surface-2); border-color: var(--line); color: var(--muted);">₹</span>
                  <input type="number" class="form-control" id="formExpenseAmountField" min="0" step="0.01" required placeholder="0.00">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Transaction Date</label>
                <input type="date" class="form-control" id="formExpenseDateField" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-amber" onclick="executeExpenseSaveWorkflow(this)">Save Expense</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Master Config Modal -->
    <div class="modal fade" id="masterStructuralAdjustmentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="masterStructuralAdjustmentModalTitle">Configure Taxonomy Vector</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="masterStructuralAdjustmentForm" novalidate>
              <input type="hidden" id="formMasterTargetObjectKey">
              <input type="hidden" id="formMasterTargetRecordId">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" id="formMasterNameField" required placeholder="">
              </div>
              <div class="mb-3">
                <label class="form-label">Description (optional)</label>
                <textarea class="form-control" id="formMasterDescriptionField" rows="2" placeholder="Short Note"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-amber" onclick="executeMasterRowSaveWorkflow(this)">Save</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Confirmation Modal -->
    <div class="modal fade" id="confirmationModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmationModalTitle">Confirm Action</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="confirmationModalBody">
            Are you sure you want to proceed? This action cannot be undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmationModalConfirmButton">Confirm</button>
          </div>
        </div>
      </div>
    </div>`;
}

let visitConfigModalBootstrapInstance = null;
let expenseModalBootstrapInstance = null;
let masterModalBootstrapInstance = null;
let confirmationModalBootstrapInstance = null;

function populateSelectorDropdown(elementId, itemsList, selectedIdValue = "") {
  const selectNode = document.getElementById(elementId);
  if (!selectNode) return;
  let optionsMarkup = `<option value="" disabled ${!selectedIdValue ? "selected" : ""}>Select</option>`;
  itemsList.forEach(item => {
    optionsMarkup += `<option value="${item.id}" ${item.id === selectedIdValue ? "selected" : ""}>${escapeHtml(item.name)}</option>`;
  });
  selectNode.innerHTML = optionsMarkup;
}

function openVisitModal(visitId = null, defaultCalendarDateString = null) {
  populateSelectorDropdown("formVisitPurposeSelect", appState.visitPurposes);
  populateSelectorDropdown("formVisitTypeSelect", appState.visitTypes);

  let statusDropdownOptions = STATUSES.map(st => `<option value="${st}">${st}</option>`).join("");
  document.getElementById("formVisitStatusSelect").innerHTML = statusDropdownOptions;

  if (visitId) {
    document.getElementById("visitConfigurationModalTitle").textContent = "Edit Visit";
    const existingVisitRef = appState.visits.find(v => v.id === visitId);
    if (existingVisitRef) {
      document.getElementById("formVisitIdField").value = existingVisitRef.id;
      document.getElementById("formClientNameField").value = existingVisitRef.client_name;
      document.getElementById("formCompanyNameField").value = existingVisitRef.company_name;
      document.getElementById("formMobileNoField").value = existingVisitRef.mobile_no || "";
      document.getElementById("formPlanDateField").value = existingVisitRef.plan_date;
      document.getElementById("formPlanTimeField").value = existingVisitRef.plan_time || "";
      document.getElementById("formNotesField").value = existingVisitRef.notes || "";
      document.getElementById("formVisitStatusSelect").value = existingVisitRef.status;

      populateSelectorDropdown("formVisitPurposeSelect", appState.visitPurposes, existingVisitRef.visit_purpose_id);
      populateSelectorDropdown("formVisitTypeSelect", appState.visitTypes, existingVisitRef.visit_type_id);
    }
  } else {
    document.getElementById("visitConfigurationModalTitle").textContent = "Plan a Visit";
    document.getElementById("formVisitIdField").value = "";
    document.getElementById("visitConfigurationForm").reset();
    document.getElementById("formPlanDateField").value = defaultCalendarDateString || new Date().toISOString().slice(0, 10);
    document.getElementById("formVisitStatusSelect").value = "Planned";
  }

  visitConfigModalBootstrapInstance = visitConfigModalBootstrapInstance || new bootstrap.Modal(document.getElementById("visitConfigurationModal"));
  visitConfigModalBootstrapInstance.show();
}

async function executeVisitFormSaveWorkflow(button) {
  const targetFormNode = document.getElementById("visitConfigurationForm");
  if (!targetFormNode.checkValidity()) {
    targetFormNode.classList.add("was-validated");
    targetFormNode.reportValidity();
    return;
  }

  setButtonLoadingState(button);
  
  const { data: { user } } = await supabaseClient.auth.getUser();
  const hiddenId = document.getElementById("formVisitIdField").value;
  const visitPayload = {
    client_name: document.getElementById("formClientNameField").value.trim(),
    company_name: document.getElementById("formCompanyNameField").value.trim(),
    mobile_no: document.getElementById("formMobileNoField").value.trim(),
    plan_date: document.getElementById("formPlanDateField").value,
    plan_time: document.getElementById("formPlanTimeField").value || null,
    visit_purpose_id: document.getElementById("formVisitPurposeSelect").value || null,
    visit_type_id: document.getElementById("formVisitTypeSelect").value || null,
    status: document.getElementById("formVisitStatusSelect").value,
    notes: document.getElementById("formNotesField").value.trim()
  };

  if (hiddenId) {
    const { error } = await supabaseClient.from('visits').update(visitPayload).eq('id', hiddenId);
    if (error) {
      showToast(`Error updating visit: ${error.message}`, 'error');
      revertButtonLoadingState(button);
      return;
    }
    showToast("Visit updated successfully!", "success");
  } else {
    const { error } = await supabaseClient.from('visits').insert([{ ...visitPayload, user_id: user.id }]);
    if (error) {
      showToast(`Error creating visit: ${error.message}`, 'error');
      revertButtonLoadingState(button);
      return;
    }
    showToast("Visit created successfully!", "success");
  }

  revertButtonLoadingState(button);
  visitConfigModalBootstrapInstance.hide();
  
  const drawerElement = document.getElementById("sideDrawer");
  if (drawerElement && drawerElement.classList.contains("open")) {
    openDayDrawer(visitPayload.plan_date);
  }
}

function openExpenseModal(visitId) {
  const formNode = document.getElementById("expenseMappingForm");
  formNode.reset();
  formNode.classList.remove("was-validated");

  document.getElementById("formExpenseTargetVisitId").value = visitId;
  document.getElementById("formExpenseDateField").value = new Date().toISOString().slice(0, 10);

  populateSelectorDropdown("formExpenseTypeSelect", appState.expenseTypes);

  expenseModalBootstrapInstance = expenseModalBootstrapInstance || new bootstrap.Modal(document.getElementById("expenseMappingModal"));
  expenseModalBootstrapInstance.show();
}

async function executeExpenseSaveWorkflow(button) {
  const validationFormRef = document.getElementById("expenseMappingForm");
  if (!validationFormRef.checkValidity()) {
    validationFormRef.classList.add("was-validated");
    validationFormRef.reportValidity();
    return;
  }

  setButtonLoadingState(button);
  
  const { data: { user } } = await supabaseClient.auth.getUser();
  const expVisitId = document.getElementById("formExpenseTargetVisitId").value;
  const newExpenseNode = {
    user_id: user.id,
    visit_id: expVisitId,
    expense_type_id: document.getElementById("formExpenseTypeSelect").value || null,
    amount: Number(document.getElementById("formExpenseAmountField").value),
    date: document.getElementById("formExpenseDateField").value
  };

  const { error } = await supabaseClient.from('expenses').insert([newExpenseNode]);
  if (error) {
    showToast(`Error saving expense: ${error.message}`, 'error');
    revertButtonLoadingState(button);
    return
  }
  showToast("Expense saved successfully!", "success");

  expenseModalBootstrapInstance.hide();
  revertButtonLoadingState(button);
  
  const drawerElement = document.getElementById("sideDrawer");
  if (drawerElement && drawerElement.classList.contains("open")) {
    openVisitExpenseDrawer(expVisitId);
  }
}

function openMasterFormModal(stateCollectionKey, existingRecordId = null) {
  const masterFormNode = document.getElementById("masterStructuralAdjustmentForm");
  masterFormNode.reset();
  masterFormNode.classList.remove("was-validated");

  const appStateKey = stateCollectionKey.replace(/_(\w)/g, (match, p1) => p1.toUpperCase());
  document.getElementById("formMasterTargetObjectKey").value = stateCollectionKey;
  document.getElementById("formMasterTargetRecordId").value = existingRecordId || "";

  if (existingRecordId) {
    document.getElementById("masterStructuralAdjustmentModalTitle").textContent = "Refine Architectural Vector Definition";
    const lookupRowRef = appState[appStateKey].find(item => item.id === existingRecordId);
    if (lookupRowRef) {
      document.getElementById("formMasterNameField").value = lookupRowRef.name;
      document.getElementById("formMasterDescriptionField").value = lookupRowRef.description || "";
    }
  } else {
    document.getElementById("masterStructuralAdjustmentModalTitle").textContent = "Add Item";
  }

  masterModalBootstrapInstance = masterModalBootstrapInstance || new bootstrap.Modal(document.getElementById("masterStructuralAdjustmentModal"));
  masterModalBootstrapInstance.show();
}

async function executeMasterRowSaveWorkflow(button) {
  const formValidationRef = document.getElementById("masterStructuralAdjustmentForm");
  if (!formValidationRef.checkValidity()) {
    formValidationRef.classList.add("was-validated");
    formValidationRef.reportValidity();
    return;
  }

  setButtonLoadingState(button);
  
  const { data: { user } } = await supabaseClient.auth.getUser();
  const targetKey = document.getElementById("formMasterTargetObjectKey").value;
  const targetId = document.getElementById("formMasterTargetRecordId").value;
  const payload = {
    name: document.getElementById("formMasterNameField").value.trim(),
    description: document.getElementById("formMasterDescriptionField").value.trim()
  };

  if (targetId) {
    const { error } = await supabaseClient.from(targetKey).update(payload).eq('id', targetId);
    if (error) {
      showToast(`Error updating item: ${error.message}`, 'error');
      revertButtonLoadingState(button);
      return;
    }
    showToast("Item updated successfully!", "success");
  } else {
    const { error } = await supabaseClient.from(targetKey).insert([{ ...payload, user_id: user.id }]);
    if (error) {
      showToast(`Error creating item: ${error.message}`, 'error');
      revertButtonLoadingState(button);
      return;
    }
    showToast("Item created successfully!", "success");
  }

  revertButtonLoadingState(button);
  masterModalBootstrapInstance.hide();
}

/**
 * Opens a generic confirmation modal.
 * @param {string} title The title for the modal header.
 * @param {string} body The message to display in the modal body.
 * @param {function} onConfirmCallback The function to execute when the user confirms.
 * @param {string} confirmButtonClass The Bootstrap class for the confirm button (e.g., 'btn-danger', 'btn-primary').
 */
function openConfirmationModal(title, body, onConfirmCallback, confirmButtonClass = 'btn-danger') {
  confirmationModalBootstrapInstance = confirmationModalBootstrapInstance || new bootstrap.Modal(document.getElementById("confirmationModal"));
  
  document.getElementById('confirmationModalTitle').textContent = title;
  document.getElementById('confirmationModalBody').innerHTML = body;

  const confirmButton = document.getElementById('confirmationModalConfirmButton');
  // Reset classes and add the new one
  confirmButton.className = 'btn';
  confirmButton.classList.add(confirmButtonClass);
  // Clone and replace the button to remove old event listeners
  const newConfirmButton = confirmButton.cloneNode(true);
  confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
  newConfirmButton.addEventListener('click', onConfirmCallback);

  confirmationModalBootstrapInstance.show();
}

function openDayDrawer(isoDateString) {
  document.getElementById("sideDrawerEyebrow").textContent = "Schedules Registered On";
  document.getElementById("sideDrawerTitle").textContent = formatDisplayDate(isoDateString);
  
  const matchedDayVisits = appState.visits.filter(v => v.plan_date === isoDateString);
  let drawerBodyMarkup = "";

  if (matchedDayVisits.length) {
    drawerBodyMarkup = matchedDayVisits.map(renderDashboardVisitCard).join("");
  } else {
    drawerBodyMarkup = `
      <div class="empty-state">
        <i class="bi bi-calendar-minus"></i>
        No operational pipelines converged on this day node.
      </div>`;
  }

  document.getElementById("sideDrawerBody").innerHTML = drawerBodyMarkup;
  document.getElementById("sideDrawerFooter").innerHTML = `
    <button class="btn btn-amber w-100" onclick="closeDrawer(); openVisitModal(null, '${isoDateString}');">
      <i class="bi bi-plus-lg"></i> Plan Visit For This Date
    </button>`;

  document.getElementById("sideDrawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("show");
}

function openVisitExpenseDrawer(visitId) {
  const parentVisitRef = appState.visits.find(v => v.id === visitId);
  if (!parentVisitRef) return;

  document.getElementById("sideDrawerEyebrow").textContent = "Visit Statement";
  document.getElementById("sideDrawerTitle").textContent = `${parentVisitRef.client_name} @ ${parentVisitRef.company_name}`;

  const linkedItemizedExpenses = appState.expenses.filter(e => e.visit_id === visitId);
  let aggregateSum = 0;
  let ledgerTableRowsMarkup = "";

  if (linkedItemizedExpenses.length) {
    linkedItemizedExpenses.forEach(e => {
      aggregateSum += Number(e.amount || 0);
      const bucketName = lookupMasterName(appState.expenseTypes, e.expense_type_id);
      ledgerTableRowsMarkup += `
        <tr>
          <td>
            <strong>${escapeHtml(bucketName || "Incidental Outlay")}</strong>
            <div class="" style="font-size: .75rem;">Settled: ${formatDisplayDate(e.date)}</div>
          </td>
          <td class="mono text-end text-coral">₹${Number(e.amount).toLocaleString('en-IN')}</td>
          <td class="text-end">
            <button class="btn btn-ghost btn-sm-icon" onclick="purgeSingleExpenseNode('${e.id}', '${visitId}')" title="Drop entry line">
              <i class="bi bi-x-lg"></i>
            </button>
          </td>
        </tr>`;
    });

    document.getElementById("sideDrawerBody").innerHTML = `
      <div class="table-responsive">
        <table class="table table-v mb-0" style="font-size: .88rem;">
          <thead>
            <tr>
              <th>Expanse Type</th>
              <th class="text-end">Amount (INR)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${ledgerTableRowsMarkup}
          </tbody>
        </table>
      </div>`;
  } else {
    document.getElementById("sideDrawerBody").innerHTML = `
      <div class="empty-state">
        <i class="bi bi-receipt-cutoff"></i>
        No transactional ledgers linked to this outing record.
      </div>`;
  }

  document.getElementById("sideDrawerFooter").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class=" font-small uppercase tracking-wide">Total Anount (INR) :</span>
      <span class="mono fw-bold text-amber" style="font-size: 1.25rem;">₹${aggregateSum.toLocaleString('en-IN')}</span>
    </div>
    <button class="btn btn-amber w-100" onclick="openExpenseModal('${visitId}')">
      <i class="bi bi-plus-lg"></i> Add Expanse
    </button>`;

  document.getElementById("sideDrawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("show");
}

async function purgeSingleExpenseNode(expenseId, visitId) {
  const title = 'Confirm Expense Deletion';
  const body = 'Are you sure you want to permanently remove this expense record? This action cannot be undone.';
  
  const onConfirm = () => {
    confirmationModalBootstrapInstance.hide();

    const expenseIndex = appState.expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) return;

    const expenseToDelete = appState.expenses[expenseIndex];
    appState.expenses.splice(expenseIndex, 1);
    openVisitExpenseDrawer(visitId); // Keep the drawer refreshed
    renderActiveView(); // Refresh the main page view

    const deleteTimeout = setTimeout(async () => {
      const { error } = await supabaseClient.from('expenses').delete().eq('id', expenseId);
      if (error) {
        showToast(`Error deleting expense: ${error.message}`, 'error');
        appState.expenses.splice(expenseIndex, 0, expenseToDelete);
        openVisitExpenseDrawer(visitId);
        renderActiveView();
      }
    }, appState.undoTimeout);

    showToast("Expense deleted.", "success", {
      label: "Undo",
      callback: () => {
        clearTimeout(deleteTimeout);
        appState.expenses.splice(expenseIndex, 0, expenseToDelete);
        openVisitExpenseDrawer(visitId);
        renderActiveView();
      }
    });
  };

  openConfirmationModal(title, body, onConfirm);
}

function closeDrawer() {
  document.getElementById("sideDrawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.remove("show");
}