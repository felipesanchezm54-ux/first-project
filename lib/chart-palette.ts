/**
 * Paleta de gráficas del panel (superficie clara #ffffff), derivada de la marca y
 * validada con el validador de la skill de visualización:
 * - `ordinal`: rampa teal de 5 pasos para bandas de lead scoring y etapas del embudo
 *   (monótona en luminosidad, extremo claro ≥ 2:1 sobre la superficie).
 * - `single`: teal de marca #1F9E75 (≥ 3:1) para series únicas.
 * - `goal`: morado profundo para la línea de meta.
 * Las etiquetas y valores usan siempre tokens de texto, nunca el color de la serie.
 */
export const chartColors = {
  single: "#1f9e75",
  goal: "#5047bf",
  ordinal: ["#5fc49d", "#2ea57d", "#17835f", "#0b6448", "#054434"],
  grid: "#e3ebe7",
  axis: "#4b6159",
  ink: "#06231c",
} as const;
