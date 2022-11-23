import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import AddData from "../views/AddData";
import Report from "../views/Report";

const router = createBrowserRouter([
  {
    element: <PageLayout />,
    children: [
      {
        path: "/",
        element: <AddData />,
      },
      {
        path: "/reports",
        element: <Report />,
      },
    ],
  },
]);

export default router;
