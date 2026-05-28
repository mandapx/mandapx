<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Razorpay\Api\Api;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount'     => 'required|numeric|min:1',
        ]);

        $booking = $request->user()->bookings()
            ->where('id', $data['booking_id'])
            ->firstOrFail();

        $razorpay = new Api(config('services.razorpay.key_id'), config('services.razorpay.key_secret'));

        $order = $razorpay->order->create([
            'receipt'  => $booking->booking_number,
            'amount'   => (int) round($data['amount'] * 100),
            'currency' => 'INR',
        ]);

        $payment = Payment::create([
            'booking_id'      => $booking->id,
            'user_id'         => $request->user()->id,
            'amount'          => $data['amount'],
            'currency'        => 'INR',
            'type'            => 'deposit',
            'gateway'         => 'razorpay',
            'gateway_order_id'=> $order['id'],
            'status'          => 'pending',
        ]);

        return response()->json([
            'order_id'   => $order['id'],
            'amount'     => $order['amount'],
            'currency'   => $order['currency'],
            'payment_id' => $payment->id,
            'key'        => config('services.razorpay.key_id'),
        ]);
    }

    public function verify(Request $request)
    {
        $data = $request->validate([
            'razorpay_order_id'   => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature'  => 'required|string',
        ]);

        $payment = Payment::where('gateway_order_id', $data['razorpay_order_id'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $generatedSignature = hash_hmac(
            'sha256',
            $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'],
            config('services.razorpay.key_secret')
        );

        if ($generatedSignature !== $data['razorpay_signature']) {
            $payment->update(['status' => 'failed', 'gateway_response' => $data]);
            return response()->json(['message' => 'Payment verification failed'], 422);
        }

        $payment->update([
            'status'             => 'paid',
            'gateway_payment_id' => $data['razorpay_payment_id'],
            'gateway_signature'  => $data['razorpay_signature'],
            'gateway_response'   => $data,
        ]);

        $payment->booking->update(['status' => 'confirmed', 'confirmed_at' => now()]);

        return response()->json(['message' => 'Payment verified successfully', 'payment' => $payment]);
    }
}
