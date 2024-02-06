import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LatLng, Map } from "leaflet";

const MapView = ({
  titleText,
  center,
  center2,
  zoom,
  setMapCenter,
  setMapZoom,
  isLocationDetailShown,
  isDisabled = false,
}: {
  titleText?: string;
  center: Partial<LatLng>;
  center2?: Partial<LatLng>;
  zoom: number;
  setMapCenter: React.Dispatch<React.SetStateAction<Partial<LatLng>>>;
  setMapZoom: React.Dispatch<React.SetStateAction<number>>;
  isLocationDetailShown?: boolean;
  isDisabled?: boolean;
}) => {
  const [map, setMap] = useState<Map | null>(null);
  const [position, setPosition] = useState(() => center);

  const [newCenter, setNewCenter] = useState(
    center2 !== undefined ? [(center.lat! + center2.lat!) / 2, (center.lng! + center2.lng!) / 2] : center
  );

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={newCenter as LatLng}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={setMap}
        wheelDebounceTime={0}
        wheelPxPerZoomLevel={50}
        zoomSnap={0}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          draggable={!isDisabled}
          position={center as LatLng}
          eventHandlers={{
            dragend(e) {
              setMapCenter(e.target.getLatLng());
            },
          }}
        ></Marker>
        {center2 && (
          <Marker
            draggable={!isDisabled}
            position={center2 as LatLng}
            eventHandlers={{
              dragend(e) {
                setMapCenter(e.target.getLatLng());
              },
            }}
          ></Marker>
        )}
      </MapContainer>
    ),
    []
  );

  const onMove = useCallback(() => {
    if (map !== null) {
      setPosition(map.getCenter());
      setMapZoom(map.getZoom());
    }
  }, [map]);

  useEffect(() => {
    if (map !== null) {
      map.on("move", onMove);

      return () => {
        map.off("move", onMove);
      };
    }
  }, [map, onMove]);

  return (
    <div className="w-full h-full flex flex-col">
      {titleText && <div className="pb-1">{titleText && <span className="label-text text-lg">{titleText}</span>}</div>}
      {displayMap}
      {isLocationDetailShown && (
        <div>
          {position.lat !== undefined && position.lng !== undefined && (
            <p>
              Map Center: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </p>
          )}
          {center.lat !== undefined && center.lng !== undefined && (
            <p>
              Pin Location: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;
