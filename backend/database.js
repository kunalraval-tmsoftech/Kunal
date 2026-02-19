const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const OPENING_STOCK_FILE = path.join(DATA_DIR, 'opening_stock.json');
const INWARD_STOCK_FILE = path.join(DATA_DIR, 'inward_stock.json');
const OUTWARD_STOCK_FILE = path.join(DATA_DIR, 'outward_stock.json');

// Utility functions to read/write JSON files
function readJsonFile(filepath) {
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    }
    return [];
  } catch (error) {
    return [];
  }
}

function writeJsonFile(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// Initialize data directory and files
function initialize() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Create empty files if they don't exist
  if (!fs.existsSync(PRODUCTS_FILE)) {
    writeJsonFile(PRODUCTS_FILE, []);
  }
  if (!fs.existsSync(OPENING_STOCK_FILE)) {
    writeJsonFile(OPENING_STOCK_FILE, []);
  }
  if (!fs.existsSync(INWARD_STOCK_FILE)) {
    writeJsonFile(INWARD_STOCK_FILE, []);
  }
  if (!fs.existsSync(OUTWARD_STOCK_FILE)) {
    writeJsonFile(OUTWARD_STOCK_FILE, []);
  }
}

// ==================== PRODUCTS ====================
function getAllProducts() {
  return readJsonFile(PRODUCTS_FILE);
}

function addProduct(productName, productCode, unit = 'nos') {
  const products = readJsonFile(PRODUCTS_FILE);
  const product = {
    id: Date.now().toString(),
    productName,
    productCode,
    unit,
    createdDate: new Date().toISOString()
  };
  products.push(product);
  writeJsonFile(PRODUCTS_FILE, products);
  return product;
}

function getProductById(productId) {
  const products = readJsonFile(PRODUCTS_FILE);
  return products.find(p => p.id === productId);
}

// ==================== OPENING STOCK ====================
function addOpeningStock(productId, quantity, rate, date) {
  const openingStock = readJsonFile(OPENING_STOCK_FILE);
  const entry = {
    id: Date.now().toString(),
    productId,
    quantity: parseFloat(quantity),
    rate: parseFloat(rate),
    amount: parseFloat(quantity) * parseFloat(rate),
    date: date || new Date().toISOString().split('T')[0],
    createdDate: new Date().toISOString()
  };
  openingStock.push(entry);
  writeJsonFile(OPENING_STOCK_FILE, openingStock);
  return entry;
}

function getOpeningStock() {
  const openingStock = readJsonFile(OPENING_STOCK_FILE);
  const products = readJsonFile(PRODUCTS_FILE);
  return openingStock.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  }));
}

// ==================== INWARD STOCK ====================
function addInwardStock(productId, quantity, rate, supplier = '', date, remarks = '') {
  const inwardStock = readJsonFile(INWARD_STOCK_FILE);
  const entry = {
    id: Date.now().toString(),
    productId,
    quantity: parseFloat(quantity),
    rate: parseFloat(rate),
    amount: parseFloat(quantity) * parseFloat(rate),
    supplier,
    date: date || new Date().toISOString().split('T')[0],
    remarks,
    createdDate: new Date().toISOString()
  };
  inwardStock.push(entry);
  writeJsonFile(INWARD_STOCK_FILE, inwardStock);
  return entry;
}

function getInwardStock() {
  const inwardStock = readJsonFile(INWARD_STOCK_FILE);
  const products = readJsonFile(PRODUCTS_FILE);
  return inwardStock.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  }));
}

// ==================== OUTWARD STOCK ====================
function addOutwardStock(productId, quantity, rate, customer = '', date, remarks = '') {
  const outwardStock = readJsonFile(OUTWARD_STOCK_FILE);
  const entry = {
    id: Date.now().toString(),
    productId,
    quantity: parseFloat(quantity),
    rate: parseFloat(rate),
    amount: parseFloat(quantity) * parseFloat(rate),
    customer,
    date: date || new Date().toISOString().split('T')[0],
    remarks,
    createdDate: new Date().toISOString()
  };
  outwardStock.push(entry);
  writeJsonFile(OUTWARD_STOCK_FILE, outwardStock);
  return entry;
}

function getOutwardStock() {
  const outwardStock = readJsonFile(OUTWARD_STOCK_FILE);
  const products = readJsonFile(PRODUCTS_FILE);
  return outwardStock.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  }));
}

// ==================== REPORTS ====================

