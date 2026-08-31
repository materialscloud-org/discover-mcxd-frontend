const MECHANICAL_PROPERTY_META = {
  bulk_modulus: {
    symbol: "B",
    name: "Bulk modulus",
    unit: "GPa",
    decimals: 2,
  },

  shear_modulus: {
    symbol: "G",
    name: "Shear modulus",
    unit: "GPa",
    decimals: 2,
  },

  young_modulus: {
    symbol: "E",
    name: "Young's modulus",
    unit: "GPa",
    decimals: 2,
  },

  poisson_ratio: {
    symbol: "ν",
    name: "Poisson's ratio",
    unit: null,
    decimals: 3,
  },

  lame_1st_para: {
    symbol: "λ",
    name: "First Lamé parameter",
    unit: "GPa",
    decimals: 2,
  },

  lame_2nd_para: {
    symbol: "μ",
    name: "Second Lamé parameter",
    unit: "GPa",
    decimals: 2,
  },

  p_wave_modulus: {
    symbol: "M",
    name: "P-wave modulus",
    unit: "GPa",
    decimals: 2,
  },

  pugh_ratio: {
    symbol: "rPugh",
    name: "Pugh ratio",
    unit: null,
    decimals: 3,
  },

  pettifor_ratio: {
    symbol: "rPett",
    name: "Pettifor ratio",
    unit: null,
    decimals: 3,
  },

  modified_pettifor_ratio: {
    symbol: "r̃Pett",
    name: "Modified Pettifor ratio",
    unit: null,
    decimals: 3,
  },

  debye_temp: {
    symbol: "ΘD",
    name: "Debye temperature",
    unit: "K",
    decimals: 1,
  },

  melting_temp: {
    symbol: "Tm",
    name: "Melting temperature",
    unit: "K",
    decimals: 1,
  },

  min_kappa: {
    symbol: "κmin",
    name: "Minimum thermal conductivity",
    unit: "W/(m·K)",
    decimals: 3,
  },

  sound_vel_LA: {
    symbol: "vLA",
    name: "Longitudinal acoustic sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_TA: {
    symbol: "vTA",
    name: "Transverse acoustic sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_bulk: {
    symbol: "vB",
    name: "Bulk sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_shear: {
    symbol: "vS",
    name: "Shear sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_compressional: {
    symbol: "vP",
    name: "Compressional sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_mean: {
    symbol: "vm",
    name: "Mean sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  vickers_hardness: {
    symbol: "HV",
    name: "Vickers hardness",
    unit: "GPa",
    decimals: 2,
  },

  elastic_constants: {
    symbol: "Cij",
    name: "Elastic constants [Cᵢⱼ = eᵢ/σⱼ]",
    unit: "GPa",
    decimals: 2,
  },
};

export default MECHANICAL_PROPERTY_META;
