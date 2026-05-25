import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import "./collectibles.css";

export default function MyCollectibles() {

    const [items, setItems] = useState([]);

    useEffect(() => {

        fetch(`${API_BASE_URL}/api/ownership/user/1`)
            .then(res => res.json())
            .then(data => {

                console.log("collectibles", data);

                setItems(data);

            });

    }, []);


    return (

        <div style={{ padding: "40px" }}>

            <h2>My Collectibles</h2>


            {/* rarity legend */}

            <div className="rarity-legend">

                <div className="legend-box">

                    <div
                        className="legend-color"
                        style={{ background: "#a855f7" }}
                    />

                    ULTRA RARE

                </div>


                <div className="legend-box">

                    <div
                        className="legend-color"
                        style={{ background: "#3b82f6" }}
                    />

                    RARE

                </div>


                <div className="legend-box">

                    <div
                        className="legend-color"
                        style={{ background: "#888" }}
                    />

                    COMMON

                </div>

            </div>



            <div style={{

                display: "grid",

                gridTemplateColumns: "repeat(auto-fill, 250px)",

                gap: "30px",

                marginTop: "20px"

            }}>


                {items.map((item) => {

                    const p = item.product;

                    if (!p) return null;


                    return (

                        <div

                            key={item.id}

                            className={`rarity-${p.rarityLevel}`}

                            style={{

                                padding: "15px",

                                borderRadius: "12px",

                                background: "white",

                                position: "relative"

                            }}

                        >


                            {/* owned badge */}

                            <div className="collectible-badge">

                                OWNED

                            </div>



                            <img

                                src={p.imageUrl}

                                style={{

                                    width: "100%",

                                    borderRadius: "10px"

                                }}

                            />


                            <h3 style={{ marginTop: "10px" }}>

                                {p.name}

                            </h3>


                            <p style={{

                                fontWeight: "600"

                            }}>

                                {p.rarityLevel}

                            </p>


                            <p style={{

                                fontSize: "14px",

                                opacity: 0.7

                            }}>

                                Edition #{p.editionNumber}

                            </p>


                        </div>

                    );

                })}

            </div>

        </div>

    );

}