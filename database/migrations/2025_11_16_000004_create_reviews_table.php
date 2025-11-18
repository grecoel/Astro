<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up():void {
        Schema::create('reviews', function (Blueprint $table){
            $table->uuid('id')->primary();  
            $table->string('name');
            $table->string('numHP');
            $table->string('email');
            $table->double('rating');
            $table->string('comment')->nullable();

            $table->timestamps();
        }
    );
    }

    public function down():void{
        Schema::dropIfExists('reviews');
    }
};