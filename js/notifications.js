function showToast(message, type = 'info', action = null) {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    console.error('Toast container not found!');
    return;
  }

  const toastId = 'toast-' + Date.now();
  const toastIcon = type === 'success' ? 'bi-check-circle-fill' : (type === 'error' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill');
  const toastHeaderClass = type === 'success' ? 'text-success' : (type === 'error' ? 'text-danger' : 'text-primary');

  const toastHtml = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="5000">
      <div class="toast-header">
        <i class="bi ${toastIcon} ${toastHeaderClass} me-2"></i>
        <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        <div class="d-flex justify-content-between align-items-center">
          <span>${message}</span>
          ${action ? `<button class="btn btn-sm btn-outline-secondary ms-3" id="toast-action-${toastId}">${action.label}</button>` : ''}
        </div>
      </div>
    </div>
  `;

  toastContainer.insertAdjacentHTML('beforeend', toastHtml);

  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement);
  toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());

  if (action) {
    document.getElementById(`toast-action-${toastId}`).addEventListener('click', () => {
      action.callback();
      toast.hide();
    });
  }

  toast.show();
}