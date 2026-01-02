export default function Paywall() {
  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded w-full max-w-md mt-4">
      <p className="font-semibold text-center mb-2">
        Pay 1 Token to Play
      </p>
      <a
        href={`https://www.paypal.com/paypalme/denouluster`}
        target="_blank"
        className="block text-center bg-blue-600 text-white py-2 rounded"
      >
        Pay with PayPal
      </a>
    </div>
  );
}
