<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseStorageService
{
    protected $url;
    protected $key;
    protected $bucket;

    public function __construct()
    {
        $this->url = config('services.supabase.url');
        $this->key = config('services.supabase.key');
        $this->bucket = config('services.supabase.bucket');
    }

    /**
     * Upload file to Supabase Storage
     * 
     * @param string $path Path dalam bucket (e.g., 'ktp_files/filename.jpg')
     * @param string $content File content (binary)
     * @return string File path yang di-upload
     */
    public function upload($path, $content)
    {
        $url = "{$this->url}/storage/v1/object/{$this->bucket}/{$path}";

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->key}",
            'Content-Type' => 'application/octet-stream',
        ])->withBody($content, 'application/octet-stream')
          ->post($url);

        if ($response->failed()) {
            throw new \Exception('Failed to upload file to Supabase: ' . $response->body());
        }

        return $path;
    }

    /**
     * Delete file from Supabase Storage
     * 
     * @param string $path Path dalam bucket
     * @return bool
     */
    public function delete($path)
    {
        $url = "{$this->url}/storage/v1/object/{$this->bucket}/{$path}";

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->key}",
        ])->delete($url);

        return $response->successful();
    }

    /**
     * Get public URL for a file
     * 
     * @param string $path Path dalam bucket
     * @return string Public URL
     */
    public function getPublicUrl($path)
    {
        return "{$this->url}/storage/v1/object/public/{$this->bucket}/{$path}";
    }
}
