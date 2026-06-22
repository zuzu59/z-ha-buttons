export const ICONS = [
  { value: 'bolt', label: 'Éclair' },
  { value: 'lightbulb', label: 'Lampe' },
  { value: 'fan', label: 'Ventilation' },
  { value: 'thermostat', label: 'Thermostat' },
  { value: 'tv', label: 'Télévision' },
  { value: 'power', label: 'Power' },
  { value: 'shield', label: 'Sécurité' },
  { value: 'music', label: 'Musique' },
  { value: 'door', label: 'Porte' },
  { value: 'home', label: 'Maison' },
  { value: 'plug', label: 'Prise' },
];

export function iconGlyph(name) {
  const map = {
    bolt: '⚡',
    lightbulb: '💡',
    fan: '🌀',
    thermostat: '🌡️',
    tv: '📺',
    power: '⏻',
    shield: '🛡️',
    music: '🎵',
    door: '🚪',
    home: '🏠',
    plug: '🔌',
  };
  return map[name] || '⬤';
}
