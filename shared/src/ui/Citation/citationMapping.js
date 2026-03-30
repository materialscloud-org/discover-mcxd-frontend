/* We use Citations throughout mcxd to attach information to a piece of data.

Sometimes, some data may be assoiciated with multiple citations.
There are two styles of citations we use
1. A small short form Citation with a mc-doi symbol
2. A full box citation with potentially many hyperlinks (data, paper1. paper2. paper3 etc.)

All citations are stored here as a central location.
*/

export const CITATION_MAPPING = {
  // MC2D
  Mounet18: {
    authors: [
      "N. Mounet",
      "M. Gibertini",
      "P. Schwaller",
      "D. Campi",
      "A. Merkys",
      "A. Marrazzo",
      "T. Sohier",
      "I. E. Castelli",
      "A. Cepellotti",
      "G. Pizzi",
      "N. Marzari",
    ],
    authorsShort: "N. Mounet et al.",
    assoiciatedDois: [
      {
        type: "paper",
        year: 2018,
        doi: "10.1038/s41565-017-0035-5",
        journal: "Nature Nanotech",
        journalRef: "Nature Nanotech 13, 246-252 (2018)",
        journalRefShort: "Nat. Nanotech. 13, 246-252",
        title: `Two-dimensional materials from high-throughput
        computational exfoliation of experimentally known compounds`,
      },
      {
        type: "data",
        year: 2020,
        doi: "10.24435/materialscloud:az-b2",
        journal: "Materials Cloud Archive",
        journalRef: "Materials Cloud Archive, 2020.158",
        journalRefShort: "Materials Cloud Archive",
        title: `Two-dimensional materials from high-throughput
          computational exfoliation of experimentally known compounds`,
      },
      {
        type: "preprint",
        year: 2016,
        doi: "10.48550/arXiv.1611.05234",
        journal: "arXiv",
        journalRef: "arXiv:1611.05234, cond-mat.mtrl-sci",
        journalRefShort: "arXiv:1611.05234",
        title: `Two-dimensional materials from high-throughput
           computational exfoliation of experimentally known compounds`,
      },
    ],
  },
  Campi23: {
    authors: [
      "D. Campi",
      "N. Mounet",
      "M. Gibertini",
      "G. Pizzi",
      "N. Marzari",
    ],
    authorsShort: "Campi et al.",
    assoiciatedDois: [
      {
        type: "paper",
        year: 2023,
        doi: "10.1021/acsnano.2c11510",
        journal: "ACS Nano",
        journalRef: "ACS Nano 2023, 17 (12), 11268–11278",
        journalRefShort: "ACS Nano 17, 11268–11278",
        title: "Expansion of the Materials Cloud 2D Database",
      },
      {
        type: "data",
        year: 2022,
        doi: "10.24435/materialscloud:36-nd",
        journal: "Materials Cloud Archive",
        journalRef: "Materials Cloud Archive, 2022.84",
        journalRefShort: "Materials Cloud Archive",
        title: "Materials Cloud two‑dimensional structure database (MC2D)",
      },
      {
        type: "preprint",
        year: 2022,
        doi: "10.48550/arXiv.2210.11301",
        journal: "arXiv",
        journalRef: "arXiv:2210.11301, cond-mat.mtrl-sci",
        journalRefShort: "arXiv:2210.11301",
        title: "Novel materials in the Materials Cloud 2D database",
      },
    ],
  },
  Marrazzo2019: {
    authors: [
      "A. Marrazzo",
      "M. Gibertini",
      "D. Campi",
      "N. Mounet",
      "N. Marzari",
    ],
    authorsShort: "Marrazzo et al.",
    assoiciatedDois: [
      {
        type: "paper",
        year: 2019,
        doi: "10.1021/acs.nanolett.9b02689",
        journal: "ACS Nano Letters",
        journalRef: "ACS Nano Letters 2019, 19 (12), 8431–8440",
        journalRefShort: "ACS Nano Lett. 12, 8431–8440",
        title:
          "Relative Abundance of Z₂ Topological Order in Exfoliable Two-Dimensional Insulators",
      },
      {
        type: "data",
        year: 2022,
        doi: "10.24435/materialscloud:cm-7p",
        journal: "Materials Cloud Archive",
        journalRef: "Materials Cloud Archive, 2020.86",
        journalRefShort: "Materials Cloud Archive",
        title:
          "Relative abundance of Z₂ topological Order in exfoliable two-dimensional insulators",
      },
    ],
  },

  Grassano2023: {
    authors: ["D. Grassano", "D. Campi", "A. Marrazzo", "N. Marzari"],
    authorsShort: "Grassano et al.",
    assoiciatedDois: [
      {
        type: "paper",
        year: 2023,
        doi: "10.1103/PhysRevMaterials.7.094202",
        journal: "Physical Review Materials,",
        journalRef: "Phys. Rev. Materials 7, 094202-094209",
        journalRefShort: "Phys. Rev. Mater. 7, 094202",
        title:
          "Complementary screening for quantum spin Hall insulators in two-dimensional exfoliable materials",
      },
      {
        type: "data",
        year: 2023,
        doi: "10.24435/materialscloud:ea-d3",
        journal: "Materials Cloud Archive",
        journalRef: "Materials Cloud Archive, 2023.9",
        journalRefShort: "Materials Cloud Archive",
        title:
          "A complementary screening for quantum spin Hall insulators in 2D exfoliable materials",
      },
    ],
  },

  // MC3D
  HuberMc3d25: {
    authors: [
      "S. P. Huber",
      "M. Minotakis",
      "M. Bercx",
      "T. Reents",
      "K. Eimre",
      "N. Paulish",
      "N. Hörmann",
      "M. Uhrin",
      "N. Marzari",
      "G. Pizzi",
    ],
    authorsShort: "Huber et al.",
    assoiciatedDois: [
      {
        type: "paper",
        year: 2026,
        doi: "10.1039/D5DD00415B",
        journal: "Digital Discovery",
        journalRef: "Digital Discovery, 5, 1114-1131 (2026)",
        journalRefShort: "Digital Discovery, 5, 1114",
        title:
          "MC3D: the materials cloud computational database of experimentally known stoichiometric inorganics",
      },
      {
        type: "preprint",
        year: 2025,
        doi: "10.48550/arXiv.2508.19223",
        journal: "arXiv",
        journalRef: "arXiv:2508.19223",
        journalRefShort: "arXiv:2508.19223",
        title:
          "MC3D: The Materials Cloud computational database of experimentally known stoichiometric inorganics",
      },
      {
        type: "data",
        year: 2025,
        doi: "10.24435/materialscloud:jn-ac",
        journal: "Materials Cloud Archive",
        journalRef: "Materials Cloud Archive, 2025.139",
        journalRefShort: "Materials Cloud Archive",
        title: "Materials Cloud three-dimensional structure database (MC3D)",
      },
    ],
  },
  // MC3D Contributed
  MBercxSupercon25: {
    authors: [
      "M. Bercx",
      "S. Poncé",
      "Y. Zhang",
      "G. Trezza",
      "A. G. Ghezeljehmeidan",
      "L. Bastonero",
      "J. Qiao",
      "F. O. von Rohr",
      "G. Pizzi",
    ],
    authorsShort: "Bercx et al.",
    assoiciatedDois: [
      {
        type: "paper",
        year: 2025,
        doi: "10.1103/sb28-fjc9",
        journal: "PRX Energy",
        journalRef: "PRX Energy 4, 033012 (2025)",
        journalRefShort: "PRX Energy 4, 033012",
        title: `Charting the landscape of Bardeen‑Cooper‑Schrieffer 
         superconductors in experimentally known compounds`,
      },
      {
        type: "data",
        year: 2025,
        doi: "10.24435/materialscloud:c2-ap",
        journal: "Materials Cloud Archive",
        journalRef: "Materials Cloud Archive, 2025.175",
        journalRefShort: "Materials Cloud Archive",
        title: `Charting the landscape of Bardeen–Cooper–Schrieffer
         superconductors in experimentally known compounds`,
      },
      {
        type: "preprint",
        year: 2025,
        doi: "10.48550/arXiv.2503.10943",
        journal: "arXiv",
        journalRef: "arXiv:2503.10943 [cond-mat.supr-con]",
        journalRefShort: "arXiv:2503.10943",
        title: `Charting the landscape of Bardeen‑Cooper‑Schrieffer
         superconductors in experimentally known compounds`,
      },
    ],
  },
};
