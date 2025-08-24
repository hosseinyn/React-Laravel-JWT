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

    public function change_password(Request $request): JsonResponse {
        $change_password_data = $request->validate([
            'name' => 'required|max:50',
            'current_password' => 'required|min:7|max:20',
            'new_password' => 'required|min:7|max:20'
        ]);

        $user = User::where("name" , $change_password_data["name"])->first();

        if ($user && Hash::check($change_password_data["current_password"], $user->password)) {
            $user->password = Hash::make($change_password_data["new_password"]);
            $user->save();

            return response()->json(["message"=> "Password changed successfully"]);
        } else {
            return response()->json(["message"=> "Current password is not correct"]);
        }

    }

    public function delete_account (Request $request): JsonResponse {
        $delete_account_data = $request->validate([
            'email' => 'required',
            'password' => 'required|min:7|max:20',
        ]);

        $user = User::where('email', $delete_account_data['email'])->first();

        if ($user && Hash::check($delete_account_data['password'], $user->password)) {
            $user->delete();
            return response()->json(['message'=> 'Account deleted successfuly']);
        } else {
            return response()->json(['message'=> 'Email or password is not correct']);
        }
    }
}
