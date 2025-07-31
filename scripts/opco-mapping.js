export const opcoMapping = {
  beckman: 'Beckman Coulter Life Sciences',
  sciex: 'SCIEX',
  idexx: 'IDEXX BioAnalytics',
  moldev: 'Molecular Devices',
  leica: 'Leica Microsystems',
  idbs: 'IDBS',
  phenomenex: 'Phenomenex',
  abcam: 'Abcam',
  // Add more OpCos here
};

/**
 * Utility to get OpCo key from a given value
 * @param {string} value - The full name from raw.opco
 * @returns {string|undefined} - The short key (e.g., 'beckman')
 */
export function getOpcoKeyFromValue(value) {
  return Object.keys(opcoMapping).find(
    (key) => opcoMapping[key].toLowerCase() === value?.toLowerCase(),
  );
}
