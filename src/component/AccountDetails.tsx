import React, { useEffect, useState } from "react";

const AccountDetails: React.FC = () => {
  const [accountDetails, setAccountDetails] = useState<any | null>(null);

  useEffect(() => {
    // Fetch account details from localStorage
    const storedDetails = localStorage.getItem("user");
    if (storedDetails) {
      setAccountDetails(JSON.parse(storedDetails));
    }
  }, []);

  return (
    <div className="text-left">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Account Details
      </h2>
      {accountDetails ? (
        <div className="space-y-2">
          {Object.entries(accountDetails)
            .filter(([key]) => key !== "id") // Exclude the 'id' field
            .map(([key, value]: [string, any]) => (
              <p key={key} className="text-white">
                <span className="font-semibold capitalize">{key.replace("_", " ")}:</span>{" "}
                {typeof value === "object" ? JSON.stringify(value) : value.toString()}
              </p>
            ))}
        </div>
      ) : (
        <p>Loading account details...</p>
      )}
    </div>
  );
};

export default AccountDetails;
