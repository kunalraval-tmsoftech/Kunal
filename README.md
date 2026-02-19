# Stock Maintenance Module

A comprehensive web-based inventory management system for tracking and managing stock operations including Opening Stock, Inward Stock (Purchases), Outward Stock (Sales), and detailed reporting.

## 📋 Features

### Core Modules
- **Products Management**: Add and manage all products with codes and units
- **Opening Stock Entry**: Record initial stock quantities and values
- **Inward Stock Management**: Track all incoming stock/purchases from suppliers
- **Outward Stock Management**: Track all outgoing stock/sales to customers
- **Comprehensive Reporting**: Multiple views including:
  - Stock Summary Report
  - Inward Stock Report
  - Outward Stock Report
  - Stock Movement Report
  - Transaction History
  - Low Stock Alert Report
- **Dashboard**: Quick overview of key metrics and low stock alerts

### Additional Features
- Local JSON file storage (no external database required)
- Print and Export reports to CSV
- User-friendly web interface
- Real-time calculations
- Stock level tracking and alerts

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Navigate to project directory**
   ```bash
   cd /workspaces/Kunal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Open your browser and go to: `http://localhost:3000`

## 📁 Project Structure

```
Kunal/
├── backend/
│   └── database.js          # Database operations and data management
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── styles.css           # CSS styles and responsive design
│   └── script.js            # JavaScript logic and API calls
├── data/                    # JSON data storage
│   ├── products.json
│   ├── opening_stock.json
│   ├── inward_stock.json
│   └── outward_stock.json
├── server.js                # Express server and API routes
├── package.json             # Node.js dependencies
└── README.md               # This file
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product

### Opening Stock
- `GET /api/opening-stock` - Get opening stock records
- `POST /api/opening-stock` - Add opening stock entry

### Inward Stock
- `GET /api/inward-stock` - Get inward stock records
- `POST /api/inward-stock` - Add inward stock entry

### Outward Stock
- `GET /api/outward-stock` - Get outward stock records
- `POST /api/outward-stock` - Add outward stock entry

### Reports
- `GET /api/reports/stock-summary` - Stock summary report
- `GET /api/reports/inward` - Inward stock report
- `GET /api/reports/outward` - Outward stock report
- `GET /api/reports/movement` - Stock movement report
- `GET /api/reports/transaction-history` - Transaction history
- `GET /api/reports/low-stock?threshold=10` - Low stock items (threshold in quantity)
- `GET /api/reports/stock/:productId` - Stock details for specific product

## 📖 Usage Guide

### Adding a Product
1. Navigate to "Products" from the sidebar
2. Fill in Product Name, Code, and Unit
3. Click "Add Product"

### Opening Stock Entry
1. Go to "Opening Stock Entry"
2. Select a product from the dropdown
3. Enter quantity, rate, and date
4. Click "Add Opening Stock"

### Inward Stock (Purchase)
1. Go to "Inward Stock"
2. Select product, enter quantity, rate
3. Add supplier name (optional)
4. Click "Add Inward Stock"

### Outward Stock (Sales)
1. Go to "Outward Stock"
2. Select product, enter quantity, rate
3. Add customer name (optional)
4. Click "Add Outward Stock"

### Viewing Reports
1. Click "Reports" in the sidebar to expand sub-menu
2. Select desired report type:
   - **Stock Summary**: Overall stock position
   - **Inward Report**: All purchases made
   - **Outward Report**: All sales made
   - **Stock Movement**: Detailed movement of each product
   - **Transaction History**: Chronological view of all transactions
   - **Low Stock Alert**: Items below threshold quantity
3. Click "Print" or "Export CSV" as needed

## 💾 Data Storage

The application uses JSON files for local storage positioned in the `data/` directory:
- All data is stored locally on the server
- No external database required
- Easy to backup (simply copy the data folder)
- Edit data files using any text editor if needed

## 🎯 Key Features Explained

### Stock Summary Report
Shows opening quantity, inward quantity, outward quantity, and closing quantity for each product along with monetary values.

### Dashboard
Displays:
- Total number of products
- Total values for opening, inward, and outward stock
- List of items below stock threshold (configurable)

### Low Stock Alert
Helps identify products that need reordering. Default threshold is 10 units (customizable via query parameter).

## 🛠️ Development

To run in development mode with auto-reload:

```bash
npm run dev
```

(Requires nodemon to be installed)

## 📝 License

This project is provided as-is for inventory management purposes.

## 📞 Support

For issues or feature requests, please contact the development team.
