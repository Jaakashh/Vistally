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
                  <div class="input-group">
                    <input type="text" class="form-control" id="formMobileNoField" required placeholder="e.g. 757508XXXX">
                    <button type="button" class="btn btn-outline-secondary" onclick="pickContactPhoneNumber()" title="Import from contacts">
                      <i class="bi bi-person-lines-fill"></i>
                    </button>
                  </div>
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
              <div class="mb-3">
                <label class="form-label">Receipt Image (optional)</label>
                <input type="file" class="form-control" id="formExpenseReceiptField" accept="image/*">
                <div class="form-text text-muted" style="font-size:.85rem;">Receipts require a Supabase storage bucket named <strong>expense-receipts</strong>. If the bucket is missing, expenses can still be saved without an attached receipt.</div>
                <div id="formExpenseReceiptPreview" class="mt-2" style="display: none;"></div>
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

    <!-- Expense Entry Details Modal -->
    <div class="modal fade" id="expenseEntryDetailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Expense Entry Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" id="expenseEntryDetailsBody">
            <div class="empty-state"><i class="bi bi-hourglass-split"></i>Loading expense details...</div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" data-bs-dismiss="modal">Close</button>
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

const EXPENSE_RECEIPT_STORAGE_BUCKET = 'expense-receipts';

let visitConfigModalBootstrapInstance = null;
let expenseModalBootstrapInstance = null;
let expenseEntryDetailsModalInstance = null;
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

function upsertAppStateCollection(collectionKey, record) {
  if (!record || !collectionKey) return;
  const collection = appState[collectionKey];
  if (!Array.isArray(collection)) return;
  const existingIndex = collection.findIndex(item => item.id === record.id);
  if (existingIndex === -1) {
    collection.push(record);
  } else {
    collection[existingIndex] = record;
  }
}
 
function getAppStateKeyForTable(tableName) {
  return tableName.replace(/_(\w)/g, (_, p1) => p1.toUpperCase());
}

function isRowLevelSecurityError(error) {
  const message = String(error?.message || error?.msg || error || '').toLowerCase();
  return message.includes('row-level security') || message.includes('violates row-level security') || message.includes('policy');
}

function buildRlsInsertHint(tableName) {
  return `Your Supabase ${tableName} table appears to have row-level security enabled. Verify that there is an INSERT policy allowing authenticated users to create rows when user_id = auth.uid(). For expenses, also ensure the inserted visit_id belongs to the signed-in user.`;
}

function renderExpenseReceiptPreview(files) {
  const previewContainer = document.getElementById('formExpenseReceiptPreview');
  if (!previewContainer) return;
  if (!files || files.length === 0) {
    previewContainer.style.display = 'none';
    previewContainer.innerHTML = '';
    return;
  }

  const file = files[0];
  if (!file.type.startsWith('image/')) {
    previewContainer.style.display = 'none';
    previewContainer.innerHTML = '<div class="text-danger">Only image files are supported for receipts.</div>';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    previewContainer.style.display = 'block';
    previewContainer.innerHTML = `
      <div class="border rounded p-2 d-flex align-items-center gap-2" style="max-width: 100%;">
        <img src="${reader.result}" alt="Receipt preview" style="max-width: 100px; max-height: 100px; object-fit: contain; border-radius: 8px;" />
        <div>
          <div class="fw-semibold">${escapeHtml(file.name)}</div>
          <div style="font-size:.85rem; color: var(--muted);">${Math.round(file.size / 1024)} KB</div>
        </div>
      </div>`;
  };
  reader.readAsDataURL(file);
}

