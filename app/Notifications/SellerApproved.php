<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Password;
use App\Models\User;
use Illuminate\Support\Str;

class SellerApproved extends Notification
{
    use Queueable;

    public function via($notifiable){
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        // Generate token untuk aktivasi akun
        $token = Str::random(60);
        
        // Simpan token ke database
        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $notifiable->pic_email],
            [
                'email' => $notifiable->pic_email,
                'token' => bcrypt($token),
                'created_at' => now()
            ]
        );

        $url = url("/aktivasi-akun?token={$token}&email=" . urlencode($notifiable->pic_email));

        return (new MailMessage)
            ->subject('Toko Disetujui - AstroEcomm')
            ->view('emails.seller-approved', [
                'notifiable' => $notifiable,
                'actionUrl' => $url
            ]);
    }

}
