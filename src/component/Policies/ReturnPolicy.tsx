import React from "react";

const ReturnPolicy: React.FC = () => {
  return (
    <section className="flex flex-col bg-black text-white items-center">
      <h2 className="text-3xl md:text-4xl sm:text-2xl font-semibold mb-4">
        Return Policy
      </h2>
      <div className="w-5/6 md:w-2/3 text-left">
        <div className="mb-4">
          <p className="mt-4 text-justify text-sm md:text-base">
            Our purpose is to guarantee your full satisfaction. If, for any
            reason whatsoever, you are not satisfied with your order, you may
            exercise your right to return purchased products within 7 days from
            the date on which you received them from www.blackwilbur.com.
          </p>
          <p className="mt-4 text-justify text-sm md:text-base">
            • ONCE YOUR EXCHANGE/RETURN QUERY HAS BEEN ACCEPTED BY OUR TEAM, A
            NOTIFICATION WILL BE SENT TO YOUR REGISTERED EMAIL AND YOUR ORDER
            WILL BE PICKED UP BY OUR LOGISTICS PARTNER WITHIN 24-48 HOURS.{" "}
            <br />
            •PICK-UP WILL BE ATTEMPTED TWICE. IF THE COURIER PARTNER IS UNABLE
            TO PICK UP THE SHIPMENT, YOU WILL HAVE TO SEND THE SHIPMENT BACK TO
            THE WAREHOUSE ADDRESS. <br />• PLEASE NOTE THAT ONCE YOUR ORDER HAS
            BEEN RECEIVED AT THE WAREHOUSE, IT WILL GO THROUGH A QUALITY CHECK
            AND ONCE APPROVED, YOUR EXCHANGE/RETURN QUERY WILL BE PROCESSED
            FURTHER.
            <br />• ESTIMATED DELIVERY OF ALL EXCHANGE QUERIES FALL BETWEEN 7-10
            WORKING DAYS.
          </p>
          <p className="mt-4 text-justify text-sm md:text-base">
            • IF AN EXCHANGE IN SIZE CANNOT BE FULFILLED DUE TO AVAILABILITY OF
            STOCK, WE WILL MAKE SURE TO HAVE THIS EXCHANGED FOR ANOTHER PRODUCT
            OR YOU WILL BE ISSUED A CREDIT NOTE WHICH CAN BE AVAILED ON YOUR
            NEXT ONLINE PURCHASE.
            <br /> • FOR ALL RETURN ORDERS, REFUNDS WILL BE ISSUED IN THE FORM
            OF A CREDIT NOTE ONCE QC ON THE PRODUCT HAS BEEN APPROVED. THIS WILL
            BE SHARED ON YOUR REGISTERED EMAIL ADDRESS. <br />• CANCELLATION OF
            ORDERS ARE ONLY PERMITTED ON COD ORDERS WHICH WILL BE POSSIBLE IF
            AND TILL THE ORDER HAS NOT BEEN DISPATCHED FROM OUR WAREHOUSE. ALL
            PREPAID ORDERS ARE FINAL. WE DO NOT OFFER ANY CANCELLATIONS AND
            REFUNDS.
          </p>
        </div>
        <div className="border-b border-black mb-4" />
        <div className="mb-4">
          <h3 className="font-bold mt-4 mb-3 text-base  md:text-lg">
            EXCHANGE/RETURN OF PRODUCTS:
          </h3>
          <p className="text-justify text-sm md:text-base">
            YOU MAY INITIATE THE REQUEST OF AN EXCHANGE/RETURN OF A PRODUCT IF:
          </p>
          <ol className="list-decimal ml-8 text-sm md:text-base">
            <li>PRODUCT DOES NOT FIT;</li>
            <li>BOTH THE PRODUCT AND SHIPPING PACKAGE HAVE BEEN DAMAGED;</li>
            <li>PRODUCT IS DEFECTIVE;</li>
            <li>PARTS OF THE PRODUCT OR ACCESSORY IS MISSING;</li>
          </ol>
        </div>
        <div className="border-b border-black mb-4" />
        <div className="mb-4">
          <h3 className="font-bold mt-4 text-base mb-3 md:text-lg">
            CONDITIONS FOR EXCHANGE/RETURN:
          </h3>
          <p className="text-justify text-sm md:text-base">
            YOU CAN EXCHANGE/RETURN THE PRODUCT(S) PURCHASED FROM US PROVIDED
            THE PRODUCT(S) SATISFY THE FOLLOWING MANDATORY CONDITIONS:
          </p>
          <ul className="list-disc ml-8 text-sm md:text-base">
            <li>
              THE PRODUCT HAS NOT BEEN WORN, CLEANED OR TAMPERED WITH BY YOU.
              THE BRAND TAGS, ORIGINAL PACKAGING MATERIAL, ACCOMPANYING
              ACCESSORIES ARE INTACT AND NOT ALTERED, DAMAGED OR DISCARDED BY
              YOU.{" "}
            </li>
            <li>
              THE PRODUCT IS NOT ALTERED, UNLESS PROVEN VENDOR DEFECT. RETURN IS
              BEING INITIATED AGAINST THE ORDER UNDER WHICH IT WAS BOUGHT AND
              THE PRODUCT MATCHES OUR RECORDS.
            </li>
            <li>
              THERE IS NO FOUL ODOUR, PERFUME, STAINS, DENTS, SCRATCHES, TEARS
              OR DAMAGE ON THE PRODUCT.
            </li>
            <li>
              RETURN OF PURCHASED PRODUCTS ARE FACILITATED THROUGH OUR
              REVERSE-LOGISTICS PARTNERS. ON RECEIPT OF REQUEST FOR RETURN OF
              PRODUCT ON BLACKWILBUR.COM AND THE SAME BEING DULY ACKNOWLEDGED BY
              US, OUR REVERSE-LOGISTICS PARTNERS MAY GET IN TOUCH WITH YOU IN
              ORDER TO COLLECT THE PURCHASED PRODUCTS FROM YOU.
            </li>
            <li>
              WE RESERVE THE RIGHT TO REJECT THE EXCHANGE/RETURN REQUEST FOR A
              PRODUCT IF IT DOES NOT SATISFY THE AFOREMENTIONED CONDITIONS.
            </li>
          </ul>
          {/* <p className="mt-4 text-justify text-sm md:text-base">
            ONCE THE REFUND REQUEST IS APPROVED, WE WILL REFUND YOUR AMOUNT IN
            2-3 DAYS. THE TIME PERIOD FOR REFUNDING THE AMOUNT YOU PAID FOR
            PURCHASING THE RETURNED PRODUCTS DEPENDS ON THE PAYMENT TYPE USED.
          </p> */}
        </div>
        <div className="border-b border-black mb-4" />
        <div className="mb-4">
          <h3 className="font-bold mt-4 text-base mb-3 md:text-lg">
            CUSTOMER SUPPORT:
          </h3>
          <p className="text-justify text-sm md:text-base">
            ANY QUERIES OR CONCERNS RELATING TO THE RETURN AND CANCELLATION MAY
            BE DIRECTED BY YOU TO OUR CUSTOMER SUPPORT TEAM WHO CAN BE CONTACTED
            AT: WRITE TO US AT Blackwilburofficial@gmail.com 
          </p>
        </div>
        <div className="border-b border-black mb-4" />
      </div>
    </section>
  );
};

export default ReturnPolicy;
