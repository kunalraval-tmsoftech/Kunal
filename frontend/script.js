// Global Variables
const API_URL = 'http://localhost:3000/api';
let currentProducts = [];
let currentReport = '';

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadAllData();
    setCurrentDate();
    setupEventListeners();
});

function initializePage() {
    // Show dashboard by default
    showSection('dashboard');
    
    // Set today's date as default for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('opening-date').value = today;
    document.getElementById('inward-date').value = today;
    document.getElementById('outward-date').value = today;
}

// Sidebar toggle for responsive / compact view
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('app-sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
});

function setCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('current-date').textContent = today;
}

function setupEventListeners() {
    // Form submissions
    document.getElementById('product-form').addEventListener('submit', handleAddProduct);
    document.getElementById('opening-stock-form').addEventListener('submit', handleAddOpeningStock);
    document.getElementById('inward-stock-form').addEventListener('submit', handleAddInwardStock);
    document.getElementById('outward-stock-form').addEventListener('submit', handleAddOutwardStock);

    // Toggle reports submenu
    document.querySelector('.dropdown-toggle').addEventListener('click', function() {
        const subMenu = this.nextElementSibling;
        subMenu.classList.toggle('active');
    });
}

// ==================== Section Navigation ====================
function showSection(sectionId, evt) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active state from nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Set active nav link (if event provided)
    if (evt && evt.target) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        evt.target.classList.add('active');
    }

    // Load data for dashboard
    if (sectionId === 'dashboard') {
        loadDashboard();
    }
}

function showReport(reportType) {
    showSection('reports');
    currentReport = reportType;
    loadReport(reportType);
    
    // Update active nav link (if event provided)
    if (arguments[1] && arguments[1].target) {
        document.querySelectorAll('.sub-menu .nav-link').forEach(link => link.classList.remove('active'));
        arguments[1].target.classList.add('active');
    }
}

