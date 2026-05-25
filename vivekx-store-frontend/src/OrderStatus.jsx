import "./App.css";

function OrderStatus({ status }) {
  const steps = ["PLACED", "PAID", "SHIPPED", "DELIVERED"];
  const activeIndex = steps.indexOf(status);

  return (
    <div className="status-bar">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`status-step ${
            index <= activeIndex ? "active" : ""
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}

export default OrderStatus;