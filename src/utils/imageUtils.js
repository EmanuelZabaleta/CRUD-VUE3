const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Función para convertir imágenes a WebP reutilizando el mismo canvas
export const convertToWebP = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      // Ajusta el tamaño del canvas al tamaño de la imagen
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibuja la imagen en el canvas
      ctx.drawImage(img, 0, 0);

      // Convierte el contenido del canvas a WebP
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' }));
        } else {
          reject(new Error('Failed to convert image to WebP.'));
        }
      }, 'image/webp', 0.8); // Calidad ajustable
    };

    img.onerror = (err) => reject(err);
  });
};
