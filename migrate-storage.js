import 'dotenv/config'; 
import { createClient } from '@supabase/supabase-js';

// --- KONFIGURASI ---
const cloudUrl = 'https://ftxpzvyphxippnwteaja.supabase.co';
const cloudKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0eHB6dnlwaHhpcHBud3RlYWphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzAwNDU0OSwiZXhwIjoyMDc4NTgwNTQ5fQ.mdNQTZ98DMwKPUjkTYsvPf7z6etC-sY28L2h4aqsTUk'; // Service Role Cloud

const localUrl = 'http://127.0.0.1:54321';
const localKey = 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz'; // Service Role Local

// Ganti dengan bucket yang bermasalah tadi
const BUCKET_NAME = 'sellers'; 
// -------------------

const supabaseCloud = createClient(cloudUrl, cloudKey);
const supabaseLocal = createClient(localUrl, localKey);

async function migrate() {
  console.log(`🚀 Memulai migrasi bucket: ${BUCKET_NAME}`);

  // 1. Pastikan Bucket ada di Local
  const { error: bucketError } = await supabaseLocal.storage.getBucket(BUCKET_NAME);
  if (bucketError && bucketError.message.includes('not found')) {
      console.log(`📦 Membuat bucket ${BUCKET_NAME} di local...`);
      await supabaseLocal.storage.createBucket(BUCKET_NAME, { public: true });
  }

  // 2. Jalankan fungsi rekursif mulai dari root folder ('')
  await processFolder(''); 
  
  console.log('✅ Migrasi Selesai!');
}

// Fungsi pintar yang bisa masuk ke dalam folder
async function processFolder(pathPrefix) {
  // List file di path saat ini
  const { data: items, error: listError } = await supabaseCloud
    .storage
    .from(BUCKET_NAME)
    .list(pathPrefix || undefined, { limit: 100, offset: 0 }); 

  if (listError) {
      console.error(`❌ Error list di folder '${pathPrefix}':`, listError);
      return;
  }

  for (const item of items) {
    if (item.name === '.emptyFolderPlaceholder') continue; 

    // Tentukan path lengkap file/folder ini
    // Jika pathPrefix kosong, pathnya "namafile"
    // Jika pathPrefix "ktp_files", pathnya "ktp_files/namafile"
    const fullPath = pathPrefix ? `${pathPrefix}/${item.name}` : item.name;

    // DETEKSI APAKAH INI FOLDER?
    // Di Supabase, jika item tidak punya 'id' atau 'metadata', biasanya itu folder
    if (!item.id) {
        console.log(`📂 Masuk ke folder: ${fullPath}`);
        // Panggil fungsi ini sendiri untuk masuk ke dalam folder (REKURSIF)
        await processFolder(fullPath); 
    } else {
        // INI ADALAH FILE
        await downloadAndUpload(fullPath, item);
    }
  }
}

async function downloadAndUpload(filePath, fileMeta) {
    console.log(`⬇️  Downloading: ${filePath}`);
    const { data: fileBlob, error: downError } = await supabaseCloud
      .storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (downError) {
        console.error(`❌ Gagal download ${filePath}:`, downError.message);
        return;
    }

    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`⬆️  Uploading ke Local: ${filePath}`);
    const { error: upError } = await supabaseLocal
      .storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: fileMeta.metadata ? fileMeta.metadata.mimetype : fileBlob.type,
        upsert: true
      });

    if (upError) console.error(`❌ Gagal upload ke local:`, upError.message);
}

migrate();