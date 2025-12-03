import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './IndonesiaMap.module.css';

// Alias mapping for common variations
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

// Get display name (shorter version)
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

// Map bounds component
function MapBounds() {
    const map = useMap();
    
    useEffect(() => {
        // Set bounds to Indonesia
        map.setView([-2.5, 118], 5);
        map.setMinZoom(4);
        map.setMaxZoom(8);
    }, [map]);
    
    return null;
}

export default function IndonesiaMap({ data = [] }) {
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [geoJsonData, setGeoJsonData] = useState(null);
    const geoJsonRef = useRef(null);
    
    // Load GeoJSON from file
    useEffect(() => {
        const loadGeoJSON = async () => {
            try {
                const response = await fetch('/geojson/38_provinsi_indo.json');
                if (response.ok) {
                    const data = await response.json();
                    setGeoJsonData(data);
                } else {
                    console.warn('GeoJSON file not found, using fallback');
                    setGeoJsonData(INDONESIA_GEOJSON);
                }
            } catch (error) {
                console.warn('Error loading GeoJSON:', error);
                setGeoJsonData(INDONESIA_GEOJSON);
            }
        };
        
        loadGeoJSON();
    }, []);
    
    // Process data - aggregate by province
    const provinceData = {};
    data.forEach(item => {
        const normalized = normalizeProvinceName(item.province);
        if (normalized) {
            provinceData[normalized] = (provinceData[normalized] || 0) + item.seller_count;
        }
    });

    const maxCount = Math.max(...Object.values(provinceData), 1);
    const totalSellers = data.reduce((sum, d) => sum + d.seller_count, 0);
    const activeProvinces = Object.keys(provinceData).length;

    // Base color for choropleth (Green theme)
    const BASE_COLOR = '#667A30';
    
    // Get opacity based on count (0.15 to 1.0)
    const getOpacity = (count) => {
        if (count === 0) return 0.1;
        const intensity = count / maxCount;
        return 0.15 + (intensity * 0.85); // Range from 0.15 to 1.0
    };

    // Style function for GeoJSON
    const getProvinceStyle = (feature) => {
        // Handle both simplified format (name) and real GeoJSON format (PROVINSI)
        const provinceName = feature.properties.name || feature.properties.PROVINSI;
        const normalizedName = normalizeProvinceName(provinceName);
        const count = provinceData[normalizedName] || 0;
        const opacity = getOpacity(count);
        const isHovered = hoveredProvince === normalizedName;
        
        return {
            fillColor: BASE_COLOR,
            fillOpacity: isHovered ? Math.min(opacity + 0.2, 1) : opacity,
            color: isHovered ? '#3A4D1A' : '#ffffff',
            weight: isHovered ? 3 : 1.5,
            opacity: 1
        };
    };

    // Event handlers for each province
    const onEachProvince = (feature, layer) => {
        // Handle both simplified format (name) and real GeoJSON format (PROVINSI)
        const provinceName = feature.properties.name || feature.properties.PROVINSI;
        const normalizedName = normalizeProvinceName(provinceName);
        const count = provinceData[normalizedName] || 0;
        
        // Bind popup
        layer.bindPopup(`
            <div style="text-align: center; padding: 8px; min-width: 100px;">
                <strong style="font-size: 14px; color: #2d3436;">${getDisplayName(normalizedName)}</strong>
                <div style="font-size: 20px; font-weight: 700; color: #667A30; margin-top: 4px;">
                    ${count} <span style="font-size: 12px; font-weight: 400;">Toko</span>
                </div>
            </div>
        `);
        
        layer.on({
            mouseover: (e) => {
                setHoveredProvince(normalizedName);
                e.target.setStyle({
                    fillOpacity: Math.min(getOpacity(count) + 0.2, 1),
                    color: '#3A4D1A',
                    weight: 3
                });
                e.target.bringToFront();
            },
            mouseout: (e) => {
                setHoveredProvince(null);
                e.target.setStyle(getProvinceStyle(feature));
            }
        });
    };

    return (
        <div className={styles.mapContainer}>
            <div className={styles.mainLayout}>
                {/* Map Section */}
                <div className={styles.mapWrapper}>
                    <MapContainer
                        center={[-2.5, 118]}
                        zoom={5}
                        scrollWheelZoom={true}
                        className={styles.leafletMap}
                        style={{ height: '420px', width: '100%', borderRadius: '12px' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                        />
                        
                        {geoJsonData && (
                            <GeoJSON 
                                ref={geoJsonRef}
                                data={geoJsonData}
                                style={getProvinceStyle}
                                onEachFeature={onEachProvince}
                            />
                        )}
                        
                        <MapBounds />
                    </MapContainer>

                    {/* Legend & Stats */}
                    <div className={styles.mapFooter}>
                        <div className={styles.mapLegend}>
                            <span className={styles.legendLabel}>Sedikit</span>
                            <div className={styles.legendGradient}>
                                <div className={styles.legendStep} style={{background: BASE_COLOR, opacity: 0.15}}></div>
                                <div className={styles.legendStep} style={{background: BASE_COLOR, opacity: 0.35}}></div>
                                <div className={styles.legendStep} style={{background: BASE_COLOR, opacity: 0.55}}></div>
                                <div className={styles.legendStep} style={{background: BASE_COLOR, opacity: 0.75}}></div>
                                <div className={styles.legendStep} style={{background: BASE_COLOR, opacity: 1}}></div>
                            </div>
                            <span className={styles.legendLabel}>Banyak</span>
                        </div>

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
                            <div className={styles.mapStatDivider}></div>
                            <div className={styles.mapStat}>
                                <span className={styles.mapStatNumber}>{maxCount}</span>
                                <span className={styles.mapStatLabel}>Jumlah Toko Terbanyak dalam 1 Provinsi</span>
                            </div>
                            <div className={styles.mapStatDivider}></div>
                            <div className={styles.mapStat}>
                                <span className={styles.mapStatNumber}>{totalSellers > 0 ? Math.round(totalSellers / activeProvinces) : 0}</span>
                                <span className={styles.mapStatLabel}>Rata-rata</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Province List */}
                <div className={styles.provinceListWrapper}>
                    <div className={styles.provinceListHeader}>
                        <div>
                            <h4>Sebaran Toko per Provinsi</h4>
                            <p className={styles.provinceListSubtitle}>Ranking berdasarkan jumlah toko</p>
                        </div>
                        <span className={styles.provinceCount}>{data.length} Provinsi</span>
                    </div>
                    <div className={styles.provinceListStats}>
                        <div className={styles.listStatItem}>
                            <span className={styles.listStatLabel}>Tertinggi:</span>
                            <span className={styles.listStatValue}>{data.length > 0 ? data.sort((a, b) => b.seller_count - a.seller_count)[0].seller_count : 0}</span>
                        </div>
                        <div className={styles.listStatDivider}></div>
                        <div className={styles.listStatItem}>
                            <span className={styles.listStatLabel}>Rata-rata:</span>
                            <span className={styles.listStatValue}>{data.length > 0 ? Math.round(totalSellers / data.length) : 0}</span>
                        </div>
                    </div>
                    <div className={styles.provinceList}>
                        {data
                            .sort((a, b) => b.seller_count - a.seller_count)
                            .map((item, idx) => {
                                const normalized = normalizeProvinceName(item.province);
                                const opacity = getOpacity(item.seller_count);
                                const maxCount = data.length > 0 ? data.sort((a, b) => b.seller_count - a.seller_count)[0].seller_count : 1;
                                const barPercentage = (item.seller_count / maxCount) * 100;
                                return (
                                    <div 
                                        key={idx} 
                                        className={`${styles.provinceItem} ${hoveredProvince === normalized ? styles.provinceItemHovered : ''}`}
                                        onMouseEnter={() => setHoveredProvince(normalized)}
                                        onMouseLeave={() => setHoveredProvince(null)}
                                    >
                                        <div className={styles.provinceItemTop}>
                                            <div className={styles.provinceItemRankSection}>
                                                <div className={styles.provinceRank}>{idx + 1}</div>
                                                <div className={styles.provinceItemName}>
                                                    <span className={styles.provinceName}>
                                                        {getDisplayName(normalized)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.provinceItemCountSection}>
                                                <span className={styles.countNumber}>{item.seller_count}</span>
                                            </div>
                                        </div>
                                        <div className={styles.provinceItemBar}>
                                            <div 
                                                className={styles.progressBar}
                                                style={{ 
                                                    width: `${barPercentage}%`,
                                                    backgroundColor: BASE_COLOR,
                                                    opacity: opacity
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}
