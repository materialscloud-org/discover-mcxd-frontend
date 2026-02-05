## Topological Insulator calculations

The set of calculations related to topological insulators is derived from two seperate but complementary publications. The work by Marazzo et al.,[^1] identified 13 monolayer candidate QSHI materials. The work by Grassano et al.,[^2] identified four more and seven direct-gap metals metals.

### Motivation

Besides fundamental scientific interest, numerous technological applications of topological insulators have been proposed. Specifically, such insulators may feature one-dimensional topologically protected states at the edge of a QSHI (Quantum Spin Hall Insulator). Paving the way for the identification of low-dissipation nanowires, where elastic backscattering is forbidden by time-reversal (TR) symmetry and electron transport is spin-momentum locked. For such applications, a large band gap would be beneficial not only for increasing the operating temperature (limited by the intrinsic semiconducting behavior of the bulk) but also for decreasing the transverse localization length of the edge states. The latter could help reduce inelastic backscattering with the bulk and, more relevantly, to suppress hybridization effects between the two pairs of helical states at opposite edges of a ribbon, which would otherwise gap the edge spectrum.

### Methodology

_The following details relate to the publication - Marrazzo et al., ACS Nano 19, 8431-8440 (2019), Full details of the source methodology as well as further discussion are available in the publication.[^1]_

Using the Materials cloud Two-Dimensional Structure Database, candidate QSHIs were identfied through a multistep funneling process. Firstly, lanthanide-containing elements were filtered, as standard DFT performs poorly in describing their electronic strucuture. This yields 1471 structures, all of which are relaxed using the PBE functional assuming a non-magnetic ground state. Band structures are then calculated along high-symmetry lines using DFT and the PBE functional with Spin-orbit coupling, allowing identification of band insulators. $\mathbb{Z}_2$ invariant was computed by tracking the evolution of hermaphrodite Wannier charge centers (HWCC). For materials that satisfy this constraint, phonon dispersions were calculated to identify structures with poor mechanical stability (i.e., those exhibiting imaginary phonon modes).

Additionally, materials identified as metallic but possessing a direct gap along high-symmetry paths, were subjected to hydrostatic strain (±1%, ±2%, ±3%) to determine whether such materials become insulators. This step aims to identify materials that may be tunable to become QSHIs, via substrate choice, for example. Within the publication these QSHIs are then recalculated with $G_{0}W_{0}$, a significantly more accurate, albeit computationally expensive, method.

Inversion strength (IS) is defined differently for the two types of QSHIs, for Bernevig–Hughes–Zhang (BHZ)-type QSHIs[^3] the IS is defined as the difference between the lowest unoccupied and highest occupied band at the high-symmetry point where band inversion occurs. Whereas for Kane–Mele QSHIs, where a single Dirac cone is gapped by Kane–Mele spin–orbit coupling at the K point[^4], the inversion strength is the band gap at that K point.

![Schematic representation of the screening process for the Marazzo publication](/contributions/topology_marazzo.jpeg)

_The following details relate to the complementary publication - Grassano et al., Phys. Rev. Mater. 7, 094202 (2023). Full details of the source methodology as well as further discussion are available in the publication[^2]_

A further four $\mathbb{Z}_2$ topological insulators and seven direct-gap metals metals were identified as potential QSHIs in a similar fashion to the method described above, however with some key differences:

For materials with inversion symmetry the formula given by Fu and Kane[^5] was used

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\epsilon_{0}}
$$

For materials without inversion symmetry, direct and indirect band gaps are calculated. Then the Z2pack software is used to investigate HWCC evolution across half the Brillouin zone over a progressively denser k-point grid. Finally, selected candidates are assessed for mechanical stability via phonon calculations.

![Schematic representation of the screening process for the Grassano publication](/contributions/topology_grassano.png)

_For both publications, the AiiDA workflow manager was used to assist with automation and provenance tracking._

---

### References and Further reading:

[^1]: _If using work related to the first publication please cite:_ Antimo Marrazzo, Marco Gibertini, Davide Campi, Nicolas Mounet, Nicola Marzari. Relative Abundance of $\mathbb{Z}_2$ Topological Order in Exfoliable Two-Dimensional Insulators. acs.nanolett.9b02689 (2019). https://pubs.acs.org/doi/10.1021/acs.nanolett.9b02689

[^2]: _If using work related to the second publication be sure to cite:_ Davide Grassano, Davide Campi, Antimo Marrazzo, and Nicola Marzari. Complementary screening for quantum spin Hall insulators in two-dimensional exfoliable materials. PhysRevMaterials.7.094202 (2023). https://journals.aps.org/prmaterials/abstract/10.1103/PhysRevMaterials.7.094202

[^3]: _For details on the Bernevig-Hughes-Zhang QSHIs_: B. Andrei Bernevig, Taylor L. Hughes, and Shou-Cheng Zhang. Quantum Spin Hall Effect and Topological Phase Transition in HgTe Quantum Wells. 10.1126/science.1133734 (2006) https://www.science.org/doi/full/10.1126/science.1133734

[^4]: _For foundation theory on QSHIs_: C. L. Kane and E. J. Mele. $\mathbb{Z}_2$ Topological Order and the Quantum Spin Hall Effect. PhysRevLett.95.146802 (2005) https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.95.146802

[^5]: _For details on inversion symmetry:_ Liang Fu and C. L. Kane. Topological insulators with inversion symmetry. PhysRevB.76.045302 (2007) https://journals.aps.org/prb/abstract/10.1103/PhysRevB.76.045302
