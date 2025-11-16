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

            $table->foreignUuid('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->foreignUuid('category_id')->constrained('categories')->onDelete('cascade');

            $table->timestamps();
        }
    );
    }

    public function down():void{
        Schema::dropIfExists('products');
    }
};