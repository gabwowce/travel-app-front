export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  export function getDistanceLabel(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
    const dist = getDistanceFromLatLonInKm(from.latitude, from.longitude, to.latitude, to.longitude);
    return dist < 1
      ? `${Math.round(dist * 1000)} m`
      : `${dist.toFixed(1)} km`;
  }
  