async function uploadExpenseReceiptFile(file, userId) {
  if (!file || !userId) return null;
  const fileName = encodeURIComponent(file.name.replace(/\s+/g, '_'));
  const path = `${userId}/${Date.now()}_${fileName}`;
  const { error: uploadError } = await supabaseClient.storage.from(EXPENSE_RECEIPT_STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (uploadError) {
    if (uploadError.message && uploadError.message.toLowerCase().includes('bucket not found')) {
      throw new Error(`Receipt storage bucket "${EXPENSE_RECEIPT_STORAGE_BUCKET}" does not exist. Please create the bucket in Supabase Storage or save without a receipt.`);
    }
    throw uploadError;
  }
 
  const { data: publicUrlData, error: publicUrlError } = supabaseClient.storage.from(EXPENSE_RECEIPT_STORAGE_BUCKET).getPublicUrl(path);
  if (publicUrlError || !publicUrlData?.publicUrl) {
    if (publicUrlError && publicUrlError.message && publicUrlError.message.toLowerCase().includes('bucket not found')) {
      throw new Error(`Receipt storage bucket "${EXPENSE_RECEIPT_STORAGE_BUCKET}" does not exist. Please create the bucket in Supabase Storage or save without a receipt.`);
    }
    throw publicUrlError || new Error('Failed to generate receipt URL');
  }
 
  return publicUrlData.publicUrl;
}

async function pickContactPhoneNumber() {
  if (!navigator.contacts || !navigator.contacts.select) {
    showToast('Contact picker is not supported by this browser.', 'error');
    return;
  }

  try {
    const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: false });
    if (!contacts || contacts.length === 0) {
      return;
    }

    const contact = contacts[0];
    let phone = '';
    if (Array.isArray(contact.tel)) {
      phone = contact.tel.find(t => t && String(t).trim());
    } else {
      phone = contact.tel;
    }

    if (!phone) {
      showToast('Selected contact does not contain a phone number.', 'error');
      return;
    }

    const normalizedPhone = String(phone).trim();
    const mobileField = document.getElementById('formMobileNoField');
    if (mobileField) {
      mobileField.value = normalizedPhone;
    }

    if (contact.name && contact.name.length && !document.getElementById('formClientNameField').value) {
      const contactName = Array.isArray(contact.name) ? contact.name[0] : contact.name;
      if (contactName) {
        document.getElementById('formClientNameField').value = String(contactName).trim();
      }
    }

    showToast('Contact information imported successfully.', 'success');
  } catch (error) {
    console.error('Contact picker error:', error);
    if (error && error.name === 'AbortError') {
      return;
    }
    showToast(`Unable to import contact: ${error?.message || 'Permission denied or not supported.'}`, 'error');
  }
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
  if (!user) {
    showToast('Unable to confirm your identity. Please sign in again and retry.', 'error');
    revertButtonLoadingState(button);
    return;
  }
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
    const { data, error } = await supabaseClient.from('visits').update(visitPayload).eq('id', hiddenId).select().single();
    if (error) {
      if (isRowLevelSecurityError(error)) {
        showToast(buildRlsInsertHint('visits'), 'error');
      } else {
        showToast(`Error updating visit: ${error.message}`, 'error');
      }
      revertButtonLoadingState(button);
      return;
    }
    if (data) {
      upsertAppStateCollection('visits', data);
    }
    showToast("Visit updated successfully!", "success");
  } else {
    const { data, error } = await supabaseClient.from('visits').insert([{ ...visitPayload, user_id: user.id }]).select().single();
    if (error) {
      if (isRowLevelSecurityError(error)) {
        showToast(buildRlsInsertHint('visits'), 'error');
      } else {
        showToast(`Error creating visit: ${error.message}`, 'error');
      }
      revertButtonLoadingState(button);
      return;
    }
    if (data) {
      upsertAppStateCollection('visits', data);
    }
    showToast("Visit created successfully!", "success");
  }

  revertButtonLoadingState(button);
  visitConfigModalBootstrapInstance.hide();
  renderActiveView();
  
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
  const receiptPreview = document.getElementById('formExpenseReceiptPreview');
  if (receiptPreview) {
    receiptPreview.style.display = 'none';
    receiptPreview.innerHTML = '';
  }

  populateSelectorDropdown("formExpenseTypeSelect", appState.expenseTypes);

  const receiptInput = document.getElementById('formExpenseReceiptField');
  if (receiptInput) {
    receiptInput.value = '';
    receiptInput.onchange = () => renderExpenseReceiptPreview(receiptInput.files);
  }

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
  if (!user) {
    showToast('Unable to confirm your identity. Please sign in again and retry.', 'error');
    revertButtonLoadingState(button);
    return;
  }
  const expVisitId = document.getElementById("formExpenseTargetVisitId").value;
  const receiptFileInput = document.getElementById('formExpenseReceiptField');
  let receiptUrl = null;

  if (receiptFileInput && receiptFileInput.files && receiptFileInput.files.length > 0) {
    try {
      receiptUrl = await uploadExpenseReceiptFile(receiptFileInput.files[0], user.id);
    } catch (uploadError) {
      if (uploadError.message && uploadError.message.toLowerCase().includes('storage bucket')) {
        showToast(uploadError.message, 'warning');
        receiptUrl = null;
      } else {
        showToast(`Error uploading receipt: ${uploadError.message}`, 'error');
        revertButtonLoadingState(button);
        return;
      }
    }
  }
 
  const newExpenseNode = {
    user_id: user.id,
    visit_id: expVisitId || null,
    expense_type_id: document.getElementById("formExpenseTypeSelect").value || null,
    amount: Number(document.getElementById("formExpenseAmountField").value),
    date: document.getElementById("formExpenseDateField").value,
    receipt_url: receiptUrl
  };

  let insertResponse = await supabaseClient.from('expenses').insert([newExpenseNode]).select().single();
  let data = insertResponse.data;
  let error = insertResponse.error;
 
  if (error && error.message && error.message.toLowerCase().includes('column "receipt_url"')) {
    const { data: fallbackData, error: fallbackError } = await supabaseClient.from('expenses').insert([{
      user_id: user.id,
      visit_id: expVisitId || null,
      expense_type_id: document.getElementById("formExpenseTypeSelect").value || null,
      amount: Number(document.getElementById("formExpenseAmountField").value),
      date: document.getElementById("formExpenseDateField").value
    }]).select().single();
 
    if (fallbackError) {
      if (isRowLevelSecurityError(fallbackError)) {
        showToast(buildRlsInsertHint('expenses'), 'error');
      } else {
        showToast(`Error saving expense: ${fallbackError.message}`, 'error');
      }
      revertButtonLoadingState(button);
      return;
    }
    data = fallbackData;
    showToast('Receipt uploaded, but the database does not support receipt_url yet. Expense saved without receipt link.', 'warning');
  } else if (error) {
    if (isRowLevelSecurityError(error)) {
      showToast(buildRlsInsertHint('expenses'), 'error');
    } else {
      showToast(`Error saving expense: ${error.message}`, 'error');
    }
    revertButtonLoadingState(button);
    return;
  }

  if (data) {
    upsertAppStateCollection('expenses', data);
  }
  const successMessage = receiptUrl ? 'Expense saved successfully with receipt!' : 'Expense saved successfully!';
  showToast(successMessage, 'success');

  expenseModalBootstrapInstance.hide();
  revertButtonLoadingState(button);
  renderActiveView();
  
  const drawerElement = document.getElementById("sideDrawer");
  if (drawerElement && drawerElement.classList.contains("open")) {
    openVisitExpenseDrawer(expVisitId);
  }
}