function getStockSummary() {
  const products = readJsonFile(PRODUCTS_FILE);
  const opening = readJsonFile(OPENING_STOCK_FILE);
  const inward = readJsonFile(INWARD_STOCK_FILE);
  const outward = readJsonFile(OUTWARD_STOCK_FILE);

  return products.map(product => {
    const openingQty = opening
      .filter(o => o.productId === product.id)
      .reduce((sum, o) => sum + o.quantity, 0);

    const inwardQty = inward
      .filter(i => i.productId === product.id)
      .reduce((sum, i) => sum + i.quantity, 0);

    const outwardQty = outward
      .filter(o => o.productId === product.id)
      .reduce((sum, o) => sum + o.quantity, 0);

    const closingQty = openingQty + inwardQty - outwardQty;

    const inwardAmount = inward
      .filter(i => i.productId === product.id)
      .reduce((sum, i) => sum + i.amount, 0);

    const outwardAmount = outward
      .filter(o => o.productId === product.id)
      .reduce((sum, o) => sum + o.amount, 0);

    return {
      productId: product.id,
      productName: product.productName,
      productCode: product.productCode,
      unit: product.unit,
      openingQty,
      inwardQty,
      outwardQty,
      closingQty,
      inwardAmount,
      outwardAmount
    };
  });
}

function getStockByProduct(productId) {
  const products = readJsonFile(PRODUCTS_FILE);
  const opening = readJsonFile(OPENING_STOCK_FILE);
  const inward = readJsonFile(INWARD_STOCK_FILE);
  const outward = readJsonFile(OUTWARD_STOCK_FILE);

  const product = products.find(p => p.id === productId);
  if (!product) {
    return null;
  }

  const openingQty = opening
    .filter(o => o.productId === productId)
    .reduce((sum, o) => sum + o.quantity, 0);

  const inwardQty = inward
    .filter(i => i.productId === productId)
    .reduce((sum, i) => sum + i.quantity, 0);

  const outwardQty = outward
    .filter(o => o.productId === productId)
    .reduce((sum, o) => sum + o.quantity, 0);

  const closingQty = openingQty + inwardQty - outwardQty;

  return {
    product,
    openingQty,
    inwardQty,
    outwardQty,
    closingQty,
    transactions: [
      ...opening.filter(o => o.productId === productId).map(o => ({ type: 'Opening', ...o })),
      ...inward.filter(i => i.productId === productId).map(i => ({ type: 'Inward', ...i })),
      ...outward.filter(o => o.productId === productId).map(o => ({ type: 'Outward', ...o }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date))
  };
}

function getTransactionHistory() {
  const products = readJsonFile(PRODUCTS_FILE);
  const opening = readJsonFile(OPENING_STOCK_FILE);
  const inward = readJsonFile(INWARD_STOCK_FILE);
  const outward = readJsonFile(OUTWARD_STOCK_FILE);

  const transactions = [
    ...opening.map(o => ({
      type: 'Opening Stock',
      ...o,
      product: products.find(p => p.id === o.productId)
    })),
    ...inward.map(i => ({
      type: 'Inward Stock',
      ...i,
      product: products.find(p => p.id === i.productId)
    })),
    ...outward.map(o => ({
      type: 'Outward Stock',
      ...o,
      product: products.find(p => p.id === o.productId)
    }))
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  return transactions;
}

function getInwardReport() {
  const products = readJsonFile(PRODUCTS_FILE);
  const inward = readJsonFile(INWARD_STOCK_FILE);

  return inward.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getOutwardReport() {
  const products = readJsonFile(PRODUCTS_FILE);
  const outward = readJsonFile(OUTWARD_STOCK_FILE);

  return outward.map(item => ({
    ...item,
    product: products.find(p => p.id === item.productId)
  })).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getStockMovementReport() {
  const products = readJsonFile(PRODUCTS_FILE);
  const opening = readJsonFile(OPENING_STOCK_FILE);
  const inward = readJsonFile(INWARD_STOCK_FILE);
  const outward = readJsonFile(OUTWARD_STOCK_FILE);

  return products.map(product => {
    const movements = [
      ...opening.filter(o => o.productId === product.id).map(o => ({
        date: o.date,
        type: 'Opening',
        inQty: o.quantity,
        outQty: 0,
        amount: o.amount
      })),
      ...inward.filter(i => i.productId === product.id).map(i => ({
        date: i.date,
        type: 'Inward',
        inQty: i.quantity,
        outQty: 0,
        supplier: i.supplier,
        amount: i.amount
      })),
      ...outward.filter(o => o.productId === product.id).map(o => ({
        date: o.date,
        type: 'Outward',
        inQty: 0,
        outQty: o.quantity,
        customer: o.customer,
        amount: o.amount
      }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      productId: product.id,
      productName: product.productName,
      productCode: product.productCode,
      movements
    };
  }).filter(p => p.movements.length > 0);
}

function getLowStockReport(threshold = 10) {
  const summary = getStockSummary();
  return summary.filter(item => item.closingQty <= threshold);
}

module.exports = {
  initialize,
  getAllProducts,
  addProduct,
  getProductById,
  addOpeningStock,
  getOpeningStock,
  addInwardStock,
  getInwardStock,
  addOutwardStock,
  getOutwardStock,
  getStockSummary,
  getStockByProduct,
  getTransactionHistory,
  getInwardReport,
  getOutwardReport,
  getStockMovementReport,
  getLowStockReport
};
