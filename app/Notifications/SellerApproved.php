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
            ->subject('Pendaftaran Penjual Disetujui!')
            ->line('Selamat, ' . $notifiable->pic_name . '!') 
            ->line('Pendaftaran Toko kamu, ' .  $notifiable->store_name . ', telah disetujui.')
            ->line('Silakan buat password untuk mengaktifkan akun Anda dan mulai berjualan.')
            ->action('Buat Password & Aktivasi', $url)
            ->line('Tautan ini akan kadaluarsa dalam 60 menit.');
    }

}
