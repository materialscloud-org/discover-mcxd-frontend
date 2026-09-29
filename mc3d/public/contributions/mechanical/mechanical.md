## Elastic calculations

### Motivation

Superconductors are used in medical imaging, particle accelerators, energy transmission, magnetic levitation, and quantum technologies. However, their practical applications require sufficient ductility. This dataset therefore adds first-principles elastic properties to superconducting candidates from the supercond-EPW database,[^2] enabling high-throughput screening of mechanical properties and ductility alongside the predicted superconducting transition temperature $T_c$.

### Mechanical database

This dataset extends the MC3D PBEsol-v1 database. Calculations were performed with Quantum ESPRESSO and automated with the [aiida-mechanical](https://github.com/aiidaplugins/aiida-mechanical) AiiDA workflow. Structures, plane-wave cutoffs, and $\mathbf{k}$-point sampling are consistent with the parent supercond-EPW database. Full computational details are available in the associated study.[^1]

The primary finite-displacement (FD) calculations use the PBE exchange-correlation functional and scalar-relativistic, norm-conserving PseudoDojo v0.5 pseudopotentials.[^4] The `thermo_pw` code applies strains of $\pm0.0025$ and $\pm0.0075$ to each symmetry-independent deformation and obtains the elastic tensor by linear fits to the stress-strain response. The strains were verified to remain in the linear-elastic regime; the large majority of fits have root-mean-square residuals below 0.125 kbar.[^1]
Results obtained with the SSSP pseudopotential library and the long-wavelength (Born) expansion are retained as complementary data.

### Elastic tensor and isotropic moduli

Within the linear regime, stress and strain are related in Voigt notation by

$$
\sigma_i = \sum_j C_{ij}\varepsilon_j,
$$

where $C_{ij}$ is the elastic tensor. The bulk modulus $B$ and shear modulus $G$ are calculated using the Voigt-Reuss-Hill (VRH) averages:

$$
\begin{aligned}
B &= \frac{B^{\mathrm V}+B^{\mathrm R}}{2}, \\
G &= \frac{G^{\mathrm V}+G^{\mathrm R}}{2}.
\end{aligned}
$$

The Voigt bulk ($B^{\mathrm V}$) and shear ($G^{\mathrm V}$) moduli, and the Reuss bulk ($B^{\mathrm R}$) and shear ($G^{\mathrm R}$) moduli are

$$
\begin{aligned}
9B^{\mathrm V} &= C_{11}+C_{22}+C_{33}
  +2(C_{12}+C_{13}+C_{23}), \\
15G^{\mathrm V} &= C_{11}+C_{22}+C_{33}
  -(C_{12}+C_{13}+C_{23}) \\
  &\quad+3(C_{44}+C_{55}+C_{66}), \\
(B^{\mathrm R})^{-1} &= S_{11}+S_{22}+S_{33}
  +2(S_{12}+S_{13}+S_{23}), \\
15(G^{\mathrm R})^{-1} &= 4(S_{11}+S_{22}+S_{33})
  -4(S_{12}+S_{13}+S_{23}) \\
  &\quad+3(S_{44}+S_{55}+S_{66}).
\end{aligned}
$$

Here, $S_{ik}$ is the compliance tensor satisfying $\sum_k S_{ik}C_{kj}=\delta_{ij}$. Young's modulus, Poisson's ratio, Lamé parameters, acoustic velocities, and the Debye-temperature estimate are derived from the elastic tensor and the VRH moduli. Elastic constants and moduli are reported in GPa; sound velocities are in km s$^{-1}$, and temperatures in K.

### Ductility descriptors

The ductility descriptors Pugh's ratio $r^{\mathrm{Pugh}}$, Pettifor's ratio $r^{\mathrm{Pett}}$ and superconductor ductility indicator $c$ are defined as:

$$
\begin{aligned}
r^{\mathrm{Pugh}} &= \frac{G}{B}, \\
r^{\mathrm{Pett}} &= \frac{C_{12}-C_{44}}{B}, \\
c &\equiv \frac{T_{\rm c}}{T_{\rm c}^{\rm avg}} + \frac{ r^{\rm Pett}}{r^{\rm Pett, avg}}-\frac{r^{\rm Pugh} }{r^{\rm Pugh, avg}},
\end{aligned}
$$

A lower Pugh ratio (with the conventional crossover near 0.57) and a positive Pettifor ratio are commonly associated with a more ductile tendency. The Pettifor ratio is meaningful for cubic crystals.

### Long-wavelength (Born) expansion

The Born approach obtains elastic constants from the long-wavelength expansion of the second-order interatomic force constants (IFCs), avoiding finite-displacement calculations.[^3] Let $\Phi^{l}_{\kappa\alpha,\kappa'\beta}$ be the real-space IFC between atom $\kappa$ in the reference cell and atom $\kappa'$ in cell $l$, and let $\tau^{l}_{\kappa\kappa'}$ be their equilibrium separation. The second spatial moment of the IFCs is

$$
\Phi^{(2),\gamma\delta}_{\kappa\alpha,\kappa'\beta}
= -\sum_l \Phi^{l}_{\kappa\alpha,\kappa'\beta}
\tau^{l}_{\kappa\kappa',\gamma}\tau^{l}_{\kappa\kappa',\delta}.
$$

It gives the clamped-ion contribution to the elastic response,

$$
T^{\mathrm{CI}}_{\alpha\beta,\gamma\delta}
= \frac{1}{2}\sum_{\kappa\kappa'}
\Phi^{(2),\gamma\delta}_{\kappa\alpha,\kappa'\beta}.
$$

The full symmetric, short-circuit elastic tensor is then obtained with the Huang formula,[^3]

$$
C_{\alpha\gamma,\beta\delta}
= \frac{1}{\Omega}
\left(
T^{\mathrm{CI}}_{\alpha\beta,\gamma\delta}
+ T^{\mathrm{CI}}_{\beta\gamma,\alpha\delta}
- T^{\mathrm{CI}}_{\beta\delta,\alpha\gamma}
+ T^{\mathrm{LM}}_{\alpha\gamma,\beta\delta}
\right),
$$

where $\Omega$ is the unit-cell volume and $T^{\mathrm{LM}}$ is the lattice-mediated contribution from internal ionic relaxation. For polar materials, the long-range electrostatic part of the IFCs must be treated consistently to obtain the short-circuit tensor.[^3]

The Born expansion uses phonon calculations from density-functional perturbation theory (DFPT) with q-point distances of 0.3, 0.5, and 0.7 ${\AA}^{-1}$ with SSSP, and 0.5 ${\AA}^{-1}$ with PseudoDojo, as published in the supercond-EPW database.[^2] The method can be sensitive to $\mathbf{q}$-point sampling. The FD data are therefore recommended when a single screening value is needed.

### References

[^1]: Y. Zhang and S. Poncé, _In search of novel ductile superconductors_, [arXiv:2608.04789](https://doi.org/10.48550/arXiv.2608.04789) (2026).

[^2]: M. Bercx, S. Poncé, Y. Zhang, G. Trezza, A. G. Ghezeljehmeidan, L. Bastonero, J. Qiao, F. O. von Rohr, G. Pizzi, E. Chiavazzo, and N. Marzari, _Charting the Landscape of Bardeen-Cooper-Schrieffer Superconductors in Experimentally Known Compounds_, [PRX Energy **4**, 033012 (2025)](https://doi.org/10.1103/sb28-fjc9).

[^3]: C. Lin _et al._, _Elastic Constants and Bending Rigidities from Long-Wavelength Perturbation Expansions_, [PRX Energy **5**, 013012 (2026)](https://doi.org/10.1103/hc53-g1p3).

[^4]: M. J. van Setten _et al._, _The PseudoDojo: Training and grading an 85-element optimized norm-conserving pseudopotential table_, [Comput. Phys. Commun. **226**, 39–54 (2018)](https://doi.org/10.1016/j.cpc.2018.01.012).
