import {
  OverviewIcon,
  StructureIcon,
  ProvenanceIcon,
  XrdIcon,
  VibrationalIcon,
  SuperconductivityIcon,
  MechanicalIcon,
} from "../assets/sectionIcons";

/**
 * Central ToC registry for the MC3D detail page.
 *
 * Each entry: { id, label, logo }.
 * - `id` must match the `data-toc-section` attribute on the section's
 *   existing HTML element (see each *Section/index.jsx).
 * - `logo` is any React node, reused wherever sections are listed.
 *
 * The ToC itself is built from the existing HTML: only entries found in
 * the DOM are shown (so async/conditional sections such as vibrational,
 * superconductivity and mechanical appear on their own), in this order.
 */
export const MC3D_TOC_REGISTRY = [
  { id: "overview", label: "General overview", logo: <OverviewIcon /> },
  { id: "structure", label: "Structural details", logo: <StructureIcon /> },
  {
    id: "provenance",
    label: "Calculation information",
    logo: <ProvenanceIcon />,
  },
  { id: "xrd", label: "X-ray diffraction", logo: <XrdIcon /> },
  {
    id: "vibrational",
    label: "Vibrational properties",
    logo: <VibrationalIcon />,
  },
  {
    id: "superconductivity",
    label: "Superconductivity estimation",
    logo: <SuperconductivityIcon />,
  },
  { id: "mechanical", label: "Mechanical details", logo: <MechanicalIcon /> },
];
