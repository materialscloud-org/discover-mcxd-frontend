import MaterialsCloudHeader from "mc-react-header";

import { McloudSpinner } from "mc-react-library";

import Mc3dLogo from "../assets/mc3d.png";
import { TitleAndLogo } from "@mcxd/shared";

import { Container } from "react-bootstrap";

function LoadingPage() {
  return (
    <>
      <MaterialsCloudHeader
        activeSection={"discover"}
        breadcrumbsPath={[
          {
            name: "Discover",
            link: "https://www.materialscloud.org/discover",
          },
          {
            name: "Materials Cloud Three-Dimensional Structure Database",
            link: `${import.meta.env.BASE_URL}`,
          },
        ]}
      />
      <Container fluid="xxl">
        <TitleAndLogo
          titleString={
            "Materials Cloud Three-Dimensional Structure Database (MC3D)"
          }
          imgSrc={Mc3dLogo}
          doiIds={["rw-t0"]}
        />
        <div style={{ width: "150px", padding: "40px", margin: "0 auto" }}>
          <McloudSpinner />
        </div>
      </Container>
    </>
  );
}

export default LoadingPage;
