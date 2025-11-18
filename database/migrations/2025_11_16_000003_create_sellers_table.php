<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration{
    public function up(): void{
        Schema::create('sellers', function (Blueprint $table){
            $table->uuid('id')->primary();
            // 1. Data Toko
            $table->string('store_name'); 
            $table->text('store_description')->nullable();

            // 2. Data PIC (Person in Charge)
            $table->string('pic_name'); 
            $table->string('pic_phone'); 
            $table->string('pic_email')->unique(); 

            // 3. Alamat PIC
            $table->string('pic_address'); 
            $table->string('pic_rt', 3); 
            $table->string('pic_rw', 3); 
            $table->string('pic_district'); 
            $table->string('pic_city'); 
            $table->string('pic_province'); 

            // 4. Dokumen Identitas PIC
            $table->string('pic_ktp_number')->unique(); 
            $table->string('pic_photo_path')->nullable(); 
            $table->string('pic_ktp_file_path'); 

            $table->string('status')->default('PENDING'); 

            $table->timestamps();
        }
    );
    }
    public function down(): void{
        Schema::dropIfExists('sellers');
    }
};