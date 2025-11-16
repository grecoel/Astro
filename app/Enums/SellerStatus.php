<?php
namespace App\Enums;

enum SellerStatus: string
{
    case PENDING = 'PENDING';
    case ACTIVE = 'ACTIVE';
    case REJECTED = 'REJECTED';
}