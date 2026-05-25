import API_BASE_URL from "./config";
function handleBuyNow() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.token) {
    alert("Login required");
    return;
  }

  fetch(
    `${API_BASE_URL}/api/orders/buy-now?productId=${product.id}&quantity=${qty}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    }
  )
    .then(res => {
      if (!res.ok) throw new Error("Buy Now failed");
      return res.json();
    })
    .then(order => {
      // 🔥 Trigger UI updates
      window.dispatchEvent(new Event("orders-updated"));

      // 🚀 Redirect to success page
      navigate("/order-success", { state: { order } });
    })
    .catch(err => {
      console.error(err);
      alert("Buy Now failed");
    });
}