// ==================== Product Management ====================
async function handleAddProduct(e) {
    e.preventDefault();

    const productName = document.getElementById('product-name').value.trim();
    const productCode = document.getElementById('product-code').value.trim();
    const unit = document.getElementById('product-unit').value;

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName,
                productCode,
                unit
            })
        });

        const result = await response.json();
        if (result.success) {
            showAlert('Product added successfully!');
            document.getElementById('product-form').reset();
            loadProducts();
            loadProductSelects();
        } else {
            showAlert('Error: ' + result.message);
        }
    } catch (error) {
        showAlert('Error adding product: ' + error.message);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const result = await response.json();

        if (result.success) {
            currentProducts = result.data;
            displayProducts(currentProducts);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts(products) {
    const tableBody = document.getElementById('products-table');

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="no-data">No products added</td></tr>';
        return;
    }

    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.productName}</td>
            <td>${product.productCode}</td>
            <td>${product.unit}</td>
            <td>${new Date(product.createdDate).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function loadProductSelects() {
    const selects = ['opening-product', 'inward-product', 'outward-product'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        select.innerHTML = '<option value="">-- Select Product --</option>';
        
        currentProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.productName} (${product.productCode})`;
            select.appendChild(option);
        });
        
        select.value = currentValue;
    });
}

// ==================== Opening Stock ====================
async function handleAddOpeningStock(e) {
    e.preventDefault();

    const productId = document.getElementById('opening-product').value;
    const quantity = document.getElementById('opening-quantity').value;
    const rate = document.getElementById('opening-rate').value;
    const date = document.getElementById('opening-date').value;

    if (!productId || !quantity || !rate) {
        showAlert('Please fill all required fields');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/opening-stock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                quantity: parseFloat(quantity),
                rate: parseFloat(rate),
                date
            })
        });

        const result = await response.json();
        if (result.success) {
            showAlert('Opening stock added successfully!');
            document.getElementById('opening-stock-form').reset();
            document.getElementById('opening-date').value = new Date().toISOString().split('T')[0];
            loadOpeningStock();
        } else {
            showAlert('Error: ' + result.message);
        }
    } catch (error) {
        showAlert('Error adding opening stock: ' + error.message);
    }
}

async function loadOpeningStock() {
    try {
        const response = await fetch(`${API_URL}/opening-stock`);
        const result = await response.json();

        if (result.success) {
            displayOpeningStock(result.data);
        }
    } catch (error) {
        console.error('Error loading opening stock:', error);
    }
}

function displayOpeningStock(records) {
    const tableBody = document.getElementById('opening-stock-table');

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No records</td></tr>';
        return;
    }

    tableBody.innerHTML = records.map(record => `
        <tr>
            <td>${record.product?.productName || 'Unknown'}</td>
            <td>${record.quantity}</td>
            <td>${record.rate.toFixed(2)}</td>
            <td>${record.amount.toFixed(2)}</td>
            <td>${record.date}</td>
        </tr>
    `).join('');
}

// ==================== Inward Stock ====================
async function handleAddInwardStock(e) {
    e.preventDefault();

    const productId = document.getElementById('inward-product').value;
    const quantity = document.getElementById('inward-quantity').value;
    const rate = document.getElementById('inward-rate').value;
    const supplier = document.getElementById('inward-supplier').value;
    const date = document.getElementById('inward-date').value;
    const remarks = document.getElementById('inward-remarks').value;

    if (!productId || !quantity || !rate) {
        showAlert('Please fill all required fields');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/inward-stock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                quantity: parseFloat(quantity),
                rate: parseFloat(rate),
                supplier,
                date,
                remarks
            })
        });

        const result = await response.json();
        if (result.success) {
            showAlert('Inward stock added successfully!');
            document.getElementById('inward-stock-form').reset();
            document.getElementById('inward-date').value = new Date().toISOString().split('T')[0];
            loadInwardStock();
        } else {
            showAlert('Error: ' + result.message);
        }
    } catch (error) {
        showAlert('Error adding inward stock: ' + error.message);
    }
}

async function loadInwardStock() {
    try {
        const response = await fetch(`${API_URL}/inward-stock`);
        const result = await response.json();

        if (result.success) {
            displayInwardStock(result.data);
        }
    } catch (error) {
        console.error('Error loading inward stock:', error);
    }
}

function displayInwardStock(records) {
    const tableBody = document.getElementById('inward-stock-table');

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No records</td></tr>';
        return;
    }

    tableBody.innerHTML = records.map(record => `
        <tr>
            <td>${record.product?.productName || 'Unknown'}</td>
            <td>${record.quantity}</td>
            <td>${record.rate.toFixed(2)}</td>
            <td>${record.amount.toFixed(2)}</td>
            <td>${record.supplier || '-'}</td>
            <td>${record.date}</td>
            <td>${record.remarks || '-'}</td>
        </tr>
    `).join('');
}

// ==================== Outward Stock ====================
async function handleAddOutwardStock(e) {
    e.preventDefault();

    const productId = document.getElementById('outward-product').value;
    const quantity = document.getElementById('outward-quantity').value;
    const rate = document.getElementById('outward-rate').value;
    const customer = document.getElementById('outward-customer').value;
    const date = document.getElementById('outward-date').value;
    const remarks = document.getElementById('outward-remarks').value;

    if (!productId || !quantity || !rate) {
        showAlert('Please fill all required fields');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/outward-stock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId,
                quantity: parseFloat(quantity),
                rate: parseFloat(rate),
                customer,
                date,
                remarks
            })
        });

        const result = await response.json();
        if (result.success) {
            showAlert('Outward stock added successfully!');
            document.getElementById('outward-stock-form').reset();
            document.getElementById('outward-date').value = new Date().toISOString().split('T')[0];
            loadOutwardStock();
        } else {
            showAlert('Error: ' + result.message);
        }
    } catch (error) {
        showAlert('Error adding outward stock: ' + error.message);
    }
}

async function loadOutwardStock() {
    try {
        const response = await fetch(`${API_URL}/outward-stock`);
        const result = await response.json();

        if (result.success) {
            displayOutwardStock(result.data);
        }
    } catch (error) {
        console.error('Error loading outward stock:', error);
    }
}

function displayOutwardStock(records) {
    const tableBody = document.getElementById('outward-stock-table');

    if (records.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="no-data">No records</td></tr>';
        return;
    }

    tableBody.innerHTML = records.map(record => `
        <tr>
            <td>${record.product?.productName || 'Unknown'}</td>
            <td>${record.quantity}</td>
            <td>${record.rate.toFixed(2)}</td>
            <td>${record.amount.toFixed(2)}</td>
            <td>${record.customer || '-'}</td>
            <td>${record.date}</td>
            <td>${record.remarks || '-'}</td>
        </tr>
    `).join('');
}

// ==================== Dashboard ====================
async function loadDashboard() {
    try {
        const [productsRes, openingRes, inwardRes, outwardRes, lowRes] = await Promise.all([
            fetch(`${API_URL}/products`),
            fetch(`${API_URL}/opening-stock`),
            fetch(`${API_URL}/inward-stock`),
            fetch(`${API_URL}/outward-stock`),
            fetch(`${API_URL}/reports/low-stock?threshold=10`)
        ]);

        const products = await productsRes.json();
        const opening = await openingRes.json();
        const inward = await inwardRes.json();
        const outward = await outwardRes.json();
        const lowStock = await lowRes.json();

        // Update dashboard cards
        document.getElementById('total-products').textContent = products.data.length;

        const openingValue = opening.data.reduce((sum, item) => sum + item.amount, 0);
        document.getElementById('opening-value').textContent = '₹' + openingValue.toFixed(2);

        const inwardValue = inward.data.reduce((sum, item) => sum + item.amount, 0);
        document.getElementById('inward-value').textContent = '₹' + inwardValue.toFixed(2);

        const outwardValue = outward.data.reduce((sum, item) => sum + item.amount, 0);
        document.getElementById('outward-value').textContent = '₹' + outwardValue.toFixed(2);

        // Display low stock items
        if (lowStock.success) {
            displayLowStock(lowStock.data);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function displayLowStock(items) {
    const tableBody = document.getElementById('low-stock-table');

    if (items.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="no-data">No low stock items</td></tr>';
        return;
    }

    tableBody.innerHTML = items.map(item => `
        <tr>
            <td>${item.productName}</td>
            <td>${item.productCode}</td>
            <td><strong>${item.closingQty}</strong></td>
            <td>${item.unit}</td>
        </tr>
    `).join('');
}

// ==================== Reports ====================
async function loadReport(reportType) {
    try {
        let url = '';
        let title = 'Report';

        switch(reportType) {
            case 'summary':
                url = `${API_URL}/reports/stock-summary`;
                title = 'Stock Summary Report';
                break;
            case 'inward':
                url = `${API_URL}/reports/inward`;
                title = 'Inward Stock Report';
                break;
            case 'outward':
                url = `${API_URL}/reports/outward`;
                title = 'Outward Stock Report';
                break;
            case 'movement':
                url = `${API_URL}/reports/movement`;
                title = 'Stock Movement Report';
                break;
            case 'transaction':
                url = `${API_URL}/reports/transaction-history`;
                title = 'Transaction History Report';
                break;
            case 'low-stock':
                url = `${API_URL}/reports/low-stock?threshold=10`;
                title = 'Low Stock Alert Report';
                break;
        }

        document.getElementById('report-title').textContent = title;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success) {
            displayReport(reportType, result.data);
        }
    } catch (error) {
        showAlert('Error loading report: ' + error.message);
    }
}

function displayReport(reportType, data) {
    const table = document.getElementById('report-table');

    if (reportType === 'summary') {
        displayStockSummary(data, table);
    } else if (reportType === 'inward') {
        displayInwardReport(data, table);
    } else if (reportType === 'outward') {
        displayOutwardReport(data, table);
    } else if (reportType === 'movement') {
        displayMovementReport(data, table);
    } else if (reportType === 'transaction') {
        displayTransactionReport(data, table);
    } else if (reportType === 'low-stock') {
        displayLowStockReport(data, table);
    }
}

function displayStockSummary(data, table) {
    let html = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Code</th>
                <th>Opening Qty</th>
                <th>Inward Qty</th>
                <th>Outward Qty</th>
                <th>Closing Qty</th>
                <th>Inward Value (₹)</th>
                <th>Outward Value (₹)</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (data.length === 0) {
        html += '<tr><td colspan="8" class="no-data">No data</td></tr>';
    } else {
        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.productCode}</td>
                    <td>${item.openingQty}</td>
                    <td>${item.inwardQty}</td>
                    <td>${item.outwardQty}</td>
                    <td><strong>${item.closingQty}</strong></td>
                    <td>${item.inwardAmount.toFixed(2)}</td>
                    <td>${item.outwardAmount.toFixed(2)}</td>
                </tr>
            `;
        });
    }

    html += '</tbody>';
    table.innerHTML = html;
}

