  function renderDashboardView() {
    const targetYear = appState.dashboardYear;
    const targetMonth = appState.dashboardMonth;

    const monthlyVisits = appState.visits.filter(v => {
      const d = parseLocalDate(v.plan_date);
      return d && d.getFullYear() === targetYear && d.getMonth() === targetMonth;
    });

    const monthlyExpenses = appState.expenses.filter(e => {
      const d = parseLocalDate(e.date);
      return d && d.getFullYear() === targetYear && d.getMonth() === targetMonth;
    });

    const totalExpenseSum = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const searchTerm = (appState.dashboardSearchTerm || "").toLowerCase();
    const pendingVisits = monthlyVisits
      .filter(v => {
        if (v.status !== "Pending" && v.status !== "Planned") return false;
        if (searchTerm === "") return true;

        const purposeName = lookupMasterName(appState.visitPurposes, v.visit_purpose_id).toLowerCase();
        const clientName = v.client_name.toLowerCase();
        const companyName = v.company_name.toLowerCase();

        return clientName.includes(searchTerm) || companyName.includes(searchTerm) || purposeName.includes(searchTerm);
      })
      .sort((a, b) => { const da = parseLocalDate(a.plan_date), db = parseLocalDate(b.plan_date);
        return (da ? da.getTime() : 0) - (db ? db.getTime() : 0);
      });

    let yearOptions = "";
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 2; y <= currentYear + 2; y++) {
      yearOptions += `<option value="${y}" ${y === targetYear ? "selected" : ""}>${y}</option>`;
    }

    let monthOptions = MONTHS.map((m, idx) => 
      `<option value="${idx}" ${idx === targetMonth ? "selected" : ""}>${m}</option>`
    ).join("");

    return `
      <div class="d-flex flex-wrap justify-content-between align-items-end mb-2 gap-2">
        <div>
          <div class="page-title">Dashboard</div>
          <div class="page-sub">Your visit activity at a glance.</div>
        </div>
        <div class="d-flex gap-2">
          <select class="form-select" style="width: auto;" onchange="appState.dashboardMonth = Number(this.value); renderActiveView();">${monthOptions}</select>
          <select class="form-select" style="width: auto;" onchange="appState.dashboardYear = Number(this.value); renderActiveView();">${yearOptions}</select>
        </div>
      </div>

      <div class="row g-3 mb-1">
        <div class="col-6">
          <div class="stat-card">
            <i class="bi bi-signpost-2 stat-icon"></i>
            <div class="stat-label">Total Visits </br> ${MONTHS[targetMonth]} ${targetYear}</div>
            <div class="stat-num">${monthlyVisits.length}</div>
          </div>
        </div>
        <div class="col-6">
          <div class="stat-card">
            <i class="bi bi-wallet2 stat-icon"></i>
            <div class="stat-label">Total Expense </br> ${MONTHS[targetMonth]} ${targetYear}</div>
            <div class="stat-num mono">₹${totalExpenseSum.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
<svg class="routeline" viewBox="0 0 600 26" preserveAspectRatio="none">
      <line x1="10" y1="13" x2="590" y2="13" stroke="#2E3560" stroke-width="2" stroke-dasharray="6 6"></line>
      <circle class="waypoint" cx="10" cy="13" r="5" stroke-width="2"></circle>
      <circle class="waypoint" cx="300" cy="13" r="5" stroke-width="2"></circle>
      <circle class="waypoint" cx="590" cy="13" r="5" stroke-width="2"></circle>
    </svg>
    <div class="card-v mt-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0"><i class="bi bi-calendar3 me-2" style="color: var(--amber);"></i>${MONTHS[targetMonth]} Grid</h6>
              <button class="btn btn-ghost btn-sm-icon" onclick="downloadCalendarAsPdf()" title="Download Calendar as PDF"><i class="bi bi-download"></i></button>
            </div>
            <div id="calendarGridWrapper"></div>
          </div>
          <svg class="routeline" viewBox="0 0 600 26" preserveAspectRatio="none">
      <line x1="10" y1="13" x2="590" y2="13" stroke="#2E3560" stroke-width="2" stroke-dasharray="6 6"></line>
      <circle class="waypoint" cx="10" cy="13" r="5" stroke-width="2"></circle>
      <circle class="waypoint" cx="300" cy="13" r="5" stroke-width="2"></circle>
      <circle class="waypoint" cx="590" cy="13" r="5" stroke-width="2"></circle>
    </svg>
      <div class="row g-3">
        <div class="col-lg-6">
          <div class="card-v">
            <h6 class="mb-3"><i class="bi bi-hourglass-split me-2" style="color: var(--amber);"></i>Pending Queue</h6>
            <div class="mb-3">
              <input type="text" class="form-control" placeholder="Search by client, company, or purpose..." value="${escapeHtml(appState.dashboardSearchTerm || '')}" oninput="updateDashboardFilter(this.value)">
            </div>
            <div id="pendingVisitsList">
              ${pendingVisits.length ? pendingVisits.map(renderDashboardVisitCard).join("") : `<div class="empty-state"><i class="bi bi-inbox"></i>Nothing pending this month. Plan a visit to get started.</div>`}
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card-v">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="mb-0"><i class="bi bi-pie-chart me-2" style="color: var(--amber);"></i>Expense Breakdown</h6>
              <button class="btn btn-ghost btn-sm-icon" onclick="downloadExpenseChart()" title="Download Chart"><i class="bi bi-download"></i></button>
            </div>
            <div id="expenseChartWrapper">
              <canvas id="expenseChart" style="max-height: 250px;"></canvas>
              <div id="expenseChartLegend" class="mt-3"></div>
            </div>
          </div>
          
        </div>
      </div>`;
  }

  let expenseChartInstance = null;

  function renderExpenseChart() {
    const chartCanvas = document.getElementById('expenseChart');
    if (!chartCanvas) return;

    const targetYear = appState.dashboardYear;
    const targetMonth = appState.dashboardMonth;

    const monthlyExpenses = appState.expenses.filter(e => {
      const d = parseLocalDate(e.date);
      return d && d.getFullYear() === targetYear && d.getMonth() === targetMonth;
    });

    const expensesByType = {};
    monthlyExpenses.forEach(expense => {
      const typeId = expense.expense_type_id;
      expensesByType[typeId] = (expensesByType[typeId] || 0) + Number(expense.amount || 0);
    });

    const labels = Object.keys(expensesByType).map(typeId => lookupMasterName(appState.expenseTypes, typeId) || 'Uncategorized');
    const data = Object.values(expensesByType);

    if (expenseChartInstance) {
      expenseChartInstance.destroy();
    }

    if (data.length === 0) {
      chartCanvas.style.display = 'none';
      const legendContainer = document.getElementById('expenseChartLegend');
      if (legendContainer) legendContainer.innerHTML = '<div class="empty-state" style="padding: 20px 0;"><i class="bi bi-pie-chart"></i>No expenses to display for this month.</div>';
      // You could add a message here if you want
      return;
    }
    chartCanvas.style.display = 'block';

    const isDarkMode = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const textColor = isDarkMode ? '#dee2e6' : '#495057';

    const chartColors = [
      'rgba(255, 193, 7, 0.7)',
      'rgba(25, 135, 84, 0.7)',
      'rgba(13, 110, 253, 0.7)',
      'rgba(220, 53, 69, 0.7)',
      'rgba(108, 117, 125, 0.7)',
      'rgba(13, 202, 240, 0.7)'
    ];

    expenseChartInstance = new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Expenses',
          data: data,
          backgroundColor: chartColors,
          borderColor: isDarkMode ? '#212529' : '#fff',
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // We will create a custom HTML legend
          },
          tooltip: {
            titleColor: textColor,
            bodyColor: textColor,
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) { label += ': '; }
                if (context.parsed !== null) {
                  label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
                }
                return label;
              }
            }
          }
        }
      }
    });

    // Generate Custom HTML Legend
    const legendContainer = document.getElementById('expenseChartLegend');
    let legendHtml = '<div class="d-flex flex-wrap justify-content-center gap-3">';
    labels.forEach((label, i) => {
      const value = data[i] || 0;
      const color = chartColors[i % chartColors.length];
      legendHtml += `
        <div class="d-flex align-items-center">
          <span style="width: 12px; height: 12px; background-color: ${color}; border-radius: 3px; display: inline-block; margin-right: 8px;"></span>
          <span style="font-size: .85rem;">${escapeHtml(label)} (${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)})</span>
        </div>`;
    });
    legendHtml += '</div>';
    legendContainer.innerHTML = legendHtml;
  }

  function downloadExpenseChart() {
    const chartWrapperEl = document.getElementById('expenseChartWrapper');
    if (!chartWrapperEl) {
      showToast("Chart container not found.", "error");
      return;
    }

    showToast("Generating image...", "info");

    html2canvas(chartWrapperEl, {
      backgroundColor: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#1B2140' : '#FFFFFF',
      scale: 2
    }).then(canvas => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `Vistally_Expense_Breakdown_${MONTHS[appState.dashboardMonth]}_${appState.dashboardYear}.png`;
      link.click();
    });
  }

  function updateDashboardFilter(value) {
    appState.dashboardSearchTerm = value;
    renderActiveView();
  }

  function renderDashboardVisitCard(v) {
    const purposeName = lookupMasterName(appState.visitPurposes, v.visit_purpose_id);
    const expenseTotal = calculateVisitExpenseTotal(v.id);
    return `
      <div class="visit-card">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div class="fw-semibold">${escapeHtml(purposeName || "Unassigned Purpose")}</div>
            <div class="" style="font-size: .85rem;">${escapeHtml(v.client_name)} · ${escapeHtml(v.company_name)}</div>
            <div class="" style="font-size: .78rem; margin-top: 4px;"> <i class="bi bi-clock me-1"></i>${formatDisplayDate(v.plan_date)}${v.plan_time ? " @ " + v.plan_time : ""}
            </div>
          </div>
          <div class="text-end">
            <span class="badge-status st-${v.status}">${v.status}</span>
            <div class="mono" style="font-size: .82rem; margin-top: 8px; color: var(--amber);">₹${expenseTotal.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div class="d-flex gap-2 mt-3 flex-wrap">
          <button class="btn btn-ghost btn-sm-icon" onclick="openExpenseModal('${v.id}')"><i class="bi bi-receipt"></i> + Expense</button>
          <button class="btn btn-ghost btn-sm-icon" onclick="openVisitExpenseDrawer('${v.id}')"><i class="bi bi-list-ul"></i> Ledger</button>
          <a class="btn btn-ghost btn-sm-icon" href="tel:${escapeHtml(v.mobile_no || '')}"><i class="bi bi-telephone"></i> Call</a>
          <button class="btn btn-ghost btn-sm-icon" onclick="openVisitModal('${v.id}')"><i class="bi bi-pencil"></i> Edit</button>
          <button class="btn btn-ghost btn-sm-icon" onclick="deleteVisitRecord('${v.id}')" title="Purge entity"><i class="bi bi-trash"></i></button>
        </div>
      </div>`;
  }

  function renderCalendarGrid() {
    const wrapper = document.getElementById("calendarGridWrapper");
    if (!wrapper) return;

    const year = appState.dashboardYear;
    const month = appState.dashboardMonth;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const visitCountsByDay = {};
    appState.visits.forEach(v => {
      const d = parseLocalDate(v.plan_date);
      if (d && d.getFullYear() === year && d.getMonth() === month) {
        const dateNum = d.getDate();
        visitCountsByDay[dateNum] = (visitCountsByDay[dateNum] || 0) + 1;
      }
    });

    const today = new Date();
    const isCurrentMonthView = today.getFullYear() === year && today.getMonth() === month;

    let gridHtml = `<div class="cal-grid">`;
    ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(dayLabel => {
      gridHtml += `<div class="cal-dow">${dayLabel}</div>`;
    });

    for (let i = 0; i < firstDayIndex; i++) {
      gridHtml += `<div class="cal-cell empty"></div>`;
    }

    for (let day = 1; day <= totalDays; day++) {
      const hasVisits = visitCountsByDay[day] > 0;
      const isTodayCell = isCurrentMonthView && today.getDate() === day;
      const ISOString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      gridHtml += `
        <div class="cal-cell ${hasVisits ? 'has-visit' : ''} ${isTodayCell ? 'today' : ''}" onclick="openDayDrawer('${ISOString}')">
          <div class="d-num">${day}</div>
          ${hasVisits ? `<div class="cal-pin">${visitCountsByDay[day]}</div>` : ""}
        </div>`;
    }

    gridHtml += `</div>`;
    wrapper.innerHTML = gridHtml;
  }

  function downloadCalendarAsPdf() {
    const { jsPDF } = window.jspdf;
    const calendarEl = document.getElementById('calendarGridWrapper');
    if (!calendarEl) {
      showToast("Calendar grid not found.", "error");
      return;
    }

    showToast("Generating PDF...", "info");

    html2canvas(calendarEl, { 
      backgroundColor: document.documentElement.getAttribute('data-bs-theme') === 'dark' ? '#1B2140' : '#FFFFFF',
      scale: 2 // Increase resolution
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Vistally_Calendar_${MONTHS[appState.dashboardMonth]}_${appState.dashboardYear}.pdf`);
    });
  }

  function renderVisitsView() {
    const searchTerm = (appState.allVisitsSearchTerm || "").toLowerCase();

    const sortBy = appState.allVisitsSortBy || 'plan_date';
    const sortDir = appState.allVisitsSortDir || 'desc';
    const currentPage = appState.allVisitsCurrentPage || 1;
    const itemsPerPage = appState.allVisitsItemsPerPage || 5;

    let indexedVisits = [...appState.visits];

    if (searchTerm) {
      indexedVisits = indexedVisits.filter(v => {
        const purposeName = lookupMasterName(appState.visitPurposes, v.visit_purpose_id).toLowerCase();
        const clientName = v.client_name.toLowerCase();
        const companyName = v.company_name.toLowerCase();
        return clientName.includes(searchTerm) || companyName.includes(searchTerm) || purposeName.includes(searchTerm);
      });
    }

    indexedVisits.sort((a, b) => {
      let valA, valB;

      if (sortBy === 'plan_date') {
        valA = parseLocalDate(a.plan_date)?.getTime() || 0;
        valB = parseLocalDate(b.plan_date)?.getTime() || 0;
      } else { // client_name
        valA = a.client_name.toLowerCase();
        valB = b.client_name.toLowerCase();
      }

      if (valA < valB) {
        return sortDir === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortDir === 'asc' ? 1 : -1;
      }
      return 0;
    });

    // Pagination logic
    const totalItems = indexedVisits.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedVisits = indexedVisits.slice(startIndex, endIndex);

    return `
      <div class="page-title">All Visits</div>
      <div class="page-sub">Every planned visit, in one place.</div>
      <div class="card-v my-3">
        <div class="row g-2">
          <div class="col-lg-3">
            <input type="text" class="form-control" placeholder="Search all visits..." value="${escapeHtml(appState.allVisitsSearchTerm || '')}" oninput="updateAllVisitsFilter(this.value)">
          </div>
          <div class="col-lg-2 col-sm-4">
            <select class="form-select" onchange="appState.allVisitsSortBy = this.value; appState.allVisitsCurrentPage = 1; renderActiveView();">
              <option value="plan_date" ${sortBy === 'plan_date' ? 'selected' : ''}>Sort by Date</option>
              <option value="client_name" ${sortBy === 'client_name' ? 'selected' : ''}>Sort by Client Name</option>
            </select>
          </div>
          <div class="col-lg-2 col-sm-4">
            <select class="form-select" onchange="appState.allVisitsSortDir = this.value; appState.allVisitsCurrentPage = 1; renderActiveView();">
              <option value="desc" ${sortDir === 'desc' ? 'selected' : ''}>Descending</option>
              <option value="asc" ${sortDir === 'asc' ? 'selected' : ''}>Ascending</option>
            </select>
          </div>
          <div class="col-lg-2 col-sm-4">
            <select class="form-select" onchange="appState.allVisitsItemsPerPage = Number(this.value); appState.allVisitsCurrentPage = 1; renderActiveView();">
              <option value="5" ${itemsPerPage === 5 ? 'selected' : ''}>5 per page</option>
              <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10 per page</option>
              <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25 per page</option>
            </select>
          </div>
          <div class="col-lg-3 col-sm-12">
            <button class="btn btn-outline-secondary w-100" onclick="exportAllVisitsToCsv()"><i class="bi bi-download me-2"></i>Export All to CSV</button>
          </div>
        </div>
      </div>
      <div class="mt-3" id="allVisitsList">
      ${paginatedVisits.length 
        ? paginatedVisits.map(renderDashboardVisitCard).join("") 
        : `<div class="card-v empty-state"><i class="bi bi-search"></i>No visits match your search criteria.</div>`
      }
      </div>
      ${totalPages > 1 ? `
        <nav class="mt-4 d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="changeAllVisitsPage(${currentPage - 1})">Previous</a>
            </li>
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
              <li class="page-item ${p === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeAllVisitsPage(${p})">${p}</a>
              </li>
            `).join('')}
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="changeAllVisitsPage(${currentPage + 1})">Next</a>
            </li>
          </ul>
        </nav>
      ` : ''}
      `;
  }

  function changeAllVisitsPage(page) {
    appState.allVisitsCurrentPage = page;
    renderActiveView();
  }

  function updateAllVisitsFilter(value) {
    appState.allVisitsSearchTerm = value;
    appState.allVisitsCurrentPage = 1; // Reset to first page on new search
    // We only need to re-render the list, not the whole page.
    // The main renderVisitsView function will handle filtering and sorting.
    // To avoid losing focus, we target just the list.
    
    const searchTerm = (value || "").toLowerCase();

    let indexedVisits = [...appState.visits];

    if (searchTerm) {
      indexedVisits = indexedVisits.filter(v => {
        const purposeName = lookupMasterName(appState.visitPurposes, v.visit_purpose_id).toLowerCase();
        const clientName = v.client_name.toLowerCase();
        const companyName = v.company_name.toLowerCase();
        return clientName.includes(searchTerm) || companyName.includes(searchTerm) || purposeName.includes(searchTerm);
      });
    }

    const sortBy = appState.allVisitsSortBy || 'plan_date';
    const sortDir = appState.allVisitsSortDir || 'desc';
    indexedVisits.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'plan_date') {
        valA = parseLocalDate(a.plan_date)?.getTime() || 0;
        valB = parseLocalDate(b.plan_date)?.getTime() || 0;
      } else { // client_name
        valA = a.client_name.toLowerCase();
        valB = b.client_name.toLowerCase();
      }
      if (valA < valB) {
        return sortDir === 'asc' ? -1 : 1;
      }
      if (valA > valB) { return sortDir === 'asc' ? 1 : -1; }
      return 0;
    });

    const listEl = document.getElementById('allVisitsList');
    const itemsPerPage = appState.allVisitsItemsPerPage || 5;
    const paginatedVisits = indexedVisits.slice(0, itemsPerPage);

    listEl.innerHTML = paginatedVisits.length ? paginatedVisits.map(renderDashboardVisitCard).join("") : `<div class="card-v empty-state"><i class="bi bi-search"></i>No visits match your search criteria.</div>`;
    renderActiveView(); // Re-render the whole view to update pagination controls
  }

  function exportAllVisitsToCsv() {
    const searchTerm = (appState.allVisitsSearchTerm || "").toLowerCase();
    const sortBy = appState.allVisitsSortBy || 'plan_date';
    const sortDir = appState.allVisitsSortDir || 'desc';
    let visitsToExport = [...appState.visits];

    if (searchTerm) {
      visitsToExport = visitsToExport.filter(v => {
        const purposeName = lookupMasterName(appState.visitPurposes, v.visit_purpose_id).toLowerCase();
        const clientName = v.client_name.toLowerCase();
        const companyName = v.company_name.toLowerCase();
        return clientName.includes(searchTerm) || companyName.includes(searchTerm) || purposeName.includes(searchTerm);
      });
    }

    visitsToExport.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'plan_date') {
        valA = parseLocalDate(a.plan_date)?.getTime() || 0;
        valB = parseLocalDate(b.plan_date)?.getTime() || 0;
      } else { // client_name
        valA = a.client_name.toLowerCase();
        valB = b.client_name.toLowerCase();
      }
      if (valA < valB) { return sortDir === 'asc' ? -1 : 1; }
      if (valA > valB) { return sortDir === 'asc' ? 1 : -1; }
      return 0;
    });

    const headers = ["Date", "Time", "Client Name", "Company Name", "Mobile", "Purpose", "Type", "Status", "Total Expense (INR)", "Notes"];
    const rows = visitsToExport.map(v => [
      v.plan_date,
      v.plan_time || "",
      v.client_name,
      v.company_name,
      v.mobile_no || "",
      lookupMasterName(appState.visitPurposes, v.visit_purpose_id),
      lookupMasterName(appState.visitTypes, v.visit_type_id),
      v.status,
      calculateVisitExpenseTotal(v.id),
      v.notes || ""
    ]);

    const filename = `Vistally_All_Visits_${new Date().toISOString().slice(0,10)}.csv`;
    exportToCsv(filename, headers, rows);
    showToast("Export started...", "info");
  }

  async function deleteVisitRecord(id) {
    const title = 'Confirm Visit Deletion';
    const body = 'This will permanently remove the visit and <strong>all its associated expenses</strong>. This action cannot be undone.';

    const onConfirm = () => {
      confirmationModalBootstrapInstance.hide();

      const visitIndex = appState.visits.findIndex(v => v.id === id);
      if (visitIndex === -1) return;

      // Find and store associated expenses before deletion
      const expensesToDelete = appState.expenses.filter(e => e.visit_id === id);
      const expenseIndices = expensesToDelete.map(exp => appState.expenses.findIndex(e => e.id === exp.id));

      const visitToDelete = appState.visits[visitIndex];
      appState.visits.splice(visitIndex, 1);
      appState.expenses = appState.expenses.filter(e => e.visit_id !== id); // Also remove from local state
      renderActiveView();

      const deleteTimeout = setTimeout(async () => {
        // First, delete all associated expenses.
        const { error: expenseError } = await supabaseClient.from('expenses').delete().eq('visit_id', id);
        if (expenseError) {
          showToast(`Error deleting associated expenses: ${expenseError.message}`, 'error');
          appState.visits.splice(visitIndex, 0, visitToDelete); // Restore on failure
          // Restore expenses on failure
          expenseIndices.forEach((idx, i) => appState.expenses.splice(idx, 0, expensesToDelete[i]));
          renderActiveView();
          return;
        }
        // Then, delete the visit itself.
        const { error: visitError } = await supabaseClient.from('visits').delete().eq('id', id);
        if (visitError) {
          showToast(`Error deleting visit: ${visitError.message}`, 'error');
          // If deletion fails, put it back
          appState.visits.splice(visitIndex, 0, visitToDelete);
          // Also restore expenses if visit deletion fails after expenses were deleted
          expenseIndices.forEach((idx, i) => appState.expenses.splice(idx, 0, expensesToDelete[i]));
          renderActiveView();
        }
      }, appState.undoTimeout);

      showToast("Visit deleted.", "success", {
        label: "Undo",
        callback: () => {
          clearTimeout(deleteTimeout);
          appState.visits.splice(visitIndex, 0, visitToDelete);
          // Also restore expenses on undo
          expenseIndices.forEach((idx, i) => appState.expenses.splice(idx, 0, expensesToDelete[i]));
          renderActiveView();
        }
      });
    };

    openConfirmationModal(title, body, onConfirm);
  }

  function renderReportsView() {
    const from = appState.reportFromDate;
    const to = appState.reportToDate;

    const isBetween = (dateStr, f, t) => {
      const d = parseLocalDate(dateStr), fd = parseLocalDate(f), td = parseLocalDate(t);
      if (!d || !fd || !td) return false;
      return d >= fd && d <= td;
    };

    const filteredVisits = appState.visits.filter(v => isBetween(v.plan_date, from, to));
    const filteredExpenses = appState.expenses.filter(e => isBetween(e.date, from, to));
    const expenseTotalSum = filteredExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const activeTab = appState.reportTab;

    return `
      <div class="d-flex justify-content-between align-items-start">
        <div><div class="page-title">Reports</div>
        <div class="page-sub">Visit and expense activity for a chosen date range.</div></div>
        
      </div>

      <div class="card-v mb-3">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label">From Date</label>
            <input type="date" class="form-control" value="${from}" onchange="appState.reportFromDate = this.value; renderActiveView();">
          </div>
          <div class="col-md-4">
            <label class="form-label">To Date</label>
            <input type="date" class="form-control" value="${to}" onchange="appState.reportToDate = this.value; renderActiveView();">
          </div>
          <div class="col-md-4 d-flex gap-3" Style="justify-content: space-between;">
            <div>
              <div class="stat-label">Total Visit</div>
              <div class="stat-num" style="font-size: 1.4rem;">${filteredVisits.length}</div>
            </div>
            <div>
              <div class="stat-label">Total Expanse</div>
              <div class="stat-num mono" style="font-size: 1.4rem; color: var(--amber);">₹${expenseTotalSum.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      <ul class="nav mb-3" style="border-bottom: 1px solid var(--line); padding-bottom: 8px;">
        <li class="nav-item" style="padding: 0;">
          <span onclick="appState.reportTab = 'visit'; renderActiveView();" style="cursor: pointer; font-weight: 600; color: ${activeTab === 'visit' ? 'var(--amber)' : 'var(--muted)'};">
            Visit-Wise
          </span>
        </li>
        <li class="nav-item" style="padding: 0; margin-left: 20px;">
          <span onclick="appState.reportTab = 'expense'; renderActiveView();" style="cursor: pointer; font-weight: 600; color: ${activeTab === 'expense' ? 'var(--amber)' : 'var(--muted)'};">
            Expense-Wise
          </span>
        </li>
      </ul>

      ${activeTab === "visit" ? renderVisitCentricSubReport(filteredVisits) : renderExpenseCentricSubReport(filteredExpenses)}`;
  }

  function exportReportToCsv() {
    const from = appState.reportFromDate;
    const to = appState.reportToDate;
    const isBetween = (dateStr, f, t) => {
      const d = parseLocalDate(dateStr), fd = parseLocalDate(f), td = parseLocalDate(t);
      if (!d || !fd || !td) return false;
      return d >= fd && d <= td;
    };

    let headers, rows, reportType;

    if (appState.reportTab === 'visit') {
      reportType = 'Visit_Centric';
      headers = ["Date", "Client Name", "Company Name", "Purpose", "Status", "Total Expense (INR)"];
      const filteredVisits = appState.visits.filter(v => isBetween(v.plan_date, from, to));
      rows = filteredVisits.map(v => [
        v.plan_date,
        v.client_name,
        v.company_name,
        lookupMasterName(appState.visitPurposes, v.visit_purpose_id),
        v.status,
        calculateVisitExpenseTotal(v.id)
      ]);
    } else { // expense tab
      reportType = 'Expense_Centric';
      headers = ["Date", "Expense Category", "Amount (INR)", "Associated Client", "Associated Company"];
      const filteredExpenses = appState.expenses.filter(e => isBetween(e.date, from, to));
      rows = filteredExpenses.map(e => {
        const parentVisit = appState.visits.find(v => v.id === e.visit_id);
        return [
          e.date,
          lookupMasterName(appState.expenseTypes, e.expense_type_id),
          e.amount,
          parentVisit ? parentVisit.client_name : "N/A",
          parentVisit ? parentVisit.company_name : "N/A"
        ];
      });
    }
    const filename = `Vistally_Report_${reportType}_${from}_to_${to}.csv`;
    exportToCsv(filename, headers, rows);
    showToast("Export started...", "info");
  }

  function renderVisitCentricSubReport(visits) {
    return `
      <div class="card-v">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">Visit-wise Details</h6>
        <button class="btn btn-ghost btn-sm-icon" onclick="exportReportToCsv()"><i class="bi bi-download"></i> Export CSV</button>
      </div> 
        ${visits.length ? `
          
        <div class="table-responsive">
        
          <table class="table table-v mb-0" style="font-size: .9rem;">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Company Name</th>
                <th>Visit Purpose</th>
                <th>Visit Date</th>
                <th>Status</th>
                <th class="text-end">Expanse</th>
              </tr>
            </thead>
            <tbody>
              ${visits.map(v => {
                const p = lookupMasterName(appState.visitPurposes, v.visit_purpose_id);
                const e = calculateVisitExpenseTotal(v.id);
                return `
                  <tr>
                    <td>${escapeHtml(v.client_name)}</td>
                    <td>${escapeHtml(v.company_name)}</td>
                    <td>${escapeHtml(p || "—")}</td>
                    <td class="mono">${formatDisplayDate(v.plan_date)}</td>
                    <td><span class="badge-status st-${v.status}">${v.status}</span></td>
                    <td class="mono text-end">₹${e.toLocaleString('en-IN')}</td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>` : `<div class="empty-state"><i class="bi bi-calendar-x"></i>Zero parameters verified inside bounds.</div>`}
      </div>`;
  }

  function renderExpenseCentricSubReport(expenses) {
    return `
      <div class="card-v">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="mb-0">Expense-wise Details</h6>
        <button class="btn btn-ghost btn-sm-icon" onclick="exportReportToCsv()"><i class="bi bi-download"></i> Export CSV</button>
      </div> 
        ${expenses.length ? `
         
        <div class="table-responsive">
          <table class="table table-v mb-0" style="font-size: .9rem;">
            <thead>
              <tr>
                <th>Expense Category</th>
                <th>Date Incurred</th>
                <th>Associated Client</th>
                <th class="text-end">Total Expanse</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(e => {
                const cat = lookupMasterName(appState.expenseTypes, e.expense_type_id);
                const parentVisit = appState.visits.find(v => v.id === e.visit_id);
                const clientAnchor = parentVisit ? `${parentVisit.client_name} (${parentVisit.company_name})` : "Standalone Registry";
                return `
                  <tr>
                    <td>${escapeHtml(cat || "—")}</td>
                    <td class="mono">${formatDisplayDate(e.date)}</td>
                    <td>${escapeHtml(clientAnchor)}</td>
                    <td class="mono text-end" style="color: var(--coral);">₹${Number(e.amount).toLocaleString('en-IN')}</td>
                  </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>` : `<div class="empty-state"><i class="bi bi-wallet-x"></i>No transactional ledgers matching dates.</div>`}
      </div>`;
  }

  function renderMasterGridView(stateKey, title, contextualLabel) {
    // Convert snake_case key from router (e.g., 'visit_types') to camelCase key for appState (e.g., 'visitTypes')
    const appStateKey = stateKey.replace(/_(\w)/g, (match, p1) => p1.toUpperCase());
    const items = appState[appStateKey] || [];
    return `
      <div class="d-flex justify-content-between align-items-start mb-1">
        <div>
          <div class="page-title">${title}</div>
          <div class="page-sub">${contextualLabel}</div>
        </div>
        <button class="btn btn-amber" onclick="openMasterFormModal('${stateKey}')"><i class="bi bi-plus-lg"></i> Add</button>
      </div>

      <div class="mt-3">
        ${items.length ? items.map(item => `
          <div class="card-v mb-3">
            <div class="d-flex justify-content-between align-items-start">
              <div class="flex-grow-1 me-3">
                <h6 class="mb-1"><strong>${escapeHtml(item.name)}</strong></h6>
                <p class=" mb-0" style="font-size: .9rem;">${escapeHtml(item.description || "No supplemental details documented.")}</p>
              </div>
              <div class="d-flex flex-shrink-0">
                <button class="btn btn-ghost btn-sm-icon" onclick="openMasterFormModal('${stateKey}', '${item.id}')" title="Edit Item"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-ghost btn-sm-icon" onclick="deleteMasterRowItem('${stateKey}', '${item.id}')" title="Delete Item"><i class="bi bi-trash"></i></button>
              </div>
            </div>
          </div>
        `).join('') : `
          <div class="card-v empty-state"><i class="bi bi-tags"></i>Structural sandbox is barren. Add definitions to construct drop-downs.</div>
        `}
      </div>`;
  }

  async function deleteMasterRowItem(stateKey, id) {
    const title = 'Confirm Master Item Deletion';
    const body = 'Deleting this master item may affect historical records that use it. Are you sure you want to proceed?';

    const onConfirm = () => {
      confirmationModalBootstrapInstance.hide();

      // Convert snake_case (e.g., 'visit_types') to camelCase (e.g., 'visitTypes')
      const appStateKey = stateKey.replace(/_(\w)/g, (match, p1) => p1.toUpperCase());
      const itemIndex = appState[appStateKey].findIndex(i => i.id === id);
      if (itemIndex === -1) return;

      const itemToDelete = appState[appStateKey][itemIndex];
      appState[appStateKey].splice(itemIndex, 1);
      renderActiveView();

      const deleteTimeout = setTimeout(async () => {
        const { error } = await supabaseClient.from(stateKey).delete().eq('id', id);
        if (error) {
          showToast(`Error deleting item: ${error.message}`, 'error');
          appState[appStateKey].splice(itemIndex, 0, itemToDelete);
          renderActiveView();
        }
      }, appState.undoTimeout);

      showToast("Item deleted.", "success", {
        label: "Undo",
        callback: () => {
          clearTimeout(deleteTimeout);
          appState[appStateKey].splice(itemIndex, 0, itemToDelete);
          renderActiveView();
        }
      });
    };
    openConfirmationModal(title, body, onConfirm);
  }

  function renderSettingsView() {
    const p = appState.profile || {};
    return `
      <div class="page-title">Settings</div>
      <div class="page-sub">Synchronize profile tags.</div>

      <div class="card-v">
        <h6>Identity Architecture Context</h6>
        <div class="row g-3 mt-1">
          <div class="col-md-4">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" id="profileFullNameInput" value="${escapeHtml(p.full_name || '')}" placeholder="John Doe">
          </div>
          <div class="col-md-4">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" id="profileEmailInput" value="${escapeHtml(appState.profile.email || '')}" >
          </div>
          <div class="col-md-4">
            <label class="form-label">Mobile Number</label>
            <input type="text" class="form-control" id="profileMobileNoInput" value="${escapeHtml(p.mobile_no || '')}" placeholder="+91 99999 99999">
          </div>
        </div>
        <button class="btn btn-amber mt-3" onclick="commitProfileConfigChanges(this)">Save Profile</button>
      </div>

      <div class="card-v mt-3">
        <h6>Application Preferences</h6>
        <div class="row g-3 mt-1">
          <div class="col-md-4">
            <label class="form-label">"Undo" Action Timeout</label>
            <select class="form-select" id="undoTimeoutSelect">
              <option value="3000" ${appState.undoTimeout === 3000 ? 'selected' : ''}>3 Seconds</option>
              <option value="5000" ${appState.undoTimeout === 5000 ? 'selected' : ''}>5 Seconds</option>
              <option value="7000" ${appState.undoTimeout === 7000 ? 'selected' : ''}>7 Seconds (Default)</option>
              <option value="10000" ${appState.undoTimeout === 10000 ? 'selected' : ''}>10 Seconds</option>
            </select>
          </div>
          <div class="col-md-4 align-self-end">
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" role="switch" id="darkModeToggle" ${localStorage.getItem('vistallyDarkMode') === 'true' ? 'checked' : ''}>
              <label class="form-check-label" for="darkModeToggle">Enable Dark Mode</label>
            </div>
          </div>
        </div>
        <button class="btn btn-amber mt-3" onclick="commitPreferenceChanges(this)">Save Preferences</button>
      </div>
      <div class="card-v mt-3">
        <h6 class="text-danger">Danger Zone</h6>
        <p class="" style="font-size: .9rem;">These actions are irreversible and will result in permanent data loss. Proceed with extreme caution.</p>
        <div class="row g-3 mt-1">
          <div class="col-md-12">
            <button class="btn btn-danger" onclick="clearAllApplicationData()">
              <i class="bi bi-exclamation-octagon me-2"></i>
              Clear All Application Data
            </button>
            <div class="form-text text-danger mt-2">This will delete all visits, expenses, and master configurations from the database.</div>
          </div>
        </div>
      </div>`;
  }

  async function commitProfileChanges(button) {
    setButtonLoadingState(button);
    const { data: { user } } = await supabaseClient.auth.getUser();
    const updates = {
      id: user.id, // The user's ID from Supabase Auth
      full_name: document.getElementById("profileFullNameInput").value.trim(),
      mobile_no: document.getElementById("profileMobileNoInput").value.trim(),
      updated_at: new Date()
    };
    const { error } = await supabaseClient.from('profiles').upsert(updates);
    if (error) {
      showToast(`Error saving profile: ${error.message}`, 'error');
      revertButtonLoadingState(button);
      return;
    }

    showToast("Profile saved successfully!", "success");
    revertButtonLoadingState(button);
    await loadAppState(); // Reload state to reflect changes
    renderActiveView();
  }

  function commitPreferenceChanges(button) {
    setButtonLoadingState(button);

    // Save UI preferences to localStorage
    const undoTimeout = document.getElementById("undoTimeoutSelect").value;
    localStorage.setItem('vistallyUndoTimeout', undoTimeout);
    appState.undoTimeout = parseInt(undoTimeout, 10);

    // Save dark mode preference
    const isDarkMode = document.getElementById("darkModeToggle").checked;
    localStorage.setItem('vistallyDarkMode', isDarkMode);
    applyTheme();

    showToast("Preferences saved successfully!", "success");
    revertButtonLoadingState(button);
  }

  function clearAllApplicationData() {
    const title = 'Confirm Total Data Deletion';
    const body = 'This is a highly destructive action. You are about to delete <strong>ALL</strong> visits, expenses, visit types, visit purposes, and expense types from your account. <br><br><strong>This cannot be undone.</strong><br><br>Are you absolutely sure you want to proceed?';

    const onConfirm = () => {
      confirmationModalBootstrapInstance.hide();
      showToast("Data deletion process initiated...", "info");

      const tablesToDeleteFrom = ['expenses', 'visits', 'visit_types', 'visit_purposes', 'expense_types'];

      const deletionPromises = tablesToDeleteFrom.map(async (tableName) => {
        const { error } = await supabaseClient.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
        if (error) {
          console.error(`Error deleting from ${tableName}:`, error);
          throw new Error(`Failed to clear ${tableName}.`);
        }
      });

      Promise.all(deletionPromises)
        .then(async () => {
          showToast("All application data has been successfully cleared.", "success");
          // Reload state from now-empty tables
          await loadAppState();
          renderActiveView();
        })
        .catch((error) => {
          showToast(error.message, "error");
          console.error("Data clearing failed:", error);
        });
    };

    openConfirmationModal(title, body, onConfirm, 'btn-danger');
  }

  function exportToCsv(filename, headers, rows) {
      const escapeCsvField = (field) => {
          if (field === null || field === undefined) return '';
          const str = String(field);
          // If field contains a comma, double quote, or newline, enclose in double quotes and escape existing double quotes
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
              return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
      };

      const csvContent = [
          headers.join(','),
          ...rows.map(row => row.map(escapeCsvField).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }