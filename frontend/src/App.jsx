import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Master from './pages/Master';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Items from './pages/Items';
import AddItem from './pages/AddItem';
import AllInvoices from './pages/AllInvoices';
import InvoiceDetail from './pages/InvoiceDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/master" element={<Master />} />
            <Route path="/master/customers" element={<Customers />} />
            <Route path="/master/customers/add" element={<AddCustomer />} />
            <Route path="/master/items" element={<Items />} />
            <Route path="/master/items/add" element={<AddItem />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/invoices" element={<AllInvoices />} />
            <Route path="/invoice/:invoiceId" element={<InvoiceDetail />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}