import { Container } from "react-bootstrap";

import MaterialsCloudHeader from "mc-react-header";

import { TitleAndLogo } from "@mcxd/shared";

import Mc3dLogo from "../assets/mc3d.png";

export default function PageLayout({ children, breadcrumbs = [] }) {
  const defaultBreadcrumbs = [
    {
      name: "Discover",
      link: "https://www.materialscloud.org/discover",
    },
    {
      name: "Materials Cloud Three-Dimensional Structure Database",
      link: `${import.meta.env.BASE_URL}`,
    },
  ];

  const mergedBreadcrumbs = [...defaultBreadcrumbs, ...breadcrumbs].map(
    (crumb, index, arr) => ({
      ...crumb,
      link: index === arr.length - 1 ? null : crumb.link,
    }),
  );

  return (
    <>
      <MaterialsCloudHeader
        activeSection="discover"
        breadcrumbsPath={mergedBreadcrumbs}
      />

      <Container fluid="xxl">
        <TitleAndLogo
          titleString="Materials Cloud Three-Dimensional Structure Database (MC3D)"
          imgSrc={Mc3dLogo}
          doiIds={["rw-t0"]}
        />

        {children}
      </Container>
    </>
  );
}
