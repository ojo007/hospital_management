import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import AdminDropdown from '../../profile/AdminDropdown';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Update this endpoint to match your backend route
      const response = await axios.get('http://127.0.0.1:8000/products');

      // Transform data to ensure uppercase for consistency
      const formattedProducts = response.data.map(product => ({
        ...product,
        name: product.name.toUpperCase(),
        category: product.category.toUpperCase()
      }));

      setProducts(formattedProducts);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  const handleAddNewProduct = () => {
    navigate('/products-services/our-products/add');
  };

  const handleEditProduct = (productId) => {
    // TODO: Implement edit product functionality
    console.log('Edit product:', productId);
  };

  const handleDeleteProduct = async (productId) => {
    // TODO: Implement delete product functionality
    console.log('Delete product:', productId);
  };

  // Export functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products_export.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "products_export.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Category", "Selling Price", "Wholesale Price", "Weight", "Status"];
    const tableRows = products.map(product => [
      product.name,
      product.category,
      product.selling_price,
      product.wholesale_price,
      product.weight,
      product.status
    ]);

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Products Report", 14, 15);
    doc.save("products_export.pdf");
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Products</h1>
        <button
          onClick={handleAddNewProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Export and Search Section */}
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <button onClick={exportToExcel} className="border px-3 py-1 rounded hover:bg-gray-100">Excel</button>
            <button onClick={exportToCSV} className="border px-3 py-1 rounded hover:bg-gray-100">CSV</button>
            <button onClick={exportToPDF} className="border px-3 py-1 rounded hover:bg-gray-100">PDF</button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-1 rounded w-64"
          />
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">S/N</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Weight</th>
                <th className="p-3 text-left">Critical Level</th>
                <th className="p-3 text-left">Expiry Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">₦{product.price}</td>
                  <td className="p-3">{product.weight}</td>
                  <td className="p-3">{product.critical_level || 'N/A'}</td>
                  <td className="p-3">{product.expiry_date ? new Date(product.expiry_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      product.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product.product_id)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.product_id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;