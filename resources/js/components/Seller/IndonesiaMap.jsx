import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './IndonesiaMap.module.css';

// Koordinat pusat provinsi Indonesia
const provinceCoordinates = {
    'Aceh': [-4.695135, 96.749397],
    'Sumatera Utara': [2.115355, 99.545097],
    'Sumatera Barat': [-0.739940, 100.800003],
    'Riau': [0.293545, 101.706826],
    'Kepulauan Riau': [0.916644, 104.450708],
    'Jambi': [-1.610900, 103.613131],
    'Sumatera Selatan': [-3.319437, 104.914542],
    'Bengkulu': [-3.792560, 102.260764],
    'Lampung': [-4.558555, 105.408553],
    'Bangka Belitung': [-2.741051, 106.440585],
    'DKI Jakarta': [-6.211544, 106.845172],
    'Jawa Barat': [-6.914744, 107.609810],
    'Banten': [-6.405817, 106.064018],
    'Jawa Tengah': [-7.150975, 110.140259],
    'DI Yogyakarta': [-7.875389, 110.426229],
    'Jawa Timur': [-7.536064, 112.238404],
    'Bali': [-8.340936, 115.092049],
    'Nusa Tenggara Barat': [-8.652933, 117.361648],
    'Nusa Tenggara Timur': [-8.657382, 121.079370],
    'Kalimantan Barat': [-0.278810, 111.475290],
    'Kalimantan Tengah': [-1.681489, 113.382355],
    'Kalimantan Selatan': [-3.092620, 115.283470],
    'Kalimantan Timur': [0.538659, 116.419389],
    'Kalimantan Utara': [3.073040, 116.041450],
    'Sulawesi Utara': [0.624720, 123.975014],
    'Gorontalo': [0.693890, 122.445640],
    'Sulawesi Tengah': [-1.430410, 121.445640],
    'Sulawesi Barat': [-2.844260, 119.232000],
    'Sulawesi Selatan': [-3.668710, 119.974290],
    'Sulawesi Tenggara': [-4.144520, 122.174600],
    'Maluku': [-3.238460, 130.145270],
    'Maluku Utara': [1.570990, 127.808750],
    'Papua Barat': [-1.336020, 133.174050],
    'Papua': [-4.269280, 138.080350],
    'Papua Barat Daya': [-2.108670, 132.230100],
    'Papua Selatan': [-6.360220, 140.668300],
    'Papua Tengah': [-3.934640, 137.147860],
    'Papua Pegunungan': [-4.047240, 138.952880]
};

// Alternatif nama provinsi untuk matching
const provinceAliases = {
    'jakarta': 'DKI Jakarta',
    'dki': 'DKI Jakarta',
    'yogyakarta': 'DI Yogyakarta',
    'jogja': 'DI Yogyakarta',
    'diy': 'DI Yogyakarta',
    'sumut': 'Sumatera Utara',
    'sumbar': 'Sumatera Barat',
    'sumsel': 'Sumatera Selatan',
    'kepri': 'Kepulauan Riau',
    'babel': 'Bangka Belitung',
    'jabar': 'Jawa Barat',
    'jateng': 'Jawa Tengah',
    'jatim': 'Jawa Timur',
    'kalbar': 'Kalimantan Barat',
    'kalteng': 'Kalimantan Tengah',
    'kalsel': 'Kalimantan Selatan',
    'kaltim': 'Kalimantan Timur',
    'kaltara': 'Kalimantan Utara',
    'sulut': 'Sulawesi Utara',
    'sulteng': 'Sulawesi Tengah',
    'sulbar': 'Sulawesi Barat',
    'sulsel': 'Sulawesi Selatan',
    'sultra': 'Sulawesi Tenggara',
    'malut': 'Maluku Utara',
    'ntb': 'Nusa Tenggara Barat',
    'ntt': 'Nusa Tenggara Timur'
};