function viewExpenseEntryDetails(expenseId) {
  const expense = appState.expenses.find(e => e.id === expenseId);
  if (!expense) {
    showToast('Expense entry not found.', 'error');
    return;
  }

  const parentVisit = appState.visits.find(v => v.id === expense.visit_id);
  const categoryName = lookupMasterName(appState.expenseTypes, expense.expense_type_id) || 'Uncategorized';
  const receiptUrl = expense.receipt_url || null;
  const receiptMarkup = receiptUrl ? `
    <div class="mt-3">
      <h6 class="mb-2">Receipt Image</h6>
      <a href="${escapeHtml(receiptUrl)}" target="_blank" rel="noopener noreferrer" class="d-block mb-2">View receipt in a new tab</a>
      <img src="${escapeHtml(receiptUrl)}" alt="Receipt" style="max-width: 100%; border-radius: 12px; border: 1px solid var(--line);" />
    </div>` : '<div class="empty-state p-3"><i class="bi bi-receipt"></i>No receipt image attached to this expense.</div>';

  const bodyMarkup = `
    <div class="row g-3">
      <div class="col-md-6">
        <div class="fw-semibold mb-1">Expense Category</div>
        <div>${escapeHtml(categoryName)}</div>
      </div>
      <div class="col-md-6">
        <div class="fw-semibold mb-1">Amount</div>
        <div class="mono">₹${Number(expense.amount || 0).toLocaleString('en-IN')}</div>
      </div>
      <div class="col-md-6">
        <div class="fw-semibold mb-1">Date Incurred</div>
        <div>${formatDisplayDate(expense.date)}</div>
      </div>
      <div class="col-md-6">
        <div class="fw-semibold mb-1">Associated Visit</div>
        <div>${escapeHtml(parentVisit ? `${parentVisit.client_name} — ${parentVisit.company_name}` : 'Standalone Registry')}</div>
      </div>
      <div class="col-12">
        <div class="fw-semibold mb-1">Receipt Link</div>
        ${receiptUrl ? `<a href="${escapeHtml(receiptUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(receiptUrl)}</a>` : 'No receipt attached.'}
      </div>
    </div>
    ${receiptMarkup}`;

  const detailsBody = document.getElementById('expenseEntryDetailsBody');
  if (detailsBody) {
    detailsBody.innerHTML = bodyMarkup;
  }

  expenseEntryDetailsModalInstance = expenseEntryDetailsModalInstance || new bootstrap.Modal(document.getElementById('expenseEntryDetailsModal'));
  expenseEntryDetailsModalInstance.show();
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
  if (!user) {
    showToast('Unable to confirm your identity. Please sign in again and retry.', 'error');
    revertButtonLoadingState(button);
    return;
  }
  const targetKey = document.getElementById("formMasterTargetObjectKey").value;
  const targetId = document.getElementById("formMasterTargetRecordId").value;
  const payload = {
    name: document.getElementById("formMasterNameField").value.trim(),
    description: document.getElementById("formMasterDescriptionField").value.trim()
  };

  if (targetId) {
    const { error } = await supabaseClient.from(targetKey).update(payload).eq('id', targetId);
    if (error) {
      if (isRowLevelSecurityError(error)) {
        showToast(buildRlsInsertHint(targetKey), 'error');
      } else {
        showToast(`Error updating item: ${error.message}`, 'error');
      }
      revertButtonLoadingState(button);
      return;
    }
    showToast("Item updated successfully!", "success");
  } else {
    const { error } = await supabaseClient.from(targetKey).insert([{ ...payload, user_id: user.id }]);
    if (error) {
      if (isRowLevelSecurityError(error)) {
        showToast(buildRlsInsertHint(targetKey), 'error');
      } else {
        showToast(`Error creating item: ${error.message}`, 'error');
      }
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
      const receiptButton = e.receipt_url ? `
        <a href="${escapeHtml(e.receipt_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm-icon" title="View receipt">
          <i class="bi bi-camera-reels"></i>
        </a>` : '';
      ledgerTableRowsMarkup += `
      <tr >
        <td>
          <strong>${escapeHtml(bucketName || "Incidental Outlay")}</strong>
          <div class="" style="font-size: .75rem;">Settled: ${formatDisplayDate(e.date)}</div>
        </td>
        <td class="mono text-end text-coral">₹${Number(e.amount).toLocaleString('en-IN')}</td>
        <td class="text-end">
          ${receiptButton}
          <button class="btn btn-ghost btn-sm-icon" style="color: var(--coral);" onclick="purgeSingleExpenseNode('${e.id}', '${visitId}')" title="Drop entry line">
            <i class="bi bi-x-lg"></i>
          </button>
        </td>
      </tr>`;
    });

    document.getElementById("sideDrawerBody").innerHTML = `
      <div class="table-responsive" style="border-radius: 10px;">
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

  const onConfirm = async () => {
    confirmationModalBootstrapInstance.hide();

    const expenseIndex = appState.expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) {
      showToast('Expense not found in local state.', 'error');
      return;
    }

    const expenseToDelete = appState.expenses[expenseIndex];

    const { error } = await supabaseClient.from('expenses').delete().eq('id', expenseId);
    if (error) {
      showToast(`Error deleting expense: ${error.message}`, 'error');
      return;
    }

    appState.expenses.splice(expenseIndex, 1);
    openVisitExpenseDrawer(visitId);
    renderActiveView();
    showToast('Expense deleted successfully.', 'success');
  };

  openConfirmationModal(title, body, onConfirm);
}

function closeDrawer() {
  document.getElementById("sideDrawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.remove("show");
}