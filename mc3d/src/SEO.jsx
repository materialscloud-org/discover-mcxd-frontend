import { Helmet } from "react-helmet-async";

export const SEO = ({ title, description, formula, id }) => {
  const siteName = "Materials Cloud 3D";
  const fullTitle = formula ? `${formula} | ${id} | ${siteName}` : title;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph for Social Media */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};
