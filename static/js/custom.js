// StockTracker SA Custom JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            if (bsAlert) {
                bsAlert.close();
            }
        }, 5000);
    });

    // Format currency inputs
    const currencyInputs = document.querySelectorAll('input[data-currency]');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^\d.]/g, '');
            if (value) {
                e.target.value = 'R' + parseFloat(value).toFixed(2);
            }
        });
    });

    // Confirm delete actions
    const deleteButtons = document.querySelectorAll('[data-confirm-delete]');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const message = this.getAttribute('data-confirm-delete') || 'Are you sure you want to delete this item?';
            if (!confirm(message)) {
                e.preventDefault();
                return false;
            }
        });
    });

    // Auto-calculate sale totals
    const quantityInputs = document.querySelectorAll('input[name="quantity"]');
    const priceInputs = document.querySelectorAll('input[name="unit_price"]');
    
    function calculateTotal() {
        const quantity = parseFloat(document.querySelector('input[name="quantity"]')?.value || 0);
        const price = parseFloat(document.querySelector('input[name="unit_price"]')?.value || 0);
        const total = quantity * price;
        
        const totalElement = document.querySelector('#total_price');
        if (totalElement) {
            totalElement.textContent = 'R' + total.toFixed(2);
        }
    }

    quantityInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
    
    priceInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });

    // Search functionality
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase();
                const tableRows = document.querySelectorAll('tbody tr');
                
                tableRows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }, 300);
        });
    }

    // Stock status color coding
    const stockElements = document.querySelectorAll('[data-stock-status]');
    stockElements.forEach(element => {
        const status = element.getAttribute('data-stock-status');
        switch(status) {
            case 'in_stock':
                element.classList.add('text-success');
                break;
            case 'low_stock':
                element.classList.add('text-warning');
                break;
            case 'out_of_stock':
                element.classList.add('text-danger');
                break;
        }
    });

    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Loading states for forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
                submitButton.disabled = true;
            }
        });
    });
});

// Utility functions
function formatCurrency(amount) {
    return 'R' + parseFloat(amount).toFixed(2);
}

function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 4000);
}