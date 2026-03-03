export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    theme?: {
      color?: string;
    };
  }

  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
}
