import React, { useState } from "react";
import { fetchSearchResults } from "../services/api"; 
import { ProductResponse } from "../utiles/types"; 
import { useNavigate } from "react-router-dom";

const Searchbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [results, setResults] = useState<ProductResponse>([]); 
  const navigate = useNavigate();

  const handleNavigate = (id: number) => {
    navigate(`/product/${id}`); 
  };
  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowModal(term.length > 0); 

    if (term) {
      const fetchedResults = await fetchSearchResults(term); 
      if (fetchedResults) {
        setResults(fetchedResults); 
      }
    } else {
      setResults([]); 
    }
  };

  const handleFocus = () => {
    setShowModal(searchTerm.length > 0); 
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowModal(false);
    }, 100);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="border border-gray-300 rounded-lg p-2 w-full text-black"
        placeholder="Search for products..."
      />
      {showModal && (
        <div className="absolute left-0 z-50 w-full max-w-xs bg-white shadow-lg border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
          <div className="p-2">
            {results.length > 0 ? (
              results.map((product) => (
                <p
                  key={product.id}
                  onClick={() => handleNavigate(product.id)} 
                  className="text-black cursor-pointer hover:bg-gray-100 py-1 text-center"
                >
                  {product.name} - ${product.price}
                </p>
              ))
            ) : (
              <p className="text-black py-2 text-center">No results found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
