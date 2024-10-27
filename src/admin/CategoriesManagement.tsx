import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../services/api';
import { Category } from '../utiles/types';

const CategoriesManagement: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);

  const handleAddCategory = async () => {
    if (categoryName.trim() && categoryDescription.trim()) {
      try {
        const newCategory = await addCategory(categoryName, categoryDescription);
        setCategories([...categories, newCategory]);
        setIsModalOpen(false);
        fetchData();
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleEditCategory = async () => {
    if (categoryName.trim() && categoryDescription.trim() && currentCategoryId) {
      try {
        const updatedCategory = await updateCategory(currentCategoryId, categoryName, categoryDescription);
        setCategories(categories.map(category => category.id === currentCategoryId ? updatedCategory : category));
        setIsEditModalOpen(false);
        fetchData();
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const fetchData = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4 text-left">Category Management</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gray-800 text-white p-2 rounded mb-4 hover:bg-gray-700 transition duration-200"
      >
        Add Category
      </button>

      <div className="overflow-x-auto">
        <table className="table-auto w-full mt-4 border border-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="border border-white p-2">Category Name</th>
              <th className="border border-white p-2">Description</th>
              <th className="border border-white p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="hover:bg-gray-700">
                <td className="border border-white p-2 text-left">{category.name}</td>
                <td className="border border-white p-2 text-left">{category.description}</td>
                <td className="border border-white p-2 flex space-x-2">
                  <button
                    className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition duration-200"
                    onClick={() => {
                      setCurrentCategoryId(category.id);
                      setCategoryName(category.name);
                      setCategoryDescription(category.description);
                      setIsEditModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition duration-200"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding category */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-left">Add New Category</h2>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              className="border p-2 mb-2 w-full bg-gray-700 text-white rounded"
            />
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Short Description"
              className="border p-2 mb-4 w-full bg-gray-700 text-white rounded"
              rows={3}
            />
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-800 text-white p-2 rounded mr-2 hover:bg-gray-700 transition duration-200">
                Cancel
              </button>
              <button onClick={handleAddCategory} className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition duration-200">
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for editing category */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-left">Edit Category</h2>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category Name"
              className="border p-2 mb-2 w-full bg-gray-700 text-white rounded"
            />
            <textarea
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Short Description"
              className="border p-2 mb-4 w-full bg-gray-700 text-white rounded"
              rows={3}
            />
            <div className="flex justify-end">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-800 text-white p-2 rounded mr-2 hover:bg-gray-700 transition duration-200">
                Cancel
              </button>
              <button onClick={handleEditCategory} className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition duration-200">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
