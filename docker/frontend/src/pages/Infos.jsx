import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import BANNER from '../assets/images/biblio.jpeg';

const markerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function Horaires() {
  const horaires = [
    { jour: 'Lundi', ouverture: '08:00', fermeture: '20:00' },
    { jour: 'Mardi', ouverture: '08:00', fermeture: '20:00' },
    { jour: 'Mercredi', ouverture: '08:00', fermeture: '18:00' },
    { jour: 'Jeudi', ouverture: '08:00', fermeture: '20:00' },
    { jour: 'Vendredi', ouverture: '08:00', fermeture: '18:00' },
    { jour: 'Samedi', ouverture: '10:00', fermeture: '16:00' },
    { jour: 'Dimanche', ouverture: 'Fermé', fermeture: '' },
  ];

  const position = [49.87586062481953, 2.2641336744775273];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Carte / image */}
        <div className="h-96 w-full relative">
          <img
            src={BANNER}
            alt="Bibliothèque UPJV Amiens"
            className="w-full h-full object-cover object-bottom"
          />
          <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-75 w-full p-4">
            <h2 className="text-2xl font-bold">Bibliothèque Universitaire IUT UPJV Amiens</h2>
            <p className="text-gray-300">30 Chem. du Thil, 80000 Amiens, France</p>
          </div>
        </div>

        {/* Horaires */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Horaires d'ouverture</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-gray-300">
            {horaires.map((h) => (
              <div
                key={h.jour}
                className="bg-gray-700 rounded-md p-3 flex flex-col items-center"
              >
                <span className="font-medium text-white">{h.jour}</span>
                <span>{h.fermeture ? `${h.ouverture} - ${h.fermeture}` : h.ouverture}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carte interactive */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Localisation</h3>
          <MapContainer center={position} zoom={17} className="h-96 w-full rounded-lg">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={markerIcon}>
              <Popup>
                Bibliothèque Universitaire IUT UPJV Amiens
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
