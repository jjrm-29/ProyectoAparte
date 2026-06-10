export const leerArchivoComoDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const imagenPlaceholder = (nombre) =>
  `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(nombre || "Producto")}`;

export const resolverImagenProducto = async (datos, imagenActual = "") => {
  if (datos.archivo) {
    return leerArchivoComoDataUrl(datos.archivo);
  }
  if (datos.imagen && !datos.imagen.startsWith("blob:")) {
    return datos.imagen;
  }
  if (imagenActual && !imagenActual.startsWith("blob:")) {
    return imagenActual;
  }
  return imagenPlaceholder(datos.nombre);
};
