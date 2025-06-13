import { promises as fs } from 'fs';
import path from 'path';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminAvif from 'imagemin-avif';

export function imageFormatsPlugin() {
  const plugin = {
    name: 'image-formats',
    async buildStart() {
      // Generate WebP and AVIF versions of images during build
      const srcDir = path.resolve('src/assets/img');
      await plugin.generateImageFormats(srcDir);
    },
    async generateImageFormats(dir) {
      try {
        const files = await fs.readdir(dir, { recursive: true });

        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = await fs.stat(filePath);

          if (stat.isFile() && /\.(png|jpe?g)$/i.test(file)) {
            const fileBuffer = await fs.readFile(filePath);
            const baseName = path.parse(filePath).name;
            const dirName = path.dirname(filePath);

            // Generate WebP
            const webpPath = path.join(dirName, `${baseName}.webp`);
            if (!(await plugin.fileExists(webpPath))) {
              const webpBuffer = await imagemin.buffer(fileBuffer, {
                plugins: [imageminWebp({ quality: 75 })]
              });
              await fs.writeFile(webpPath, webpBuffer);
            }

            // Generate AVIF
            const avifPath = path.join(dirName, `${baseName}.avif`);
            if (!(await plugin.fileExists(avifPath))) {
              const avifBuffer = await imagemin.buffer(fileBuffer, {
                plugins: [imageminAvif({ quality: 50 })]
              });
              await fs.writeFile(avifPath, avifBuffer);
            }
          }
        }
      } catch (error) {
        console.warn('Image format generation failed:', error);
      }
    },
    async fileExists(filePath) {
      try {
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    }
  };

  return plugin;
}
