const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./backend/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Initialize database
db.initialize();

// ==================== API Routes ====================

// 1. PRODUCTS MANAGEMENT
// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.getAllProducts();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add a new product
app.post('/api/products', (req, res) => {
  try {
    const { productName, productCode, unit } = req.body;
    if (!productName || !productCode) {
      return res.status(400).json({ success: false, message: 'Product name and code are required' });
    }
    const product = db.addProduct(productName, productCode, unit);
    res.json({ success: true, data: product, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. OPENING STOCK
// Add opening stock
app.post('/api/opening-stock', (req, res) => {
  try {
    const { productId, quantity, rate, date } = req.body;
    if (!productId || !quantity || !rate) {
      return res.status(400).json({ success: false, message: 'Product ID, quantity, and rate are required' });
    }
    const opening = db.addOpeningStock(productId, quantity, rate, date);
    res.json({ success: true, data: opening, message: 'Opening stock added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get opening stock
app.get('/api/opening-stock', (req, res) => {
  try {
    const openingStock = db.getOpeningStock();
    res.json({ success: true, data: openingStock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. INWARD STOCK (Stock In / Purchase)
// Add inward stock
app.post('/api/inward-stock', (req, res) => {
  try {
    const { productId, quantity, rate, supplier, date, remarks } = req.body;
    if (!productId || !quantity || !rate) {
      return res.status(400).json({ success: false, message: 'Product ID, quantity, and rate are required' });
    }
    const inward = db.addInwardStock(productId, quantity, rate, supplier, date, remarks);
    res.json({ success: true, data: inward, message: 'Inward stock added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get inward stock
app.get('/api/inward-stock', (req, res) => {
  try {
    const inwardStock = db.getInwardStock();
    res.json({ success: true, data: inwardStock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. OUTWARD STOCK (Stock Out / Sales)
// Add outward stock
app.post('/api/outward-stock', (req, res) => {
  try {
    const { productId, quantity, rate, customer, date, remarks } = req.body;
    if (!productId || !quantity || !rate) {
      return res.status(400).json({ success: false, message: 'Product ID, quantity, and rate are required' });
    }
    const outward = db.addOutwardStock(productId, quantity, rate, customer, date, remarks);
    res.json({ success: true, data: outward, message: 'Outward stock added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get outward stock
app.get('/api/outward-stock', (req, res) => {
  try {
    const outwardStock = db.getOutwardStock();
    res.json({ success: true, data: outwardStock });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. REPORTS
// Stock Summary Report
app.get('/api/reports/stock-summary', (req, res) => {
  try {
    const report = db.getStockSummary();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stock Report by Product
app.get('/api/reports/stock/:productId', (req, res) => {
  try {
    const report = db.getStockByProduct(req.params.productId);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Transaction History
app.get('/api/reports/transaction-history', (req, res) => {
  try {
    const history = db.getTransactionHistory();
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Inward Report
app.get('/api/reports/inward', (req, res) => {
  try {
    const report = db.getInwardReport();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Outward Report
app.get('/api/reports/outward', (req, res) => {
  try {
    const report = db.getOutwardReport();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stock Movement Report
app.get('/api/reports/movement', (req, res) => {
  try {
    const report = db.getStockMovementReport();
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Expiry Report (Low Stock)
app.get('/api/reports/low-stock', (req, res) => {
  try {
    const threshold = req.query.threshold || 10;
    const report = db.getLowStockReport(threshold);
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Stock Maintenance Module Server running on http://localhost:${PORT}`);
});
