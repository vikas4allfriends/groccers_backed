import Razorpay from 'razorpay';

console.log('process.env.RAZORPAY_KEY_ID==', process.env.RAZORPAY_KEY_ID)
export const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_BE2M8fbsv2DTX1', // Your Razorpay Key ID
    key_secret: 'yafQ6XEZJ4Csji3XSP1OHkWh', // Your Razorpay Key Secret
});