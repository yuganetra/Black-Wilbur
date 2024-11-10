import React, { useState, useEffect } from 'react';
import { Discount } from '../utiles/types';  // Adjust path as necessary
import { getDiscounts, createDiscount, deleteDiscount } from '../services/api';  // Adjust path as necessary

const DiscountManage: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    id: '',
    coupon: '',
    percent_discount: 0,
    min_order_price: 0,
    discount_type: 'COUPON',
    quantity_threshold: undefined,
    created_at: '',
    updated_at: '',
  });

  // Fetch all discounts when the component mounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const discountData = await getDiscounts({});
        setDiscounts(discountData);
      } catch (error) {
        console.error('Failed to fetch discounts', error);
      }
    };
    fetchDiscounts();
  }, []);

  // Handle discount creation
  const handleCreateDiscount = async () => {
    try {
      const createdDiscount = await createDiscount(newDiscount);
      setDiscounts((prevDiscounts) => [...prevDiscounts, createdDiscount]);
      resetForm();
    } catch (error) {
      console.error('Error creating discount', error);
    }
  };

  // Handle discount deletion
  const handleDeleteDiscount = async (id: string) => {
    try {
      await deleteDiscount(id);
      setDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount.id !== id));
    } catch (error) {
      console.error('Error deleting discount', error);
    }
  };

  // Reset form fields after creating a discount
  const resetForm = () => {
    setNewDiscount({
      id: '',
      coupon: '',
      percent_discount: 0,
      min_order_price: 0,
      discount_type: 'COUPON',
      quantity_threshold: undefined,
      created_at: '',
      updated_at: '',
    });
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Discount Management</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-4">Create New Discount</h2>
        <div className="space-y-4">
          {/* Coupon Code or Quantity Threshold */}
          {newDiscount.discount_type === 'COUPON' ? (
            <div>
              <label htmlFor="coupon" className="block text-sm font-medium">Coupon Code</label>
              <input
                id="coupon"
                type="text"
                value={newDiscount.coupon}
                onChange={(e) => setNewDiscount({ ...newDiscount, coupon: e.target.value })}
                placeholder="Enter Coupon Code"
                className="border border-gray-300 p-2 w-full bg-black text-white"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="quantity_threshold" className="block text-sm font-medium">Quantity Threshold</label>
              <input
                id="quantity_threshold"
                type="number"
                value={newDiscount.quantity_threshold ?? ''}
                onChange={(e) => setNewDiscount({ ...newDiscount, quantity_threshold: Number(e.target.value) })}
                placeholder="Enter Quantity Threshold"
                className="border border-gray-300 p-2 w-full bg-black text-white"
              />
            </div>
          )}

          {/* Discount Percentage */}
          <div>
            <label htmlFor="percent_discount" className="block text-sm font-medium">Discount Percentage</label>
            <input
              id="percent_discount"
              type="number"
              value={newDiscount.percent_discount}
              onChange={(e) => setNewDiscount({ ...newDiscount, percent_discount: Number(e.target.value) })}
              placeholder="Enter Discount Percentage"
              className="border border-gray-300 p-2 w-full bg-black text-white"
            />
          </div>

          {/* Minimum Order Price */}
          <div>
            <label htmlFor="min_order_price" className="block text-sm font-medium">Minimum Order Price</label>
            <input
              id="min_order_price"
              type="number"
              value={newDiscount.min_order_price}
              onChange={(e) => setNewDiscount({ ...newDiscount, min_order_price: Number(e.target.value) })}
              placeholder="Enter Minimum Order Price"
              className="border border-gray-300 p-2 w-full bg-black text-white"
            />
          </div>

          {/* Discount Type Toggle */}
          <div>
            <label className="block text-sm font-medium">Discount Type</label>
            <div className="flex items-center space-x-4">
              <label>
                <input
                  type="radio"
                  name="discount_type"
                  value="COUPON"
                  checked={newDiscount.discount_type === 'COUPON'}
                  onChange={() => setNewDiscount({ ...newDiscount, discount_type: 'COUPON' })}
                  className="mr-2"
                />
                Coupon
              </label>
              <label>
                <input
                  type="radio"
                  name="discount_type"
                  value="QUANTITY"
                  checked={newDiscount.discount_type === 'QUANTITY'}
                  onChange={() => setNewDiscount({ ...newDiscount, discount_type: 'QUANTITY' })}
                  className="mr-2"
                />
                Quantity
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button onClick={handleCreateDiscount} className="bg-green-500 text-white p-2 rounded">
              Create Discount
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96">
        <h2 className="text-xl font-bold mb-4">Existing Discounts</h2>
        {discounts.length === 0 ? (
          <p>No discounts available.</p>
        ) : (
          <table className="min-w-full bg-black text-white border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Discount Type</th>
                <th className="py-2 px-4 border-b">Coupon/Quantity</th>
                <th className="py-2 px-4 border-b">Discount %</th>
                <th className="py-2 px-4 border-b">Min Order Price</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="py-2 px-4 border-b">{discount.discount_type}</td>
                  <td className="py-2 px-4 border-b">{discount.coupon || `Buy ${discount.quantity_threshold} Get ${discount.percent_discount}%`}</td>
                  <td className="py-2 px-4 border-b">{discount.percent_discount}%</td>
                  <td className="py-2 px-4 border-b">{discount.min_order_price}</td>
                  <td className="py-2 px-4 border-b">
                    <button onClick={() => handleDeleteDiscount(discount.id)} className="bg-red-500 text-white p-2 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DiscountManage;
