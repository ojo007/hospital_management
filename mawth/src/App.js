import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

// Layouts
import { AdminLayout } from './components/layouts/AdminLayout';
import { StoreOfficerLayout } from './components/layouts/StoreOfficerLayout';
import { SalesLayout } from './components/layouts/SalesLayout';
import { AccountantLayout } from './components/layouts/AccountantLayout';

// Common Components
import LoginPage from './components/admin/LoginPage';
import RoleBasedRoute from './components/RoleBasedRoute';
import ProfilePage from './components/admin/profile/ProfilePage';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import ManageUsersPage from './components/admin/UserPage/ManageUsersPage';
import CreateUserPage from './components/admin/UserPage/CreateUserPage';
import ViewUsersPage from './components/admin/UserPage/ViewUsersPage';
import ManageDepartmentPage from './components/admin/department/ManageDepartmentPage';
import AddDepartmentPage from './components/admin/department/AddDepartmentPage';
import ViewDepartmentsPage from './components/admin/department/ViewDepartmentsPage';
import ProductsServicesPage from './components/admin/ProductsServicesPage/ProductsServicesPage';
import ProductsPage from './components/admin/ProductsServicesPage/OurProducts/ProductsPage';
import AddProductPage from './components/admin/ProductsServicesPage/OurProducts/AddProductPage';
import ServicesPage from './components/admin/ProductsServicesPage/OurServices/ServicesPage';
import AddServicePage from './components/admin/ProductsServicesPage/OurServices/AddServicePage';
import ProductCategoriesPage from './components/admin/ProductsServicesPage/ProductCategories/ProductCategoriesPage';
import AddProductCategoryPage from './components/admin/ProductsServicesPage/ProductCategories/AddProductCategoryPage';
import SaleServicesPage from './components/admin/SalesService/SaleServicesPage';
import DepartmentsServicesPage from './components/admin/DepartmentServices/DepartmentsServicesPage';
import ReportsPage from './components/admin/ReportsPage/ReportsPage';
import PharmacyServiceInvoice from './components/admin/SalesService/PharmacyService/PharmacyServiceInvoice';
import SellNowPage from './components/admin/SalesService/SellNow/SellNowPage';
import ServicePayPage from './components/admin/SalesService/ServicePay/ServicePayPage';
import ProductsItemsSalesPage from './components/admin/SalesService/ProductsItemsSalesPage';
import ServicesPaymentsPage from './components/admin/SalesService/ServicesPaymentsPage';
import SearchInvoicePage from './components/admin/SalesService/SearchInvoicePage';
import ItemsInStocksPage from './components/admin/DepartmentServices/ItemsInStocksPage';
import ActivityLogsPage from './components/admin/ActivityLogs/ActivityLogsPage';
import SalesReportPage from './components/admin/ReportsPage/SalesReportPage';


// Store Officer Components
import StoreDashboard from './components/StoreOfficer/Dashboard';
import ManageItemsPage from './components/StoreOfficer/ManageItems/ManageItemsPage';


// Sales Staff Components
import SalesDashboard from './components/SalesStaff/Dashboard';
import SalesProductsServicesPage from './components/SalesStaff/ProductsServices/ProductsServicesPage';
import SalesSearchInvoicePage from './components/SalesStaff/SearchInvoicePage';
import SalesSellNowPage from './components/SalesStaff/SellNowPage';
import SalesServicePayPage from './components/SalesStaff/ServicePayPage';
import SalesPharmacyServicesPage from './components/SalesStaff/PharmacyServicesPage';
import SalesProductsItemsSalesPage from './components/SalesStaff/ProductsItemsSalesPage';
import SalesServicesPaymentsPage from './components/SalesStaff/ServicesPaymentsPage';
import SalesReportsPage from './components/SalesStaff/reports/ReportsPage';


