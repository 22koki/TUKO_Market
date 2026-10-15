import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./pages/Marketplace", () => () => <div>TUKO Marketplace</div>);
jest.mock("./pages/VendorDashboard", () => () => <div>Vendor workspace</div>);
jest.mock("./pages/RiderDashboard", () => () => <div>Rider workspace</div>);
jest.mock("./pages/MyOrders", () => () => <div>My orders</div>);

test("renders the TUKO marketplace at the home route", () => {
  window.history.pushState({}, "", "/");
  render(<App />);
  expect(screen.getByText("TUKO Marketplace")).toBeInTheDocument();
});
