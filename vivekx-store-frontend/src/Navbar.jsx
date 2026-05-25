import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import "./collectibles.css";

export default function Navbar() {

    const [xp, setXP] = useState(0);

    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.token) return;

        fetch(`${API_BASE_URL}/api/xp/${user.id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Unauthorized");
                return res.text();
            })
            .then(data => setXP(parseInt(data)))
            .catch(err => {
                console.log("XP fetch error:", err);
            });

    }, []);

    return (

        <div className="xp-navbar">

            <div className="xp-wrapper">

                <span className="xp-text">
                    XP {xp}
                </span>

                <div className="xp-container">

                    <div
                        className="xp-bar"
                        style={{
                            width: `${Math.min(xp, 500) / 5}%`
                        }}
                    />

                </div>

            </div>

        </div>

    );

}