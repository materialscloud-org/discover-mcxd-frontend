import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadDatasetIndex } from "../common/MCrestApiUtils";

// TODO - need to globalise this.
const methodHierarchy = ["pbesol-v2", "pbesol-v1", "pbe-v1"];

function RedirectToBestMethod() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    loadDatasetIndex(null, id).then((dataset) => {
      if (!isMounted) return;

      // Get method names from dataset.index object keys
      const availableMethods = Object.keys(dataset.index || {});

      // Pick the first method in the hierarchy that exists
      const bestMethod = methodHierarchy.find((m) =>
        availableMethods.includes(m),
      );

      if (bestMethod) {
        navigate(`/details/${id}/${bestMethod}`, { replace: true });
      } else if (availableMethods.length > 0) {
        // fallback: pick the first available method if none match hierarchy
        navigate(`/details/${id}/${availableMethods[0]}`, { replace: true });
      } else {
        // fallback: no methods exist at all
        navigate("/", { replace: true });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  return null;
}

export default RedirectToBestMethod;