function IndonesiaMap({ data = [], maxValue = 1, hoveredIndex, onHover }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const geoJsonLayerRef = useRef(null);
    const [geoJsonData, setGeoJsonData] = useState(null);

    // Find coordinates for province name
    const getProvinceCoords = (provinceName) => {
        if (!provinceName) return null;
        
        const normalizedName = provinceName.toLowerCase().trim();
        
        // Direct match
        for (const [name, coords] of Object.entries(provinceCoordinates)) {
            if (name.toLowerCase() === normalizedName) {
                return coords;
            }
        }
        
        // Alias match
        for (const [alias, fullName] of Object.entries(provinceAliases)) {
            if (normalizedName.includes(alias) || alias.includes(normalizedName)) {
                return provinceCoordinates[fullName];
            }
        }
        
        // Partial match
        for (const [name, coords] of Object.entries(provinceCoordinates)) {
            if (name.toLowerCase().includes(normalizedName) || 
                normalizedName.includes(name.toLowerCase())) {
                return coords;
            }
        }
        
        return null;
    };

    // Load GeoJSON data
    useEffect(() => {
        // Fetch Indonesia GeoJSON from reliable source
        fetch('https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json')
            .then(response => response.json())
            .then(data => {
                setGeoJsonData(data);
            })
            .catch(err => {
                console.error('Failed to load GeoJSON:', err);
                // Fallback to simpler map
            });
    }, []);

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Create map centered on Indonesia
        const map = L.map(mapRef.current, {
            center: [-2.5, 118],
            zoom: 4,
            minZoom: 3,
            maxZoom: 10,
            zoomControl: true,
            scrollWheelZoom: true,
            attributionControl: false,
            zoomAnimation: false, // Disable zoom animation
            fadeAnimation: false, // Disable fade animation
            markerZoomAnimation: false // Disable marker zoom animation
        });

        // Add tile layer (CartoDB light for clean look)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        // Add attribution
        L.control.attribution({
            position: 'bottomright',
            prefix: ''
        }).addTo(map).addAttribution('© OpenStreetMap');

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Add GeoJSON layer when data is loaded
    useEffect(() => {
        if (!mapInstanceRef.current || !geoJsonData) return;

        // Remove existing layer
        if (geoJsonLayerRef.current) {
            mapInstanceRef.current.removeLayer(geoJsonLayerRef.current);
        }

        // Style function for provinces
        const style = (feature) => {
            const provinceName = feature.properties?.Propinsi || feature.properties?.name || '';
            const hasData = data.some(d => {
                const coords = getProvinceCoords(d.province);
                const featureCoords = getProvinceCoords(provinceName);
                return coords && featureCoords && 
                       Math.abs(coords[0] - featureCoords[0]) < 2 && 
                       Math.abs(coords[1] - featureCoords[1]) < 2;
            });

            return {
                fillColor: hasData ? '#7A57B3' : '#e5e7eb',
                weight: 1,
                opacity: 1,
                color: '#ffffff',
                fillOpacity: hasData ? 0.3 : 0.5
            };
        };

        // Create GeoJSON layer
        const geoJsonLayer = L.geoJSON(geoJsonData, {
            style: style,
            onEachFeature: (feature, layer) => {
                const provinceName = feature.properties?.Propinsi || feature.properties?.name || 'Unknown';
                layer.bindTooltip(provinceName, {
                    permanent: false,
                    direction: 'center',
                    className: styles.provinceTooltip
                });
            }
        }).addTo(mapInstanceRef.current);

        geoJsonLayerRef.current = geoJsonLayer;
    }, [geoJsonData, data]);

    // Add/update markers
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => {
            mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Add markers for each province with data
        data.forEach((item, index) => {
            const coords = getProvinceCoords(item.province);
            if (!coords) return;

            const size = Math.max(20, Math.min(50, 20 + (item.total / maxValue) * 30));
            const isHovered = hoveredIndex === index;

            // Create custom icon
            const icon = L.divIcon({
                className: styles.customMarker,
                html: `
                    <div class="${styles.markerOuter} ${isHovered ? styles.markerHovered : ''}" 
                         style="width: ${size}px; height: ${size}px;">
                        <div class="${styles.markerInner}">
                            <span class="${styles.markerValue}">${item.total}</span>
                        </div>
                    </div>
                `,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
            });

            const marker = L.marker([coords[0], coords[1]], { icon })
                .addTo(mapInstanceRef.current);

            // Add popup
            marker.bindPopup(`
                <div class="${styles.markerPopup}">
                    <strong>${item.province}</strong><br/>
                    <span style="color: #7A57B3; font-weight: 600;">${item.total} reviewer</span>
                </div>
            `, {
                closeButton: false,
                className: styles.customPopup
            });

            // Events
            marker.on('mouseover', () => {
                onHover(index);
                marker.openPopup();
            });
            marker.on('mouseout', () => {
                onHover(null);
                marker.closePopup();
            });

            markersRef.current.push(marker);
        });
    }, [data, maxValue, hoveredIndex, onHover]);

    // Handle external hover
    useEffect(() => {
        if (hoveredIndex !== null && markersRef.current[hoveredIndex]) {
            markersRef.current[hoveredIndex].openPopup();
        } else {
            markersRef.current.forEach(marker => marker.closePopup());
        }
    }, [hoveredIndex]);

    return (
        <div className={styles.mapWrapper}>
            <div ref={mapRef} className={styles.mapContainer} />
            <div className={styles.mapOverlay}>
                <div className={styles.mapTitle}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#7A57B3">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span>Peta Indonesia</span>
                </div>
            </div>
        </div>
    );
}

export default IndonesiaMap;
