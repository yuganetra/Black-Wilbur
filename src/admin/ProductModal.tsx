import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import { Product, ProductVariation, productImage, Category } from '../utiles/types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productImages, setProductImages] = useState<productImage[]>([]);
  const [productCategory, setProductCategory] = useState<Category | null>(null);
  const [sizes, setSizes] = useState<ProductVariation[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [quantityInput, setQuantityInput] = useState(0);

  const handleAddSize = () => {
    if (quantityInput > 0) {
      const newSize: ProductVariation = { id: sizes.length + 1, size: selectedSize, quantity: quantityInput };
      setSizes([...sizes, newSize]);
      setQuantityInput(0);
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter(size => size.size !== sizeToRemove));
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: 0, // Handle ID generation as needed
      name: productName,
      price: productPrice,
      description: productDescription,
      product_images: productImages,
      sizes,
      rating: 0, // Initialize with default rating if needed
      category: productCategory as Category,
    };
    onAddProduct(newProduct);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-6 rounded shadow-md w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] h-auto max-h-[90vh] overflow-auto mt-16">
            <h2 className="text-xl font-bold mb-4 text-white">Add Product</h2>
            <label className="text-white" htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter Product Name"
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />
            
            <label className="text-white" htmlFor="productDescription">Product Description</label>
            <input
              id="productDescription"
              type="text"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Enter Product Description"
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />
            
            <label className="text-white" htmlFor="productPrice">Product Price</label>
            <input
              id="productPrice"
              type="text"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              placeholder="Enter Product Price"
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />
            
            <label className="text-white" htmlFor="productCategory">Product Category</label>
            <input
              id="productCategory"
              type="text"
              value={productCategory ? productCategory.name : ''}
              onChange={(e) => setProductCategory({ id: 0, name: e.target.value, description: '' })}
              placeholder="Enter Product Category"
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />
            
            <label className="text-white" htmlFor="productImage">Product Image</label>
            <input
              id="productImage"
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  const newImage: productImage = {
                    id: productImages.length + 1,
                    image: URL.createObjectURL(file),
                    product_id: 0, // This should be updated according to actual product ID
                  };
                  setProductImages([...productImages, newImage]);
                }
              }}
              className="border border-white text-white bg-transparent p-2 w-full mb-2"
            />
            {productImages.map((img, idx) => (
              <img key={idx} src={img.image} alt={`Product Preview ${idx}`} className="w-20 h-20 mb-2" />
            ))}
            
            <div className="mb-4 flex flex-col sm:flex-row items-center">
              <label className="text-white mr-2" htmlFor="sizeSelect">Select Size</label>
              <select
                id="sizeSelect"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border border-white text-white bg-transparent p-2 mb-2 sm:mb-0 sm:mr-2"
              >
                <option className='text-black' value="S">S</option>
                <option className='text-black' value="M">M</option>
                <option className='text-black' value="L">L</option>
                <option className='text-black' value="XL">XL</option>
                <option className='text-black' value="XXL">XXL</option>
              </select>
              <input
                type="text"
                value={quantityInput}
                onChange={(e) => setQuantityInput(Number(e.target.value))}
                placeholder="Quantity"
                className="border border-white text-white bg-transparent p-2 mb-2 sm:mb-0 sm:mr-2"
              />
              <button onClick={handleAddSize} className="bg-white text-black p-2 rounded">
                Add Size
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">Sizes</h2>
              <ul className="text-white">
                {sizes.map((size, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {size.size} - {size.quantity}
                    <button 
                      onClick={() => handleRemoveSize(size.size)} 
                      className="text-red-500 ml-2"
                    >
                      <RxCross2 />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <button onClick={handleAddProduct} className="bg-white text-black p-2 rounded mr-2">
                Add Product
              </button>
              <button onClick={onClose} className="bg-red-500 text-white p-2 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;
