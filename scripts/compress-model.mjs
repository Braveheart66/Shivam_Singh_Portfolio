import fs from 'fs';
import path from 'path';
import { NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression, KHRTextureTransform } from '@gltf-transform/extensions';
import sharp from 'sharp';

async function compress() {
  const io = new NodeIO();
  io.registerExtensions([KHRDracoMeshCompression, KHRTextureTransform]);

  console.log('Reading public/star_wars_ship.glb...');
  const doc = await io.read('public/star_wars_ship.glb');
  const root = doc.getRoot();
  const textures = root.listTextures();

  console.log(`Found ${textures.length} textures. Resizing & compressing to WebP/JPEG...`);

  for (let i = 0; i < textures.length; i++) {
    const tex = textures[i];
    const rawData = tex.getImage();
    if (!rawData) continue;

    const mime = tex.getMimeType();
    console.log(`Processing texture ${i + 1}/${textures.length} (${mime}, ${rawData.length} bytes)...`);

    try {
      let pipeline = sharp(rawData).resize(1024, 1024, { fit: 'inside', withoutEnlargement: true });
      
      // If it's normal map or roughness/metallic, preserve PNG without alpha loss, but compress strongly
      if (mime.includes('png')) {
        const compressedPng = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
        tex.setImage(compressedPng);
      } else {
        const compressedJpg = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        tex.setImage(compressedJpg);
      }
    } catch (err) {
      console.warn(`Texture ${i + 1} processing skipped:`, err.message);
    }
  }

  console.log('Writing optimized GLB to public/star_wars_ship.glb...');
  // Backup original first
  if (!fs.existsSync('public/star_wars_ship_backup.glb')) {
    fs.copyFileSync('public/star_wars_ship.glb', 'public/star_wars_ship_backup.glb');
  }

  const glbBytes = await io.writeBinary(doc);
  fs.writeFileSync('public/star_wars_ship.glb', Buffer.from(glbBytes));
  console.log(`Successfully compressed! Original: ~24MB -> New: ${(glbBytes.byteLength / 1024 / 1024).toFixed(2)} MB`);
}

compress().catch(console.error);
