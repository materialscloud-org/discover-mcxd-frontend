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

  poisson_ratio: {
    order: 4,
    symbol: "ν",
    name: "Poisson's ratio",
    unit: null,
    decimals: 3,
  },

  pugh_ratio: {
    order: 5,
    symbol: "rPugh",
    name: "Pugh ratio",
    unit: null,
    decimals: 3,
  },

  pettifor_ratio: {
    order: 6,
    symbol: "rPett",
    name: "Pettifor ratio",
    unit: null,
    decimals: 3,
  },

  modified_pettifor_ratio: {
    order: 7,
    symbol: "r̃Pett",
    name: "Modified Pettifor ratio",
    unit: null,
    decimals: 3,
  },

  c: {
    order: 8,
    symbol: "c",
    name: "c ratio",
    unit: null,
    decimals: 3,
  },

  p_wave_modulus: {
    order: 9,
    symbol: "M",
    name: "P-wave modulus",
    unit: "GPa",
    decimals: 2,
  },

  lame_1st_para: {
    order: 10,
    symbol: "λ",
    name: "First Lamé parameter",
    unit: "GPa",
    decimals: 2,
  },

  lame_2nd_para: {
    order: 11,
    symbol: "μ",
    name: "Second Lamé parameter",
    unit: "GPa",
    decimals: 2,
  },

  debye_temp: {
    order: 12,
    symbol: "ΘD",
    name: "Debye temperature",
    unit: "K",
    decimals: 1,
  },

  melting_temp: {
    order: 13,
    symbol: "Tm",
    name: "Melting temperature",
    unit: "K",
    decimals: 1,
  },

  sound_vel_bulk: {
    order: 14,
    symbol: "vB",
    name: "Bulk sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_LA: {
    order: 15,
    symbol: "vLA",
    name: "Longitudinal acoustic sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_TA: {
    order: 16,
    symbol: "vTA",
    name: "Transverse acoustic sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_mean: {
    order: 17,
    symbol: "vm",
    name: "Mean sound velocity",
    unit: "km/s",
    decimals: 3,
  },
  min_kappa: {
    order: 18,
    symbol: "κmin",
    name: "Minimum thermal conductivity",
    unit: "W/(m·K)",
    decimals: 3,
  },

  sound_vel_shear: {
    order: 19,
    symbol: "vS",
    name: "Shear sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  sound_vel_compressional: {
    order: 20,
    symbol: "vP",
    name: "Compressional sound velocity",
    unit: "km/s",
    decimals: 3,
  },

  vickers_hardness: {
    order: 21,
    symbol: "HV",
    name: "Vickers hardness",
    unit: "GPa",
    decimals: 2,
  },

  elastic_constants: {
    order: 22,
    symbol: "Cij",
    name: "Elastic constants (Cᵢⱼ = eᵢ/σⱼ)",
    unit: "GPa",
    decimals: 2,
  },
};

export default MECHANICAL_PROPERTY_META;
