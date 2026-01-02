import { useEffect } from "react";

export default function PayPalButton({ amount = "1.00", onSuccess }) {
  useEffect(() => {
    if (!window.paypal) return;

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color:  'gold',
        shape:  'rect',
        label:  'paypal'
      },
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert("Transaction completed by " + details.payer.name.given_name);
          if(onSuccess) onSuccess(details);
        });
      },
      onError: function(err) {
        console.error(err);
        alert("Payment failed, try again.");
      }
    }).render('#paypal-button-container');
  }, []);

  return <div id="paypal-button-container"></div>;
}
