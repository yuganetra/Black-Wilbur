import React from "react";
import { NewGetOrder } from "../../utiles/types";
import { HiX } from 'react-icons/hi';

interface OrderDetailsPopupProps {
  order: NewGetOrder;
  onClose: () => void;
}
const OrderDetailsPopup: React.FC<OrderDetailsPopupProps> = ({
  order,
  onClose,
}) => {
  console.log("order",order)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg w-full md:w-3/4 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">
            Order Details: {order.order_id}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-500 transition duration-300"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Order Information (Mobile: Stacked, Desktop: Table) */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg md:hidden text-left">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold">User:</span>
                <span>{order.user_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Shipping Address:</span>
                <span className="text-right">{order.shipping_address.address_line1}, {order.shipping_address.city}, {order.shipping_address.state}, {order.shipping_address.zipcode}, {order.shipping_address.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Phone:</span>
                <span>{order.phone_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Status:</span>
                <span>{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Payment Status:</span>
                <span>{order.payment_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Discount Coupon Applied:</span>
                <span>{order.discount_coupon_applied}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Subtotal Amount:</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Discount Amount:</span>
                <span>₹{order.discount_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Total Amount:</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          <table className="min-w-full bg-gray-800 text-sm rounded-lg overflow-hidden shadow-md text-left hidden md:table">
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">User:</td>
                <td className="py-2 px-4 border-b">{order.user_name}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Phone:</td>
                <td className="py-2 px-4 border-b">{order.phone_number}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Shipping Address:</td>
                <td className="py-2 px-4 border-b">
                  {`${order.shipping_address.address_line1}, ${order.shipping_address.city}, ${order.shipping_address.state}, ${order.shipping_address.zipcode}, ${order.shipping_address.country}`}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Status:</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Payment Status:</td>
                <td className="py-2 px-4 border-b">{order.payment_status}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Discount Code:</td>
                <td className="py-2 px-4 border-b">{order.discount_coupon_applied}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Subtotal Amount:</td>
                <td className="py-2 px-4 border-b">₹{order.subtotal}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Total Discount:</td>
                <td className="py-2 px-4 border-b">₹{order.discount_amount}</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b text-left font-bold">Total Amount:</td>
                <td className="py-2 px-4 border-b">₹{order.total_amount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg md:text-xl font-bold mb-4">Order Items:</h3>
        
        {/* Mobile Order Items View */}
        <div className="md:hidden space-y-4">
          {order.items.map((item, index) => (
            <div 
              key={index} 
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{item.product.name}</p>
                <p className="text-sm text-gray-400">
                  Size: {item.product_variation.size} | Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p>₹{item.price} each</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Order Items Table */}
        <table className="min-w-full bg-gray-800 text-sm rounded-lg overflow-hidden shadow-md hidden md:table">
          <thead className="bg-gray-700">
            <tr>
              <th className="py-2 px-4 border-b text-left">Product</th>
              <th className="py-2 px-4 border-b text-left">Size</th>
              <th className="py-2 px-4 border-b text-left">Quantity</th>
              <th className="py-2 px-4 border-b text-left">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"}>
                <td className="py-2 px-4 border-b text-left">{item.product.name}</td>
                <td className="py-2 px-4 border-b text-left">{item.product_variation.size}</td>
                <td className="py-2 px-4 border-b text-left">{item.quantity}</td>
                <td className="py-2 px-4 border-b text-left">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-6 md:hidden">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-500 transition duration-300 w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPopup;