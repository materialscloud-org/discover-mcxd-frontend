import {
  OverviewIcon,
  StructureIcon,
  ElectronicIcon,
  VibrationalIcon,
  TopologyIcon,
  ParentsIcon,
} from "../assets/sectionIcons";

/**
 * Central ToC registry for the MC2D detail page.
 *
 * Each entry: { id, label, logo }.
 * - `id` must match the `data-toc-section` attribute on the section's
 *   existing HTML element (see each *Section/index.jsx).
 * - `logo` is any React node, reused wherever sections are listed.
 *
 * The ToC itself is built from the existing HTML: only entries found in
 * the DOM are shown (so the conditional topology section appears on its
 * own), in this order.
 */
export const MC2D_TOC_REGISTRY = [
  { id: "overview", label: "General overview", logo: <OverviewIcon /> },
  { id: "structure", label: "Structural details", logo: <StructureIcon /> },
  { id: "electronic", label: "Electronic properties", logo: <ElectronicIcon /> },
  {
    id: "vibrational",
    label: "Vibrational properties",
    logo: <VibrationalIcon />,
  },
  {
    id: "topology",
    label: "Topological insulators",
    logo: <TopologyIcon />,
  },
  {
    id: "parents-section",
    label: "3D parent crystals",
    logo: <ParentsIcon />,
  },
];
