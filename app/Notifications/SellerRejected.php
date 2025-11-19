<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SellerRejected extends Notification
{
    use Queueable;

    public function via($notifiable){
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Pendaftaran Penjual Ditolak!')
            ->line('Halo, !' . $notifiable->pic_name . '!') 
            ->line('Pendaftaran Toko kamu, ' .  $notifiable->store_name . ', telah ditolak.')
            ->line('Karena beberapa persyaratan yang tidak dipenuhi.')
            ->action('Coba Pendaftaran Ulang', url('/register'));
    }
}
