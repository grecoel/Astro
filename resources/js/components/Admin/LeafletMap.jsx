import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './LeafletMap.module.css';

// Province coordinates (capital cities as markers)
const PROVINCE_COORDINATES = {
    'ACEH': [5.5483, 95.3238],
    'SUMATERA UTARA': [3.5952, 98.6722],
    'SUMATERA BARAT': [-0.9471, 100.4172],
    'RIAU': [0.5071, 101.4478],
    'KEPULAUAN RIAU': [0.9167, 104.4500],
    'JAMBI': [-1.6101, 103.6131],
    'SUMATERA SELATAN': [-2.9761, 104.7754],
    'BENGKULU': [-3.7928, 102.2608],
    'LAMPUNG': [-5.4500, 105.2667],
    'BANGKA BELITUNG': [-2.7410, 106.4406],
    'DKI JAKARTA': [-6.2088, 106.8456],
    'JAWA BARAT': [-6.9175, 107.6191],
    'BANTEN': [-6.1204, 106.1503],
    'JAWA TENGAH': [-7.0051, 110.4381],
    'DI YOGYAKARTA': [-7.7956, 110.3695],
    'JAWA TIMUR': [-7.2575, 112.7521],
    'BALI': [-8.3405, 115.0920],
    'NUSA TENGGARA BARAT': [-8.5833, 116.1167],
    'NUSA TENGGARA TIMUR': [-8.6574, 121.0794],
    'KALIMANTAN BARAT': [-0.0263, 109.3425],
    'KALIMANTAN TENGAH': [-1.6815, 113.3824],
    'KALIMANTAN SELATAN': [-3.0926, 114.5900],
    'KALIMANTAN TIMUR': [0.5387, 116.4194],
    'KALIMANTAN UTARA': [3.0730, 116.0413],
    'SULAWESI UTARA': [1.4748, 124.8421],
    'GORONTALO': [0.5435, 123.0595],
    'SULAWESI TENGAH': [-0.8999, 119.8707],
    'SULAWESI BARAT': [-2.8441, 119.2320],
    'SULAWESI SELATAN': [-5.1477, 119.4327],
    'SULAWESI TENGGARA': [-4.1448, 122.1747],
    'MALUKU UTARA': [1.5709, 127.8083],
    'MALUKU': [-3.6954, 128.1814],
    'PAPUA BARAT': [-1.3361, 133.1747],
    'PAPUA': [-2.5920, 140.6719],
    'PAPUA SELATAN': [-6.0810, 139.9980],
    'PAPUA TENGAH': [-3.9700, 136.3100],
    'PAPUA PEGUNUNGAN': [-4.0700, 138.9500],
};

