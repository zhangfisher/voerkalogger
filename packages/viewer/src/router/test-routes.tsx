import { Test } from "@/pages/test";

export const testRoutes = import.meta.env.DEV
  ? [
      {
        path: "/test",
        element: <Test />,
      },
    ]
  : [];