function displayInwardReport(data, table) {
    let html = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (data.length === 0) {
        html += '<tr><td colspan="7" class="no-data">No data</td></tr>';
    } else {
        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.product?.productName || 'Unknown'}</td>
                    <td>${item.quantity}</td>
                    <td>${item.rate.toFixed(2)}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>${item.supplier || '-'}</td>
                    <td>${item.date}</td>
                    <td>${item.remarks || '-'}</td>
                </tr>
            `;
        });
    }

    html += '</tbody>';
    table.innerHTML = html;
}

function displayOutwardReport(data, table) {
    let html = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (data.length === 0) {
        html += '<tr><td colspan="7" class="no-data">No data</td></tr>';
    } else {
        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.product?.productName || 'Unknown'}</td>
                    <td>${item.quantity}</td>
                    <td>${item.rate.toFixed(2)}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>${item.customer || '-'}</td>
                    <td>${item.date}</td>
                    <td>${item.remarks || '-'}</td>
                </tr>
            `;
        });
    }

    html += '</tbody>';
    table.innerHTML = html;
}

function displayMovementReport(data, table) {
    let html = `
        <tbody>
    `;

    if (data.length === 0) {
        html += '<tr><td class="no-data">No data</td></tr>';
    } else {
        data.forEach(product => {
            html += `
                <tr>
                    <td colspan="8" style="background-color: #34495e; color: white; font-weight: bold;">
                        ${product.productName} (${product.productCode})
                    </td>
                </tr>
                <tr>
                    <td style="padding-left: 30px;"><strong>Date</strong></td>
                    <td><strong>Type</strong></td>
                    <td><strong>In Qty</strong></td>
                    <td><strong>Out Qty</strong></td>
                    <td colspan="4"><strong>Remarks</strong></td>
                </tr>
            `;

            product.movements.forEach(movement => {
                let remarks = movement.supplier || movement.customer || '-';
                html += `
                    <tr>
                        <td style="padding-left: 30px;">${movement.date}</td>
                        <td>${movement.type}</td>
                        <td>${movement.inQty}</td>
                        <td>${movement.outQty}</td>
                        <td colspan="4">${remarks}</td>
                    </tr>
                `;
            });
        });
    }

    html += '</tbody>';
    table.innerHTML = html;
}

