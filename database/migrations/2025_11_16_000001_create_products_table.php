<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migrations
{
    public function up():void {
        Schema::create('products', function (Blueprint $table)){
            $table->string('id');
            $table->string('name');
            $table->longText('description')->nullable();
            $table->double('price',10 ,2);
            $table->string('imageURL');
            $table->string('condition');  

            $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->timestamps();
        }
    }
}
