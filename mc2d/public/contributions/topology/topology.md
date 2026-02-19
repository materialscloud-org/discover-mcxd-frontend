## Topological Insulator calculations

### Motivation

These screening studies aim at identifying robust two-dimensional quantum spin Hall insulators (QSHIs) among experimentally accessible exfoliable materials, motivated by the scarcity of large-gap, room-temperature candidates. The 2019 Nano Letters study[^1] performs a comprehensive high-throughput screening of 1825 monolayers derived from experimentally known layered compounds[^3], identifying 13 QSHI candidates and estimating a relative abundance of ~1% of Z₂ topological order among 2D exfoliated insulators. The 2023 PRM work provides a complementary screening on an additional subset of 783 exfoliable monolayers from the updated Materials Cloud 2D database (MC2D) in which 1252 monolayers were added to the initial 2D portfolio[^4], and reports 4 QSHIs and 7 direct-gap metals (DGMs) as promising candidates[^2].

### Methodology

Methodologically, the 2019 study adopts a broad funnel approach: geometry optimization, SOC band structures, Z₂ evaluation via hybrid Wannier charge centers (Z2Pack), phonons (DFPT), magnetic screening, strain tests, and final validation with G₀W₀ for selected systems[^1]. In contrast, the 2023 work emphasizes computational efficiency and symmetry-based branching: parity analysis at the time-reversal invariant momenta (TRIM) for inversion-symmetric systems, Z2Pack only when needed, dense k-mesh validation of direct/indirect gaps, HSE06 cross-checks for selected cases. Relative to the underlying MC2D database—which catalogs exfoliable structures without topological classification—both studies add systematic Z₂ characterization, but the 2019 work prioritizes many-body validation and abundance statistics, while the 2023 study refines and complements the screening with an updated dataset and symmetry-aware computational protocol.

A major methodological difference with respect to the baseline MC2D dataset is that both QSHI screenings were performed using norm-conserving, fully relativistic pseudopotentials, explicitly including spin–orbit coupling at the self-consistent level.

### References

[^1]: _If using work related to the first publication please cite:_ Antimo Marrazzo, Marco Gibertini, Davide Campi, Nicolas Mounet, Nicola Marzari; Relative Abundance of $\mathbb{Z}_2$ Topological Order in Exfoliable Two-Dimensional Insulators; Nano Letters 19, 12 (2019); https://doi.org/10.1021/acs.nanolett.9b02689

[^2]: _If using work related to the second publication be sure to cite:_ Davide Grassano, Davide Campi, Antimo Marrazzo, and Nicola Marzari; Complementary screening for quantum spin Hall insulators in two-dimensional exfoliable materials; Phys. Rev. Materials 7, 094202 (2023); https://doi.org/10.1103/PhysRevMaterials.7.094202

[^3]:
    N. Mounet, M. Gibertini, P. Schwaller, D. Campi, A. Merkys, A. Marrazzo, T. Sohier, I. E. Castelli, A. Cepellotti, G. Pizzi and N. Marzari;
    Two-dimensional materials from high-throughput computational exfoliation of experimentally known compounds; Nature Nanotechnology 13, 246 (2018); https://doi.org/10.1038/s41565-017-0035-5

[^4]: D. Campi, N. Mounet, M. Gibertini, G. Pizzi, N. Marzari; Expansion of the Materials Cloud 2D Database; ACS Nano 17, 11268-11278 (2023); https://pubs.acs.org/doi/full/10.1021/acsnano.2c11510