function displayTransactionReport(data, table) {
    let html = `
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Rate (₹)</th>
                <th>Amount (₹)</th>
                <th>Reference</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (data.length === 0) {
        html += '<tr><td colspan="7" class="no-data">No data</td></tr>';
    } else {
        data.forEach(item => {
            let reference = item.supplier || item.customer || '-';
            html += `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.type}</td>
                    <td>${item.product?.productName || 'Unknown'}</td>
                    <td>${item.quantity}</td>
                    <td>${item.rate.toFixed(2)}</td>
                    <td>${item.amount.toFixed(2)}</td>
                    <td>${reference}</td>
                </tr>
            `;
        });
    }

    html += '</tbody>';
    table.innerHTML = html;
}

function displayLowStockReport(data, table) {
    let html = `
        <thead>
            <tr>
                <th>Product</th>
                <th>Code</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
    `;

    if (data.length === 0) {
        html += '<tr><td colspan="5" class="no-data">No low stock items</td></tr>';
    } else {
        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.productCode}</td>
                    <td><strong style="color: #e74c3c;">${item.closingQty}</strong></td>
                    <td>${item.unit}</td>
                    <td>⚠️ Low Stock</td>
                </tr>
            `;
        });
    }

    html += '</tbody>';
    table.innerHTML = html;
}

// ==================== Export & Print ====================
function printReport() {
    window.print();
}

function exportToCSV() {
    const table = document.getElementById('report-table');
    const csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const rowData = [];
        cols.forEach(col => {
            rowData.push('"' + col.textContent.trim().replace(/"/g, '""') + '"');
        });
        csv.push(rowData.join(','));
    });

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report_' + new Date().getTime() + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// ==================== Utility Functions ====================
function showAlert(message) {
    document.getElementById('alert-message').textContent = message;
    document.getElementById('alert-modal').classList.add('show');
}

function closeAlert() {
    document.getElementById('alert-modal').classList.remove('show');
}

async function loadAllData() {
    await loadProducts();
    await loadOpeningStock();
    await loadInwardStock();
    await loadOutwardStock();
    loadProductSelects();
}

// Close alert when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('alert-modal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
}
