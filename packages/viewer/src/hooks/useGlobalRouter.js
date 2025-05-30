import { useNavigate } from "react-router";

export default function useGlobalRouter() {
  const navigate = useNavigate();
  if (!window.__globalRouter) {
    window.__globalRouter = {
      navigate,
    };
  }
}
