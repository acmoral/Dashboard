let MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export async function countryNameToIso(name) {
    const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(name)}.json?types=country&access_token=${MAPBOX_ACCESS_TOKEN}`);
    const data = await resp.json();
    if (data.features && data.features.length > 0) {
      const feat = data.features[0];
      // sometimes in feat.properties or feat.context you’ll find iso codes
      // or feat.properties.iso_3166_1, etc.
      return feat.properties.short_code.toUpperCase() || null;
    }
    return null;
  }