// Alias mapping
const PROVINCE_ALIASES = {
    'PROVINSI ACEH': 'ACEH',
    'NANGGROE ACEH DARUSSALAM': 'ACEH',
    'NAD': 'ACEH',
    'PROVINSI SUMATERA UTARA': 'SUMATERA UTARA',
    'SUMUT': 'SUMATERA UTARA',
    'PROVINSI SUMATERA BARAT': 'SUMATERA BARAT',
    'SUMBAR': 'SUMATERA BARAT',
    'PROVINSI RIAU': 'RIAU',
    'PROVINSI KEPULAUAN RIAU': 'KEPULAUAN RIAU',
    'KEPRI': 'KEPULAUAN RIAU',
    'PROVINSI JAMBI': 'JAMBI',
    'PROVINSI SUMATERA SELATAN': 'SUMATERA SELATAN',
    'SUMSEL': 'SUMATERA SELATAN',
    'PROVINSI BENGKULU': 'BENGKULU',
    'PROVINSI LAMPUNG': 'LAMPUNG',
    'PROVINSI BANGKA BELITUNG': 'BANGKA BELITUNG',
    'KEPULAUAN BANGKA BELITUNG': 'BANGKA BELITUNG',
    'BABEL': 'BANGKA BELITUNG',
    'PROVINSI DKI JAKARTA': 'DKI JAKARTA',
    'JAKARTA': 'DKI JAKARTA',
    'PROVINSI JAWA BARAT': 'JAWA BARAT',
    'JABAR': 'JAWA BARAT',
    'PROVINSI BANTEN': 'BANTEN',
    'PROVINSI JAWA TENGAH': 'JAWA TENGAH',
    'JATENG': 'JAWA TENGAH',
    'PROVINSI DI YOGYAKARTA': 'DI YOGYAKARTA',
    'DAERAH ISTIMEWA YOGYAKARTA': 'DI YOGYAKARTA',
    'DIY': 'DI YOGYAKARTA',
    'YOGYAKARTA': 'DI YOGYAKARTA',
    'PROVINSI JAWA TIMUR': 'JAWA TIMUR',
    'JATIM': 'JAWA TIMUR',
    'PROVINSI BALI': 'BALI',
    'PROVINSI NUSA TENGGARA BARAT': 'NUSA TENGGARA BARAT',
    'NTB': 'NUSA TENGGARA BARAT',
    'PROVINSI NUSA TENGGARA TIMUR': 'NUSA TENGGARA TIMUR',
    'NTT': 'NUSA TENGGARA TIMUR',
    'PROVINSI KALIMANTAN BARAT': 'KALIMANTAN BARAT',
    'KALBAR': 'KALIMANTAN BARAT',
    'PROVINSI KALIMANTAN TENGAH': 'KALIMANTAN TENGAH',
    'KALTENG': 'KALIMANTAN TENGAH',
    'PROVINSI KALIMANTAN SELATAN': 'KALIMANTAN SELATAN',
    'KALSEL': 'KALIMANTAN SELATAN',
    'PROVINSI KALIMANTAN TIMUR': 'KALIMANTAN TIMUR',
    'KALTIM': 'KALIMANTAN TIMUR',
    'PROVINSI KALIMANTAN UTARA': 'KALIMANTAN UTARA',
    'KALTARA': 'KALIMANTAN UTARA',
    'PROVINSI SULAWESI UTARA': 'SULAWESI UTARA',
    'SULUT': 'SULAWESI UTARA',
    'PROVINSI GORONTALO': 'GORONTALO',
    'PROVINSI SULAWESI TENGAH': 'SULAWESI TENGAH',
    'SULTENG': 'SULAWESI TENGAH',
    'PROVINSI SULAWESI BARAT': 'SULAWESI BARAT',
    'SULBAR': 'SULAWESI BARAT',
    'PROVINSI SULAWESI SELATAN': 'SULAWESI SELATAN',
    'SULSEL': 'SULAWESI SELATAN',
    'PROVINSI SULAWESI TENGGARA': 'SULAWESI TENGGARA',
    'SULTRA': 'SULAWESI TENGGARA',
    'PROVINSI MALUKU UTARA': 'MALUKU UTARA',
    'MALUT': 'MALUKU UTARA',
    'PROVINSI MALUKU': 'MALUKU',
    'PROVINSI PAPUA BARAT': 'PAPUA BARAT',
    'PAPUA BARAT DAYA': 'PAPUA BARAT',
    'PROVINSI PAPUA': 'PAPUA',
    'PROVINSI PAPUA SELATAN': 'PAPUA SELATAN',
    'PROVINSI PAPUA TENGAH': 'PAPUA TENGAH',
    'PROVINSI PAPUA PEGUNUNGAN': 'PAPUA PEGUNUNGAN',
};

const normalizeProvinceName = (name) => {
    if (!name) return null;
    const upper = name.toUpperCase().trim();
    return PROVINCE_ALIASES[upper] || upper;
};

const getDisplayName = (name) => {
    const shortNames = {
        'SUMATERA UTARA': 'Sumut',
        'SUMATERA BARAT': 'Sumbar',
        'SUMATERA SELATAN': 'Sumsel',
        'KEPULAUAN RIAU': 'Kepri',
        'BANGKA BELITUNG': 'Babel',
        'DKI JAKARTA': 'Jakarta',
        'JAWA BARAT': 'Jabar',
        'JAWA TENGAH': 'Jateng',
        'DI YOGYAKARTA': 'Yogya',
        'JAWA TIMUR': 'Jatim',
        'NUSA TENGGARA BARAT': 'NTB',
        'NUSA TENGGARA TIMUR': 'NTT',
        'KALIMANTAN BARAT': 'Kalbar',
        'KALIMANTAN TENGAH': 'Kalteng',
        'KALIMANTAN SELATAN': 'Kalsel',
        'KALIMANTAN TIMUR': 'Kaltim',
        'KALIMANTAN UTARA': 'Kaltara',
        'SULAWESI UTARA': 'Sulut',
        'SULAWESI TENGAH': 'Sulteng',
        'SULAWESI BARAT': 'Sulbar',
        'SULAWESI SELATAN': 'Sulsel',
        'SULAWESI TENGGARA': 'Sultra',
        'MALUKU UTARA': 'Malut',
        'PAPUA BARAT': 'Papua Barat',
        'PAPUA SELATAN': 'Papua Sel',
        'PAPUA TENGAH': 'Papua Tgh',
        'PAPUA PEGUNUNGAN': 'Papua Peg',
    };
    return shortNames[name] || name;
};

