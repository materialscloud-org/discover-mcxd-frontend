import { Container } from "react-bootstrap";

import MaterialsCloudHeader from "mc-react-header";

import { TitleAndLogo } from "@mcxd/shared";

import Mc2dLogo from "../assets/mc2d.png";

export default function PageLayout({ children, breadcrumbs = [] }) {
  const defaultBreadcrumbs = [
    {
      name: "Discover",
      link: "https://www.materialscloud.org/discover",
    },
    {
      name: "Materials Cloud Two-Dimensional Structure Database",
      link: `${import.meta.env.BASE_URL}`,
    },
  ];

  // make last breadcrumb non-hyperlinked.
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
          titleString="Materials Cloud Two-Dimensional Structure Database (MC2D)"
          imgSrc={Mc2dLogo}
          doiIds={["az-b2", "36-nd"]}
        />
        {children}
      </Container>
    </>
  );
}
