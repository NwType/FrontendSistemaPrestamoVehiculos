// Servicio para manejar imágenes de vehículos temporalmente
export const imageService = {
  // Obtener imagen por marca y modelo
  getVehicleImage(marca, modelo) {
    const marcaLower = marca.toLowerCase();
    const modeloLower = modelo.toLowerCase();
    
    // Mapeo de marcas a colores de fondo
    const brandColors = {
      'toyota': '#e53e3e',
      'honda': '#3182ce',
      'ford': '#38a169',
      'nissan': '#d69e2e',
      'bmw': '#805ad5',
      'mercedes': '#dd6b20',
      'audi': '#2d3748',
      'volkswagen': '#2b6cb0'
    };
    
    const color = brandColors[marcaLower] || '#718096';
    
    // Crear imagen SVG placeholder sin emojis para evitar errores de btoa
    const svgString = `
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="200" fill="${color}"/>
        <text x="150" y="80" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">${marca}</text>
        <text x="150" y="120" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle">${modelo}</text>
        <text x="150" y="150" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">AUTO</text>
      </svg>
    `;
    
    // Usar encodeURIComponent en lugar de btoa para mayor compatibilidad
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString.trim())}`;
  },

  // Obtener múltiples imágenes para un vehículo
  getVehicleImages(marca, modelo, count = 3) {
    const images = [];
    for (let i = 0; i < count; i++) {
      images.push(this.getVehicleImage(marca, modelo));
    }
    return images;
  },

  // Validar si una URL es una imagen válida
  isValidImageUrl(url) {
    if (!url) return false;
    return url.startsWith('data:image/') || 
           url.startsWith('http') || 
           url.startsWith('/uploads/');
  }
};