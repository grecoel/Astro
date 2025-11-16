<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up():void {
        Schema::create('products', function (Blueprint $table){
            $table->uuid('id')->primary();  
            $table->string('name');
            $table->longText('description')->nullable();
            $table->decimal('price',10 ,2);
            $table->string('image_url');
            $table->string('condition');  

            $table->uuid('seller_id');
            $table->uuid('category_id');

            $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');

            $table->timestamps();
        }
    );
    }

    public function down():void{
        Schema::dropIfExists('products');
    }
};