// Accountant Components


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RoleBasedRoute>
          } />

          <Route path="/manage-users/*" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<ManageUsersPage />} />
                  <Route path="add" element={<CreateUserPage />} />
                  <Route path="view" element={<ViewUsersPage />} />
                </Routes>
              </AdminLayout>
            </RoleBasedRoute>
          } />

          <Route path="/manage-department/*" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<ManageDepartmentPage />} />
                  <Route path="add" element={<AddDepartmentPage />} />
                  <Route path="view" element={<ViewDepartmentsPage />} />
                </Routes>
              </AdminLayout>
            </RoleBasedRoute>
          } />

          <Route path="/products-services/*" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<ProductsServicesPage />} />
                  <Route path="our-products" element={<ProductsPage />} />
                  <Route path="our-products/add" element={<AddProductPage />} />
                  <Route path="our-services" element={<ServicesPage />} />
                  <Route path="our-services/add" element={<AddServicePage />} />
                  <Route path="categories" element={<ProductCategoriesPage />} />
                  <Route path="categories/add" element={<AddProductCategoryPage />} />
                </Routes>
              </AdminLayout>
            </RoleBasedRoute>
          } />

          <Route path="/sales-services/*" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<SaleServicesPage />} />
                  <Route path="pharmacy" element={<PharmacyServiceInvoice />} />
                  <Route path="sell-now" element={<SellNowPage />} />
                  <Route path="service-pay" element={<ServicePayPage />} />
                  <Route path="product-sales" element={<ProductsItemsSalesPage />} />
                  <Route path="services-payments" element={<ServicesPaymentsPage />} />
                  <Route path="search-invoice" element={<SearchInvoicePage />} />
                </Routes>
              </AdminLayout>
            </RoleBasedRoute>
          } />

          <Route path="/departments-services/*" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<DepartmentsServicesPage />} />
                  <Route path="current-stock" element={<ItemsInStocksPage />} />
                </Routes>
              </AdminLayout>
            </RoleBasedRoute>
          } />

          <Route path="/activity-logs" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <ActivityLogsPage />
              </AdminLayout>
            </RoleBasedRoute>
          } />

          <Route path="/reports/*" element={
            <RoleBasedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <Routes>
                  <Route index element={<ReportsPage />} />
                  <Route path="sales" element={<SalesReportPage />} />
                </Routes>
              </AdminLayout>
            </RoleBasedRoute>
          } />

          

          {/* Store Officer Routes */}
          <Route path="/store/*" element={
            <RoleBasedRoute allowedRoles={['STORE OFFICER']}>
              <StoreOfficerLayout>
                <Routes>
                  <Route path="dashboard" element={<StoreDashboard />} />
                  <Route path="manage-items" element={<ManageItemsPage />} />
                </Routes>
              </StoreOfficerLayout>
            </RoleBasedRoute>
          } />



          {/* Sales Staff Routes */}
          <Route path="/sales/*" element={
            <RoleBasedRoute allowedRoles={['SALES POINT STAFF']}>
              <SalesLayout>
                <Routes>
                  <Route path="dashboard" element={<SalesDashboard />} />
                  <Route path="products-services" element={<SalesProductsServicesPage />} />
                  <Route path="products-services/our-products/add" element={<AddProductPage />} />
                  <Route path="products-services/our-services/add" element={<AddServicePage />} />
                  <Route path="search-invoice" element={<SalesSearchInvoicePage />} />
                  <Route path="sell-now" element={<SellNowPage />} />
                  <Route path="service-pay" element={<ServicePayPage />} />
                  <Route path="pharmacy-services" element={<SalesPharmacyServicesPage />} />
                  <Route path="products-items-sales" element={<SalesProductsItemsSalesPage />} />
                  <Route path="services-payments" element={<SalesServicesPaymentsPage />} />
                  <Route path="reports" element={<SalesReportsPage />} />
                </Routes>
              </SalesLayout>
            </RoleBasedRoute>
          } />


          {/* Profile route - accessible by all roles */}
          <Route path="/profile" element={
            <RoleBasedRoute allowedRoles={['ADMIN', 'STORE OFFICER', 'SALES POINT STAFF', 'ACCOUNTANT']}>
              <AdminLayout>
                <ProfilePage />
              </AdminLayout>
            </RoleBasedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;