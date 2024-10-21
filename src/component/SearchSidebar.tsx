// import React, { useState } from "react";
// import { fetchSearchResults } from "../services/api";
// import { ProductResponse } from "../utiles/types";
// import { useNavigate } from "react-router-dom";

// const Searchbar: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [results, setResults] = useState<ProductResponse>([]);
//   const navigate = useNavigate();

//   const handleNavigate = (id: number) => {
//     navigate(`/product/${id}`);
//   };

// const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const term = e.target.value;
//   setSearchTerm(term);
//   setShowModal(term.length > 0);

//   if (term) {
//     const fetchedResults = await fetchSearchResults(term);
//     if (fetchedResults) {
//       setResults(fetchedResults);
//     }
//   } else {
//     setResults([]);
//   }
//   };

//   const handleFocus = () => {
//     setShowModal(searchTerm.length > 0);
//   };

//   const handleBlur = () => {
//     setTimeout(() => {
//       setShowModal(false);
//     }, 100);
//   };

//   return (
//     <div className="relative w-full">
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={handleInputChange}
//         onFocus={handleFocus}
//         onBlur={handleBlur}
//         className="border border-gray-300 rounded-lg p-2 w-full text-black"
//         placeholder="Search for products..."
//       />
//       {showModal && (
//         <div className="absolute left-0 z-50 w-full max-w-xs bg-white shadow-lg border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
//           <div className="p-2">
//             {results.length > 0 ? (
//               results.map((product) => (
//                 <p
//                   key={product.id}
//                   onClick={() => handleNavigate(product.id)}
//                   className="text-black cursor-pointer hover:bg-gray-100 py-1 text-center"
//                 >
//                   {product.name} - ${product.price}
//                 </p>
//               ))
//             ) : (
//               <p className="text-black py-2 text-center">No results found</p>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Searchbar;

//❌❌❌❌❌❌
import React, { useEffect, useState } from "react";
import { fetchSearchResults } from "../services/api";
import { Product } from "../utiles/types";
import { MdClose } from "react-icons/md";

interface SearchSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setQuery(term);

    if (term) {
      const fetchedResults = await fetchSearchResults(term);
      if (fetchedResults) {
        setResults(fetchedResults);
      }
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <div
        style={{
          transition: "transform 0.5s ease-in-out",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        className="fixed top-0 left-0 w-72 h-full bg-[#141414] text-white shadow-lg p-4 z-[70]"
      >
        <button onClick={toggleSidebar} className="text-white text-xl border rounded-full">
          <MdClose />
        </button>
        <h2 className="text-lg font-bold mb-2">Search</h2>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="border border-gray-300 rounded p-2 w-full mb-2 text-black"
        />
        {results.length > 0 && (
          <ul className="mt-4">
            {results.map((product) => (
              <li key={product.id} className="border-b py-2">
                {product.name} - ${product.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SearchSidebar;
