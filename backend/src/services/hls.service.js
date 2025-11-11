import ffmpeg from 'fluent-ffmpeg';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const convertToHLS = async (inputPath, originalFilename) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Crear directorio HLS si no existe
      const hlsDir = join(__dirname, '../../uploads/hls');
      await fs.mkdir(hlsDir, { recursive: true });

      // Generar nombre único para los archivos HLS
      const timestamp = Date.now();
      const baseName = basename(originalFilename, extname(originalFilename));
      const outputDir = join(hlsDir, `${baseName}-${timestamp}`);
      
      await fs.mkdir(outputDir, { recursive: true });

      const playlistPath = join(outputDir, 'playlist.m3u8');
      const segmentPattern = join(outputDir, 'segment_%03d.ts');

      // Convertir video a HLS
      ffmpeg(inputPath)
        .outputOptions([
          '-codec: copy',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-f hls'
        ])
        .output(playlistPath)
        .on('end', () => {
          const relativePath = `/uploads/hls/${basename(outputDir)}/playlist.m3u8`;
          console.log(`✓ Video convertido a HLS: ${relativePath}`);
          resolve(relativePath);
        })
        .on('error', (err) => {
          console.error('Error en conversión HLS:', err);
          reject(err);
        })
        .run();
    } catch (error) {
      console.error('Error preparando conversión HLS:', error);
      reject(error);
    }
  });
};
