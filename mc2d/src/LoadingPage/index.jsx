import { McloudSpinner } from "mc-react-library";

import PageLayout from "../Layout";

function LoadingPage() {
  return (
    <PageLayout>
      <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
        <McloudSpinner />
      </div>
    </PageLayout>
  );
}

export default LoadingPage;
