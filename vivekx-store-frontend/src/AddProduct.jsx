import API_BASE_URL from "./config";
import { useState } from "react";
import "./App.css";

const CLOUD_NAME = "dgpxnwfaq";
const UPLOAD_PRESET = "vivekx_products";

function AddProduct() {

    const [form, setForm] = useState({

        name: "",
        slug: "",
        price: "",
        discountPrice: "",
        stock: "",
        category: "Watch",
        description: "",
        sizes: "",
        colors: "",
        active: true,
        images: []

    });

    const [dragActive, setDragActive] = useState(false);

    const [uploading, setUploading] = useState(false);


    /* slug generator */

    function generateSlug(name) {

        return name.toLowerCase().replace(/\s+/g, "-");

    }


    /* form input change */

    function handleChange(e) {

        const { name, value, type, checked } = e.target;

        setForm({

            ...form,

            [name]: type === "checkbox" ? checked : value,

            slug: name === "name"

                ? generateSlug(value)

                : form.slug

        });

    }


    /* upload to cloudinary */

    async function uploadImage(file) {

        setUploading(true);

        const data = new FormData();

        data.append("file", file);

        data.append("upload_preset", UPLOAD_PRESET);


        const res = await fetch(

            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,

            {

                method: "POST",

                body: data

            }

        );


        const json = await res.json();


        setForm(f => ({

            ...f,

            images: [...f.images, json.secure_url]

        }));


        setUploading(false);

    }


    /* drag upload */

    function handleDrop(e) {

        e.preventDefault();

        setDragActive(false);


        const files = Array.from(e.dataTransfer.files);

        files.forEach(uploadImage);

    }


    /* drag reorder images */

    function dragStart(index) {

        return e => {

            e.dataTransfer.setData("index", index);

        };

    }


    function dropImage(index) {

        return e => {

            e.preventDefault();

            const fromIndex = e.dataTransfer.getData("index");

            const updated = [...form.images];

            const moved = updated.splice(fromIndex, 1)[0];

            updated.splice(index, 0, moved);

            setForm({ ...form, images: updated });

        };

    }


    /* remove image */

    function removeImage(index) {

        const updated = form.images.filter((_, i) => i !== index);

        setForm({ ...form, images: updated });

    }


    /* submit product */
    const user = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    if (!user) {
        alert("User not logged in");
        return;
    }
    function handleSubmit(e) {

        e.preventDefault();


        fetch(`${API_BASE_URL}/api/products`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": user ? `Bearer ${user.token}` : ""   // 🔥 ADD THIS

            },

            body: JSON.stringify({

                name: form.name,

                slug: form.slug,

                price: Number(form.price),

                discountPrice: form.discountPrice

                    ? Number(form.discountPrice)

                    : null,

                stock: Number(form.stock),

                category: form.category,

                description: form.description,

                active: form.active,


                /* convert variants */

                sizes: form.sizes
                    ? form.sizes
                        .split(",")
                        .map(s => s.trim())
                        .filter(Boolean) // ✅ prevents empty values
                        .map(s => ({
                            size: s
                        }))
                    : [],

                colors: form.colors
                    ? form.colors
                        .split(",")
                        .map(c => c.trim())
                        .filter(Boolean) // ✅ prevents empty values
                        .map(c => ({
                            color: c
                        }))
                    : [],

                imageUrl: form.images.length > 0
                    ? form.images[0]
                    : null,

                images: form.images.map(img => ({
                    image: img
                }))
            })
        })
            .then(() => {

                alert("Product added 🚀");


                window.dispatchEvent(

                    new Event("product-added")

                );


                setForm({

                    name: "",

                    slug: "",

                    price: "",

                    discountPrice: "",

                    stock: "",

                    category: "Watch",

                    description: "",

                    sizes: "",

                    colors: "",

                    active: true,

                    images: []

                });

            });

    }


    return (

        <div className="add-product-page" >

            <div className="glass add-product-card">

                <h2 className="gold-text">

                    Add Product

                </h2>


                <form onSubmit={handleSubmit}>


                    <input

                        name="name"

                        placeholder="Product Name"

                        value={form.name}

                        onChange={handleChange}

                    />


                    <input

                        name="price"

                        placeholder="Original Price ₹"

                        value={form.price}

                        onChange={handleChange}

                    />


                    <input

                        name="discountPrice"

                        placeholder="Discount Price ₹"

                        value={form.discountPrice}

                        onChange={handleChange}

                    />


                    <input

                        name="stock"

                        type="number"

                        placeholder="Stock Quantity"

                        value={form.stock}

                        onChange={handleChange}

                    />


                    {/* category */}

                    <select

                        name="category"

                        value={form.category}

                        onChange={handleChange}

                    >

                        <option value="Watch">Watch</option>

                        <option value="Shoes">Shoes</option>

                        <option value="Clothing">Clothing</option>

                        <option value="Accessories">Accessories</option>

                    </select>


                    {/* variants */}

                    <input

                        name="sizes"

                        placeholder="Sizes (comma separated) eg S,M,L"

                        value={form.sizes}

                        onChange={handleChange}

                    />


                    <input

                        name="colors"

                        placeholder="Colors (comma separated) eg Black,White"

                        value={form.colors}

                        onChange={handleChange}

                    />


                    <textarea

                        name="description"

                        placeholder="Description"

                        value={form.description}

                        onChange={handleChange}

                    />


                    {/* active toggle */}

                    <label>

                        <input

                            type="checkbox"

                            name="active"

                            checked={form.active}

                            onChange={handleChange}

                        />

                        Active Product

                    </label>


                    {/* drag upload */}

                    <div

                        className={`drop-zone ${dragActive ? "active" : ""}`}

                        onDragOver={(e) => {

                            e.preventDefault();

                            setDragActive(true);

                        }}

                        onDragLeave={() => setDragActive(false)}

                        onDrop={handleDrop}

                    >

                        <p>

                            Drag images here

                        </p>

                        <span>

                            or click to upload

                        </span>


                        <input

                            type="file"

                            multiple

                            onChange={(e) =>

                                Array.from(e.target.files)

                                    .forEach(uploadImage)

                            }

                        />

                    </div>


                    {uploading && (

                        <p>

                            uploading image...

                        </p>

                    )}


                    {/* preview images */}

                    <div className="preview-row">


                        {form.images.map((img, i) => (


                            <div

                                key={i}

                                draggable

                                onDragStart={dragStart(i)}

                                onDrop={dropImage(i)}

                                onDragOver={(e) => e.preventDefault()}

                                className="preview-box"

                            >


                                <img

                                    src={img}

                                    alt=""

                                    className="preview-img"

                                />


                                <button

                                    type="button"

                                    className="img-delete-btn"

                                    onClick={() => removeImage(i)}

                                >

                                    ✕

                                </button>


                            </div>


                        ))}


                    </div>


                    <button

                        className="lux-btn"

                    >

                        Add Product

                    </button>


                </form>


            </div>

        </div>

    );

}

export default AddProduct;