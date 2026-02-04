## Toplogical Insulator calculations

### Motivation

Besides fundamental scientific interest, numerous technological applications of topological insulators have been proposed. Specifically, such insulators may feature one-dimensional topologically protected states at the edge of a QSHI (Quantum Spin Hall Insulator). Paving the way to identification of realize low-dissipation nanowires, where the elastic backscattering is forbidden by time-reversal (TR) symmetry and electron transport is spin-momentum locked. For such applications, a large band gap would be beneficial not only to increase the operating temperature (limited by the intrinsic semiconducting behavior of the bulk) but also to decrease the transverse localization length of the edge states. The latter could help to reduce inelastic backscattering with the bulk and, more relevantly, to suppress hybridization effects between the two pairs of helical states at opposite edges of a ribbon that otherwise would gap the edge spectrum.

### Methodology

_The following details relate to the publication - Marrazzo et al., ACS Nano 19, 8431-8440 (2019)_

Using the Materials cloud Two-Dimensional Structure Database, candidate QSHIs were identfied through a multistep funneling process. Firstly, Lanthanide containing elements were filtered, as standard DFT is poor at describing their electronic strucuture. This yields 1471 structures, all of which are rleaxed using the PBE functional assuming a nonmagnetic ground state. At this point, band structures are calculated along high-symmetry lines using DFT and the PBE functional with Spin-orbit coupling, identifying band insulators. $\mathbb{Z}_2$ invariance was computed by tracking the evolution of hermaphrodite Wannier charge centers (HWCC). For materials that satisfy this constraint, phonon dispersions were performed, identifying structures with poor mechanical stability (with imaginary phonon modes).

Additionally, materials identified to be metallic, however with a direct gap along high-symmetry paths, were subjected to hydrostatic strain (±1%, 2%, 3%) to determine whether such materials become insulators. This is intended to further identify materials that may be tunable to become QSHIs, via substrate choice for example. Within the publication these QSHIs are then recalculated with $G_{0}W_{0}$, an extensively accurate, but expensive functional.

![Schematic representation of the screening process](/contributions/topology_marazzo.jpeg)

_The following details relate to the complementary publication_ - Grassano et al., Phys. Rev. Mater. 7, 094202 (2023)\_

A further four $\mathbb{Z}_2$ topological insulators and seven direct gap metals were identified to be QSHIs in a similar fashion to the above method, however with some key differences:

For materials with inversion symmetry the formula given by Fu and Kane was used

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_{0}}
$$

Whereas those without inversion symmetry, direct and indirect band gaps are calculated. Then the Z2pack software is used to investigate HWCC evolution across half the brillioun zone over a progressively denser grid of k-points. Finally, selected candidates are assessed for mechanical stability via a phonon calculation.

![Schematic representation of the screening process](/contributions/topology_grassano.png)

_For both publications, the AiiDA workflow manager was used to assist in automation and provenence tracking._

### References and Further reading:

[^1]:
    _If using this work be sure to cite:_ Marnik Bercx, Samuel Poncé, Yiming Zhang. _et al._ Charting the landscape of Bardeen-Cooper-Schrieffer superconductors in experimentally known compounds. arXiv:2503.10943 (2025).  
    https://journals.aps.org/prxenergy/abstract/10.1103/sb28-fjc9

[^2]: _asr all:_ Lin, C., Poncé, S. & Marzari, N. General invariance and equilibrium conditions for lattice dynamics in 1D, 2D, and 3D materials. npj Comput Mater 8, 236 (2022). https://doi.org/10.1038/s41524-022-00920-6

[^3]: _SSSP Publication:_ Prandini, G., Marrazzo, A., Castelli, I.E. et al. Precision and efficiency in solid-state pseudopotential calculations. npj Comput Mater 4, 72 (2018). https://doi.org/10.1038/s41524-018-0127-2
