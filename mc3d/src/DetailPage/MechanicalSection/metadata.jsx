const MECHANICAL_PROPERTY_META = {
  bulk_modulus: {
    order: 1,
    symbol: "B",
    name: "Bulk modulus",
    unit: "GPa",
    decimals: 2,
  },

  shear_modulus: {
    order: 2,
    symbol: "G",
    name: "Shear modulus",
    unit: "GPa",
    decimals: 2,
  },

  young_modulus: {
    order: 3,
    symbol: "E",
    name: "Young's modulus",
    unit: "GPa",
    decimals: 2,
  },

  p_wave_modulus: {
    order: 4,
    symbol: "M",
    name: "P-wave modulus",
    unit: "GPa",
    decimals: 2,
  },

  lame_1st_para: {
    order: 5,
    symbol: "λ",
    name: "First Lamé parameter",
    unit: "GPa",
    decimals: 2,
  },

  lame_2nd_para: {
    order: 6,
    symbol: "μ",
    name: "Second Lamé parameter",
    unit: "GPa",
    decimals: 2,
  },

  debye_temp: {
    order: 7,
    symbol: (
      <>
        Θ<sup>D</sup>
      </>
    ),
    name: "Debye temperature",
    unit: "K",
    decimals: 1,
  },

  melting_temp: {
    order: 8,
    symbol: "Tm",
    name: "Melting temperature",
    unit: "K",
    decimals: 1,
  },

  sound_vel_bulk: {
    order: 9,
    symbol: (
      <>
        v<sup>B</sup>
      </>
    ),
    name: "Bulk sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_LA: {
    order: 10,
    symbol: (
      <>
        v<sup>LA</sup>
      </>
    ),
    name: "Longitudinal acoustic sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  longitudinal_modulus_L: {
    order: 11,
    symbol: "L",
    name: "Longitudinal modulus",
    unit: "GPa",
  },

  sound_vel_TA: {
    order: 12,
    symbol: (
      <>
        v<sup>TA</sup>
      </>
    ),
    name: "Transverse acoustic sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_mean: {
    order: 13,
    symbol: (
      <>
        v<sup>m</sup>
      </>
    ),
    name: "Mean sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  poisson_ratio: {
    order: 14,
    symbol: "ν",
    name: "Poisson's ratio",
    unit: null,
    decimals: 3,
  },

  pugh_ratio: {
    order: 15,
    symbol: (
      <>
        r<sup>Pugh</sup>
      </>
    ),
    name: "Pugh ratio",
    unit: null,
    decimals: 3,
  },

  pettifor_ratio: {
    order: 16,
    symbol: (
      <>
        r<sup>Pett</sup>
      </>
    ),
    name: "Pettifor ratio",
    unit: null,
    decimals: 3,
  },

  modified_pettifor_ratio: {
    order: 17,
    symbol: (
      <>
        r̃<sup>Pett</sup>
      </>
    ),
    name: "Modified Pettifor ratio",
    unit: null,
    decimals: 3,
  },

  c: {
    order: 18,
    // symbol: "c",
    name: "c ratio",
    unit: null,
    decimals: 3,
  },

  min_kappa: {
    order: 19,
    symbol: (
      <>
        κ<sup>min</sup>
      </>
    ),
    name: "Minimum thermal conductivity",
    unit: "W/(m·K)",
    decimals: 3,
  },

  sound_vel_shear: {
    order: 20,
    symbol: "vS",
    name: "Shear sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_compressional: {
    order: 21,
    symbol: "vP",
    name: "Compressional sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  vickers_hardness: {
    order: 22,
    symbol: "HV",
    name: "Vickers hardness",
    unit: "GPa",
    decimals: 2,
  },

  elastic_constants: {
    order: 23,
    symbol: "Cij",
    name: "Elastic constants (Cᵢⱼ = δεᵢ/δσⱼ)",
    unit: "GPa",
    decimals: 2,
  },
};

export default MECHANICAL_PROPERTY_META;
