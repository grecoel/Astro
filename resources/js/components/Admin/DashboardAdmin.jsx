import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import styles from "./Admin.module.css";

function DashboardAdmin() {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        axios
            .get("/api/admin/pending-sellers", { withCredentials: true })
            .then((res) => {
                setPendingCount(res.data.length);
            })
            .catch((err) => {
                console.error("Error loading pending sellers:", err);
            });
    }, []);

    return (
        <AdminLayout title="Dashboard Admin">
            <div className={styles.dashboardBox}>
                <h2>Selamat Datang, Admin 👋</h2>
                <p>Anda dapat melakukan verifikasi pendaftar seller.</p>

                <div className={styles.infoCard}>
                    <h3>Pendaftar Menunggu Verifikasi</h3>
                    <p className={styles.infoNumber}>{pendingCount}</p>

                    <a 
                        href="/admin/verifikasi" 
                        className={styles.primaryBtn}
                    >
                        Lihat daftar verifikasi →
                    </a>
                </div>
            </div>
        </AdminLayout>
    );
}

export default DashboardAdmin;