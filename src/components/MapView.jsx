import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 5 });
    }
  }, [map, bounds]);
  return null;
}

export default function MapView({ countries }) {
  const geoJsonData = useMemo(() => {
    if (!countries || countries.length === 0) return null;

    const features = countries
      .filter((c) => c.latlng && c.latlng.length === 2)
      .map((c) => ({
        type: 'Feature',
        properties: {
          name: c.name.common,
          flag: c.flag,
        },
        geometry: {
          type: 'Point',
          coordinates: [c.latlng[1], c.latlng[0]],
        },
      }));

    return { type: 'FeatureCollection', features };
  }, [countries]);

  const bounds = useMemo(() => {
    if (!countries || countries.length === 0) return null;
    return countries
      .filter((c) => c.latlng && c.latlng.length === 2)
      .map((c) => [c.latlng[0], c.latlng[1]]);
  }, [countries]);

  const circleStyle = {
    radius: 8,
    fillColor: '#e94560',
    color: '#16213e',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8,
  };

  return (
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJsonData && (
        <GeoJSON
          key={JSON.stringify(geoJsonData)}
          data={geoJsonData}
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, circleStyle);
          }}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `<strong>${feature.properties.flag} ${feature.properties.name}</strong>`
            );
          }}
        />
      )}
      {bounds && bounds.length > 0 && <FitBounds bounds={bounds} />}
    </MapContainer>
  );
}