// Component to fit bounds
function FitBounds({ positions }) {
    const map = useMap();
    
    useEffect(() => {
        if (positions && positions.length > 0) {
            const bounds = positions.map(p => [p.lat, p.lng]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            // Default to Indonesia view
            map.setView([-2.5, 118], 5);
        }
    }, [positions, map]);
    
    return null;
}

export default function LeafletMap({ data = [] }) {
    // Process data
    const provinceData = {};
    data.forEach(item => {
        const normalized = normalizeProvinceName(item.province);
        if (normalized && PROVINCE_COORDINATES[normalized]) {
            provinceData[normalized] = (provinceData[normalized] || 0) + item.seller_count;
        }
    });

    const maxCount = Math.max(...Object.values(provinceData), 1);
    const totalSellers = data.reduce((sum, d) => sum + d.seller_count, 0);
    const activeProvinces = Object.keys(provinceData).length;

    // Create markers
    const markers = Object.entries(provinceData).map(([province, count]) => {
        const coords = PROVINCE_COORDINATES[province];
        if (!coords) return null;
        
        const intensity = count / maxCount;
        let color, radius;
        
        if (intensity < 0.25) {
            color = '#D3F26A';
            radius = 8;
        } else if (intensity < 0.5) {
            color = '#8BA63D';
            radius = 12;
        } else if (intensity < 0.75) {
            color = '#667A30';
            radius = 16;
        } else {
            color = '#4A5A22';
            radius = 20;
        }
        
        return {
            province,
            count,
            lat: coords[0],
            lng: coords[1],
            color,
            radius
        };
    }).filter(Boolean);

    // Top provinces
    const topProvinces = data
        .sort((a, b) => b.seller_count - a.seller_count)
        .slice(0, 5);

    return (
        <div className={styles.mapContainer}>
            <div className={styles.mapWrapper}>
                <MapContainer
                    center={[-2.5, 118]}
                    zoom={5}
                    scrollWheelZoom={false}
                    className={styles.leafletMap}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {markers.map((marker, idx) => (
                        <CircleMarker
                            key={idx}
                            center={[marker.lat, marker.lng]}
                            radius={marker.radius}
                            pathOptions={{
                                fillColor: marker.color,
                                fillOpacity: 0.7,
                                color: '#ffffff',
                                weight: 2
                            }}
                        >
                            <Popup>
                                <div className={styles.popup}>
                                    <strong>{getDisplayName(marker.province)}</strong>
                                    <div className={styles.popupCount}>{marker.count} Toko</div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                    
                    <FitBounds positions={markers} />
                </MapContainer>
            </div>

            {/* Bottom Info Section */}
            <div className={styles.mapInfo}>
                {/* Legend */}
                <div className={styles.mapLegend}>
                    <span className={styles.legendLabel}>Sedikit</span>
                    <div className={styles.legendGradient}>
                        <div className={styles.legendStep} style={{background: '#D3F26A'}}></div>
                        <div className={styles.legendStep} style={{background: '#8BA63D'}}></div>
                        <div className={styles.legendStep} style={{background: '#667A30'}}></div>
                        <div className={styles.legendStep} style={{background: '#4A5A22'}}></div>
                    </div>
                    <span className={styles.legendLabel}>Banyak</span>
                </div>

                {/* Stats Summary */}
                <div className={styles.mapStats}>
                    <div className={styles.mapStat}>
                        <span className={styles.mapStatNumber}>{activeProvinces}</span>
                        <span className={styles.mapStatLabel}>Provinsi Aktif</span>
                    </div>
                    <div className={styles.mapStatDivider}></div>
                    <div className={styles.mapStat}>
                        <span className={styles.mapStatNumber}>{totalSellers}</span>
                        <span className={styles.mapStatLabel}>Total Toko</span>
                    </div>
                </div>

                {/* Top Provinces List */}
                {topProvinces.length > 0 && (
                    <div className={styles.topProvinces}>
                        <span className={styles.topLabel}>Top 5 Provinsi:</span>
                        <div className={styles.topList}>
                            {topProvinces.map((item, idx) => (
                                <div key={idx} className={styles.topItem}>
                                    <span className={styles.topRank}>{idx + 1}</span>
                                    <span className={styles.topName}>
                                        {getDisplayName(normalizeProvinceName(item.province))}
                                    </span>
                                    <span className={styles.topCount}>{item.seller_count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
