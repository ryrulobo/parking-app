import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function PageLayout() {
  return (
    <>
      <Navbar />
      <div className="p-2">
        <Outlet />
      </div>
    </>
  );
}
