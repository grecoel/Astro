<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up():void {
        Schema::create('banners', function (Blueprint $table){
            $table->uuid('id')->primary();  
            $table->string('title');
            $table->string('image_url');
            $table->string('link_url')->nullable();
            $table->string('condition');
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        }
    );
    }

    public function down():void{
        Schema::dropIfExists('banners');
    }
};