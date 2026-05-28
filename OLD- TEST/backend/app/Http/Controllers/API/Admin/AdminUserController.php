<?php

namespace App\Http\Controllers\API\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();
        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with(['venueOwner', 'bookings'])->findOrFail($id);
        return response()->json($user);
    }

    public function ban($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Admin users cannot be banned.'], 403);
        }
        $user->update(['status' => 'banned']);
        return response()->json(['message' => 'User banned successfully', 'user' => $user]);
    }

    public function unban($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'active']);
        return response()->json(['message' => 'User unbanned successfully', 'user' => $user]);
    }
}
