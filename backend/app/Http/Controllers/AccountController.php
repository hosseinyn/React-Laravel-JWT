<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AccountController extends Controller
{
    public function signup(Request $request): JsonResponse {
        $signup_data = $request->validate([
            'name' => 'required|max:50',
            'email' => 'required',
            'password' => 'required|min:7|max:20'
        ]);

        $user = User::where('name', $signup_data['name'])->first();
        $user_email = User::where('email', $signup_data['email'])->first();

        if (!$user || !$user_email) {

            $user = User::create([
                'name'=> $signup_data['name'],
                'email'=> $signup_data['email'],
                'password'=> Hash::make($signup_data['password']),
            ]);

            return response()->json(['message' => 'Successfully created']);

        } else {
            return response()->json(['message'=> 'Already exists']);
        }
    }
}
