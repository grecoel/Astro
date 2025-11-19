<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SellerApproved extends Notification
{
    use Queueable;

    public function via($notifiable){
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Pendaftaran Penjual Disetujui!')
            ->line('Selamat, !' . $notifiable->pic_name . '!') 
            ->line('Pendaftaran Toko kamu, ' .  $notifiable->store_name . ', telah disetujui.')
            ->line('Sekarang kamu dapat mengunggah produkmu!')
            ->action('Mulai Upload Produk', url('/login'));
    }

}
