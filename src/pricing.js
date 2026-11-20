const SERVICES = [
  { id: 'pressure-washing', name: 'Pressure Washing', ratePerSqFt: 0.35 },
  { id: 'house-soft-wash', name: 'House Soft Wash', ratePerSqFt: 0.25 },
  { id: 'window-cleaning', name: 'Window Cleaning', ratePerSqFt: 0.2 },
];

const MINIMUM_CHARGE = 120;
const MAX_SQUARE_FEET = 20000;

function findService(serviceId) {
  return SERVICES.find((service) => service.id === serviceId);
}

function calculateQuote(serviceId, squareFeet) {
  const service = findService(serviceId);
  if (!service) {
    throw new Error(`Unknown service: ${serviceId}`);
  }
  if (!Number.isFinite(squareFeet) || squareFeet <= 0 || squareFeet > MAX_SQUARE_FEET) {
    throw new Error(`squareFeet must be between 1 and ${MAX_SQUARE_FEET}`);
  }
  const raw = service.ratePerSqFt * squareFeet;
  const total = Math.max(MINIMUM_CHARGE, Math.round(raw * 100) / 100);
  return { serviceId, squareFeet, total };
}

module.exports = { SERVICES, MINIMUM_CHARGE, MAX_SQUARE_FEET, findService, calculateQuote };