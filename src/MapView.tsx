import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

export default function MapView() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_KEY"
  });

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      center={{ lat: 17.385, lng: 78.4867 }}
      zoom={12}
      mapContainerStyle={{ height: "300px", width: "100%" }}
    >
      <Marker position={{ lat: 17.385, lng: 78.4867 }} />
    </GoogleMap>
  );
}
