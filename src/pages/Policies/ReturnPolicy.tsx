import React from "react";

const ReturnPolicy: React.FC = () => {
  return (
    <section className="flex flex-col items-center mb-8">
      <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
      <div className="w-2/3 text-left">
        {" "}
        {/* Set width to 2/3 and align text left */}
        <p className="mt-4 text-justify">
          Our purpose is to guarantee your full satisfaction. If, for any reason
          whatsoever, you are not satisfied with your order, you may exercise
          your right to return purchased products within 7 days from the date on
          which you received them from www.blackwilbur.com.
        </p>
        <p className="mt-4 text-justify">
          ONCE YOUR EXCHANGE/RETURN QUERY HAS BEEN ACCEPTED BY OUR TEAM, A
          NOTIFICATION WILL BE SENT TO YOUR REGISTERED EMAIL AND YOUR ORDER WILL
          BE PICKED UP BY OUR LOGISTICS PARTNER WITHIN 24-48 HOURS. PICK-UP WILL
          BE ATTEMPTED TWICE. IF THE COURIER PARTNER IS UNABLE TO PICK UP THE
          SHIPMENT, YOU WILL HAVE TO SEND THE SHIPMENT BACK TO THE WAREHOUSE
          ADDRESS. PLEASE NOTE THAT ONCE YOUR ORDER HAS BEEN RECEIVED AT THE
          WAREHOUSE, IT WILL GO THROUGH A QUALITY CHECK AND ONCE APPROVED, YOUR
          EXCHANGE/RETURN QUERY WILL BE PROCESSED FURTHER. ESTIMATED DELIVERY OF
          ALL EXCHANGE QUERIES FALL BETWEEN 7-10 WORKING DAYS.
        </p>
        <p className="mt-4 text-justify">
          CANCELLATION OF ORDERS ARE ONLY PERMITTED ON COD ORDERS WHICH WILL BE
          POSSIBLE IF AND TILL THE ORDER HAS NOT BEEN DISPATCHED FROM OUR
          WAREHOUSE. ALL PREPAID ORDERS ARE FINAL. WE DO NOT OFFER ANY
          CANCELLATIONS AND REFUNDS.
        </p>
        <h3 className="font-bold mt-4">EXCHANGE/RETURN OF PRODUCTS:</h3>
        <p className="text-justify">
          YOU MAY INITIATE THE REQUEST OF AN EXCHANGE/RETURN OF A PRODUCT IF:
        </p>
        <ol className="list-decimal ml-8">
          <li>PRODUCT DOES NOT FIT;</li>
          <li>BOTH THE PRODUCT AND SHIPPING PACKAGE HAVE BEEN DAMAGED;</li>
          <li>PRODUCT IS DEFECTIVE;</li>
          <li>PARTS OF THE PRODUCT OR ACCESSORY IS MISSING;</li>
        </ol>
        <h3 className="font-bold mt-4">CONDITIONS FOR EXCHANGE/RETURN:</h3>
        <p className="text-justify">
          YOU CAN EXCHANGE/RETURN THE PRODUCT(S) PURCHASED FROM US PROVIDED THE
          PRODUCT(S) SATISFY THE FOLLOWING MANDATORY CONDITIONS:
        </p>
        <ul className="list-disc ml-8">
          <li>
            THE PRODUCT HAS NOT BEEN WORN, CLEANED, OR TAMPERED WITH BY YOU.
          </li>
          <li>
            THE BRAND TAGS, ORIGINAL PACKAGING MATERIAL, ACCOMPANYING
            ACCESSORIES ARE INTACT AND NOT ALTERED, DAMAGED, OR DISCARDED BY
            YOU.
          </li>
          <li>THE PRODUCT IS NOT ALTERED, UNLESS PROVEN VENDOR DEFECT.</li>
          <li>
            RETURN IS BEING INITIATED AGAINST THE ORDER UNDER WHICH IT WAS
            BOUGHT AND THE PRODUCT MATCHES OUR RECORDS.
          </li>
          <li>
            THERE IS NO FOUL ODOUR, PERFUME, STAINS, DENTS, SCRATCHES, TEARS, OR
            DAMAGE ON THE PRODUCT.
          </li>
        </ul>
        <p className="mt-4 text-justify">
          RETURN OF PURCHASED PRODUCTS ARE FACILITATED THROUGH OUR
          REVERSE-LOGISTICS PARTNERS. ON RECEIPT OF REQUEST FOR RETURN OF
          PRODUCT ON BLACKWILBUR.COM AND THE SAME BEING DULY ACKNOWLEDGED BY US,
          OUR REVERSE-LOGISTICS PARTNERS MAY GET IN TOUCH WITH YOU IN ORDER TO
          COLLECT THE PURCHASED PRODUCTS FROM YOU. WE RESERVE THE RIGHT TO
          REJECT THE EXCHANGE/RETURN REQUEST FOR A PRODUCT IF IT DOES NOT
          SATISFY THE AFOREMENTIONED CONDITIONS.
        </p>
        <p className="mt-4 text-justify">
          The time period for refunding the amount you paid for purchasing the
          returned products depends on the payment type used.
        </p>
        <h3 className="font-bold mt-4">CUSTOMER SUPPORT:</h3>
        <p className="text-justify">
          ANY QUERIES OR CONCERNS RELATING TO THE RETURN AND CANCELLATION MAY BE
          DIRECTED BY YOU TO OUR CUSTOMER SUPPORT TEAM WHO CAN BE CONTACTED AT:
          CALL US AT +91 ——————- OR WRITE TO US AT ———————-.COM.
        </p>
      </div>
    </section>
  );
};

export default ReturnPolicy;