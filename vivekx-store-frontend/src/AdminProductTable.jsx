import API_BASE_URL from "./config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, RotateCcw, Eye, EyeOff } from "lucide-react";
import "./App.css";

function AdminProductTable() {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [categoryFilter, setCategoryFilter] = useState("all");

    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));


    /* load */

    function loadProducts() {

        fetch(

            `${API_BASE_URL}/api/products/admin/all`,

            {

                headers: {

                    Authorization: `Bearer ${user.token}`

                }

            }

        )

            .then(r => r.json())

            .then(data => {

                setProducts(data);

                setLoading(false);

            });

    }


    useEffect(() => {

        loadProducts();

    }, []);


    useEffect(() => {

        function refresh() {

            loadProducts();

        }

        window.addEventListener("product-added", refresh);

        return () =>

            window.removeEventListener("product-added", refresh);

    }, []);


    /* delete (soft) */

    function deleteProduct(id) {

        if (!window.confirm("Hide product?")) return;

        fetch(

            `${API_BASE_URL}/api/products/${id}`,

            {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${user.token}`

                }

            }

        ).then(loadProducts);

    }


    /* restore */

    function restoreProduct(id) {

        fetch(

            `${API_BASE_URL}/api/products/restore/${id}`,

            {

                method: "PUT",

                headers: {

                    Authorization: `Bearer ${user.token}`

                }

            }

        ).then(loadProducts);

    }


    /* toggle */

    function toggleStatus(id) {

        fetch(

            `${API_BASE_URL}/api/products/toggle/${id}`,

            {

                method: "PUT",

                headers: {

                    Authorization: `Bearer ${user.token}`

                }

            }

        ).then(loadProducts);

    }


    /* filters */

    const filteredProducts = products.filter(p => {

        const matchSearch =

            p.name.toLowerCase().includes(search.toLowerCase())

            ||

            p.category?.toLowerCase().includes(search.toLowerCase());


        const matchCategory =

            categoryFilter === "all"

            ||

            p.category === categoryFilter;


        return matchSearch && matchCategory;

    });


    const categories = [

        "Watch",

        "Shoes",

        "Clothing",

        "Accessories"

    ];


    if (loading)

        return <p>loading...</p>;


    return (

        <div className="admin-table glass">

            <h2 className="gold-text">

                Product Manager

            </h2>


            {/* filters */}

            <div className="admin-filters">


                <input

                    placeholder="Search name..."

                    className="admin-search"

                    value={search}

                    onChange={e => setSearch(e.target.value)}

                />


                <select

                    value={categoryFilter}

                    onChange={e => setCategoryFilter(e.target.value)}

                    className="admin-category-filter"

                >

                    <option value="all">

                        All categories

                    </option>


                    {categories.map(c => (

                        <option key={c} value={c}>

                            {c}

                        </option>

                    ))}


                </select>


            </div>


            <table>


                <thead>

                    <tr>

                        <th>Image</th>

                        <th>Name</th>

                        <th>Category</th>

                        <th>Price</th>

                        <th>Discount</th>

                        <th>Stock</th>

                        <th>Status</th>

                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>


                    {filteredProducts.length === 0 && (

                        <tr>

                            <td colSpan="8">

                                No matching products

                            </td>

                        </tr>

                    )}


                    {filteredProducts.map(p => (


                        <tr key={p.id}>


                            {/* image */}

                            <td>

                                <img

                                    src={
                                        (typeof p.images?.[0] === "object" ? p.images[0].image : p.images?.[0])
                                        ||
                                        p.imageUrl

                                        ||

                                        "https://dummyimage.com/60x60/000/fff"

                                    }

                                    className="table-img"

                                    onError={e => {

                                        e.target.src =

                                            "https://dummyimage.com/60x60/000/fff";

                                    }}

                                />

                            </td>


                            {/* name */}

                            <td>

                                {p.name}

                            </td>


                            {/* category */}

                            <td>

                                {p.category}

                            </td>


                            {/* price */}

                            <td>

                                ₹{p.price}

                            </td>


                            {/* discount */}

                            <td>

                                {p.discountPrice

                                    ? `₹${p.discountPrice}`

                                    : "-"}

                            </td>


                            {/* stock */}

                            <td>

                                {p.stock}

                                {p.stock < 5 && (

                                    <span className="low-stock">

                                        LOW

                                    </span>

                                )}

                            </td>


                            {/* status */}

                            <td>

                                <span

                                    className={

                                        p.active

                                            ? "status-active"

                                            : "status-hidden"

                                    }

                                >

                                    {p.active

                                        ? "Active"

                                        : "Hidden"}

                                </span>

                            </td>


                            {/* actions */}

                            <td className="admin-actions">


                                <Link to={`/edit/${p.id}`}>

                                    <button className="edit-btn">

                                        Edit

                                    </button>

                                </Link>


                                {/* toggle */}

                                <button

                                    className="view-btn"

                                    onClick={() => toggleStatus(p.id)}

                                >

                                    {p.active

                                        ? <EyeOff size={16} />

                                        : <Eye size={16} />}

                                </button>


                                {/* delete */}

                                <button

                                    className="delete-btn-red"

                                    onClick={() => deleteProduct(p.id)}

                                >

                                    <Trash2 size={16} />

                                </button>


                                {/* restore */}

                                {!p.active && (

                                    <button

                                        className="restore-btn"

                                        onClick={() => restoreProduct(p.id)}

                                    >

                                        <RotateCcw size={16} />

                                    </button>

                                )}


                            </td>


                        </tr>


                    ))}


                </tbody>


            </table>


        </div>

    );

}

export default AdminProductTable;