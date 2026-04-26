import { supabase } from "../database/supabaseconfig";

// 🔹 Total de ventas
export const obtenerTotalVentas = async () => {
  const { data, error } = await supabase
    .from("hecho_ventas")
    .select("*");

  if (error) return 0;

  return data.length;
};

// 🔹 Ingresos totales
export const obtenerIngresos = async () => {
  const { data, error } = await supabase
    .from("hecho_ventas")
    .select("total");

  if (error) return 0;

  return data.reduce((acc, v) => acc + v.total, 0);
};