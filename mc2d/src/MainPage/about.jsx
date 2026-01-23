import { HashLink } from "react-router-hash-link";
import CitationBox from "./components/CitationBox";

import { MathJaxContext, MathJax } from "better-react-mathjax";

import "./about.css";

const mathJaxConfig = {
  // disable mathjax right-click menu
  options: {
    renderActions: {
      addMenu: [],
    },
  },
};

// string keys stay in insertion order, so use this order to determine the citation number
const references = {
  mounet: {
    type: "primary",
    ref: (
      <span>
        N. Mounet et al. Two-dimensional materials from high-throughput
        computational exfoliation of experimentally known compounds. Nat.
        Nanotech. 13, 246-252, 2018.
      </span>
    ),
  },
  campi: {
    type: "primary",
    ref: (
      <span>
        D. Campi et al. Expansion of the Materials Cloud 2D Database. ACS Nano
        17, 12, 11268-11278, 2023.
      </span>
    ),
  },
  mpds: {
    type: "db",
    ref: (
      <span>
        The Pauling File{" "}
        <a href="http://paulingfile.com/" target="_blank">
          http://paulingfile.com/
        </a>{" "}
        exposed through the Materials Platform for Data Science{" "}
        <a href="https://mpds.io/" target="_blank">
          https://mpds.io/
        </a>
        .
      </span>
    ),
  },
  cod: {
    type: "db",
    ref: (
      <span>
        S. Gražulis et al. Crystallography open database (COD): an open-access
        collection of crystal structures and platform for world-wide
        collaboration. Nucleic Acids Research, 40:D420-D427, 2012,{" "}
        <a href="http://www.crystallography.net" target="_blank">
          http://www.crystallography.net
        </a>
        .
      </span>
    ),
  },
  icsd: {
    type: "db",
    ref: (
      <span>
        Inorganic Crystal Structure Database,{" "}
        <a href="http://www.fiz-karlsruhe.com/icsd.html" target="_blank">
          http://www.fiz-karlsruhe.com/icsd.html
        </a>
        .
      </span>
    ),
  },
  aiida1: {
    type: "software",
    ref: (
      <span>
        S. P. Huber et al. AiiDA 1.0, a scalable computational infrastructure
        for automated reproducible workflows and data provenance. Sci Data 7,
        300, 2020.{" "}
        <a href="http://www.aiida.net" target="_blank">
          http://www.aiida.net
        </a>
        .
      </span>
    ),
  },
  aiida2: {
    type: "software",
    ref: (
      <span>
        G. Pizzi et al. AiiDA: Automated Interactive Infrastructure and Database
        for Computational Science. Computational Materials Science, 111:218-230,
        2016.
      </span>
    ),
  },
  pymatgen: {
    type: "software",
    ref: (
      <span>
        S. P. Ong et al. Python materials genomics (pymatgen): A robust,
        open-source python library for materials analysis. Computational
        Materials Science, 68:314-319, 2013.
      </span>
    ),
  },
  spglib: {
    type: "software",
    ref: (
      <span>
        A. Togo. Spglib.{" "}
        <a href="https://spglib.readthedocs.io/" target="_blank">
          https://spglib.readthedocs.io/
        </a>
        .
      </span>
    ),
  },
  qe: {
    type: "software",
    ref: (
      <span>
        P. Giannozzi et al. Advanced capabilities for materials modelling with
        Quantum ESPRESSO. Journal of Physics: Condensed Matter, 29:465901, 2017.
      </span>
    ),
  },
  phonon_vis: {
    type: "software",
    ref: (
      <span>
        H. Miranda, Phonon Visualizer,{" "}
        <a
          href="https://github.com/henriquemiranda/phononwebsite/"
          target="_blank"
        >
          https://github.com/henriquemiranda/phononwebsite/
        </a>
        .
      </span>
    ),
  },
  cod_parser: {
    type: "software",
    ref: (
      <span>
        A. Merkys et al. COD::CIF::Parser: an error-correcting CIF parser for
        the Perl language Journal of Applied Crystallography 49 (2016)
      </span>
    ),
  },
  vdw_lee: {
    type: "pseudo_functionals",
    ref: (
      <span>
        K. Lee et al., High-accuracy van der Waals density functional, Physical
        Review B, 82:081101, 2010.
      </span>
    ),
  },
  vdw_cooper: {
    type: "pseudo_functionals",
    ref: (
      <span>
        V. R. Cooper, van der Waals density functional: An appropriate
        exchange-functional. Physical Review B, 81:161104, 2010.
      </span>
    ),
  },
  vdw_vydrov: {
    type: "pseudo_functionals",
    ref: (
      <span>
        O. A. Vydrov and T. Van Voorhis, Nonlocal van der Waals density
        functional: the simpler the better. Journal of Chemical Physics,
        133:244103, 2010.
      </span>
    ),
  },
  vdw_sabatini: {
    type: "pseudo_functionals",
    ref: (
      <span>
        R. Sabatini et al., Nonlocal van der Waals density functional made
        simple and efficient. Physical Review B, 87:041108 (R). 2013.
      </span>
    ),
  },
  pbe: {
    type: "pseudo_functionals",
    ref: (
      <span>
        J. P. Perdew, K. Burke, and M. Ernzerhof, Generalized Gradient
        Approximation Made Simple, Phys. Rev. Lett. 77, pp. 3865, 1996.
      </span>
    ),
  },
  sssp: {
    type: "pseudo_functionals",
    ref: (
      <span>
        G. Prandini, A. Marrazzo, I. E. Castelli, N. Mounet and N. Marzari, npj
        Computational Materials 4, 72 (2018).{" "}
        <a href="http://www.materialscloud.org/sssp/" target="_blank">
          http://www.materialscloud.org/sssp/
        </a>
      </span>
    ),
  },
  vdw_radii: {
    type: "vdw_radii",
    ref: (
      <span>
        S. Alvarez, A cartography of the van der Waals territories. Dalton
        Transactions, 42(24):8617–8636, 2013.
      </span>
    ),
  },
  sohier1: {
    type: "other",
    ref: (
      <span>
        T. Sohier, M. Gibertini, M. Calandra, F. Mauri, and N. Marzari,
        Breakdown of Optical Phonons' Splitting in Two-Dimensional Materials,
        Nano Letters 17, 37583763 (2017).
      </span>
    ),
  },
  sohier2: {
    type: "other",
    ref: (
      <span>
        T. Sohier, M. Calandra, and F. Mauri, Density functional perturbation
        theory for gated two-dimensional heterostructures: Theoretical
        developments and application to flexural phonons in graphene, Phys. Rev.
        B 96, 075448 (2017).
      </span>
    ),
  },
  ramirez: {
    type: "other",
    ref: (
      <span>
        R. Ramírez, and M. C. Böhm, Simple geometric generation of special
        points in Brillouin-zone integrations. Twodimensional bravais lattices,
        Int. J. Quantum Chem. 30, 391-411 (1986).
      </span>
    ),
  },
  printable2d: {
    type: "related_projects",
    ref: (
      <span>
        2D-PRINTABLE - Advanced 2D Materials for printed electronics.{" "}
        <a href="https://2d-printable.eu/" target="_blank">
          https://2d-printable.eu/
        </a>
      </span>
    ),
  },
  lebegue: {
    type: "similar_studies",
    ref: (
      <span>
        S. Lebegue et al., Two-dimensional materials from data filtering and ab
        initio calculations. Physical Review X, 3:031002, 2013.
      </span>
    ),
  },
  bjorkman: {
    type: "similar_studies",
    ref: (
      <span>
        T. Björkman et al., van der Waals bonding in layered compounds from
        advanced density-functional first-principles calculations. Physical
        Review Letters, 108(23):235502, 2012.
      </span>
    ),
  },
  ashton: {
    type: "similar_studies",
    ref: (
      <span>
        M. Ashton et al., Topology-Scaling Identification of Layered Solids and
        Stable Exfoliated 2D Materials. Physical Review Letters, 118(10):106101,
        2017.
      </span>
    ),
  },
  cheon: {
    type: "similar_studies",
    ref: (
      <span>
        G. Cheon et al., Data Mining for New Two- and One-Dimensional Weakly
        Bonded Solids and Lattice-Commensurate Heterostructures. Nano Letters,
        17(3):1915, 2017.
      </span>
    ),
  },
  choudhary: {
    type: "similar_studies",
    ref: (
      <span>
        K. Choudhary et al., High-throughput Identification and Characterization
        of Two-dimensional Materials using Density functional theory. Scientific
        Reports, 7(1):5179, 2017.
      </span>
    ),
  },
  haastrup: {
    type: "similar_studies",
    ref: (
      <span>
        S. Haastrup et al., The Computational 2D Materials Database:
        high-throughput modeling and discovery of atomically thin crystals. 2D
        Materials, 5(4):042002, 2018.
      </span>
    ),
  },
};

function refNr(key) {
  return Object.keys(references).indexOf(key) + 1;
}

function getRef(key) {
  // the <a> ancor element doesn't work with react router, so use the HashLink instead
  return (
    <sup>
      <HashLink className="cite-anchor" to={"#ref" + refNr(key)}>
        [{refNr(key)}]
      </HashLink>
    </sup>
  );
}

function renderRefs(type) {
  return (
    <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
      {Object.keys(references).map((key) => {
        if (references[key]["type"] != type) return;
        let nr = refNr(key);
        return (
          <li key={nr} style={{ display: "flex", alignItems: "flex-start" }}>
            <span style={{ verticalAlign: "super", fontSize: "0.8em" }}>
              <b>[{nr}]</b>
            </span>
            <div id={"ref" + nr} style={{ marginLeft: "5px" }}>
              {references[key]["ref"]}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export const aboutText = (
  <MathJaxContext config={mathJaxConfig}>
    <div className="about-text-container">
      <div className="about-h">How to cite</div>
      <p>If you use this tool or data, please cite the following works:</p>
      <CitationBox
        title={
          <span>
            Two-dimensional materials from high-throughput computational
            exfoliation of experimentally known compounds
          </span>
        }
        authors={
          <span>
            N. Mounet, M. Gibertini, P. Schwaller, D. Campi, A. Merkys, A.
            Marrazzo, T. Sohier, I. E. Castelli, A. Cepellotti, G. Pizzi & N.
            Marzari
          </span>
        }
        journal="Nat. Nanotech. 13, 246-252"
        doi="10.1038/s41565-017-0035-5"
        year="2018"
        data={
          <span>
            N. Mounet et al., Materials Cloud Archive 2020.158, doi:{" "}
            <a
              href="https://doi.org/10.24435/materialscloud:az-b2"
              target="_blank"
            >
              10.24435/materialscloud:az-b2
            </a>{" "}
            (2020)
          </span>
        }
        arxiv={
          <span>
            N. Mounet et al., arXiv:1611.05234, doi:{" "}
            <a href="https://doi.org/10.48550/arXiv.1611.05234" target="_blank">
              10.48550/arXiv.1611.05234
            </a>{" "}
            (2016)
          </span>
        }
      />
      <CitationBox
        title={<span>Expansion of the Materials Cloud 2D Database</span>}
        authors={
          <span>D. Campi, N. Mounet, M. Gibertini, G. Pizzi & N. Marzari</span>
        }
        journal="ACS Nano 17, 12, 11268-11278"
        doi="10.1021/acsnano.2c11510"
        year="2023"
        data={
          <span>
            D. Campi et al., Materials Cloud Archive 2022.84, doi:{" "}
            <a
              href="https://doi.org/10.24435/materialscloud:36-nd"
              target="_blank"
            >
              10.24435/materialscloud:36-nd
            </a>{" "}
            (2022)
          </span>
        }
        arxiv={
          <span>
            D. Campi et al., arXiv:2210.11301, doi:{" "}
            <a href="https://doi.org/10.48550/arXiv.2210.11301" target="_blank">
              10.48550/arXiv.2210.11301
            </a>{" "}
            (2022)
          </span>
        }
      />
      <p>
        The proper reference for each structure is reported in their
        corresponding detail page.
      </p>
      <div className="about-h">General overview</div>
      <p>
        The 2D structures are originating from the computational exfoliation of
        experimental bulk (3D) materials extracted from the MPDS{getRef("mpds")}
        , the COD{getRef("cod")} and the ICSD{getRef("icsd")} databases. The
        computational procedure consisted in:
      </p>
      <ul>
        <li>
          cleaning improperly formatted CIF files with <b>cod-tools</b>
          {getRef("cod")}
          {getRef("cod_parser")};
        </li>
        <li>
          filtering out disordered structures, incompletely defined ones and
          those obviously wrong;
        </li>
        <li>
          converting CIF files into <b>AiiDA</b>
          {getRef("aiida1")}
          {getRef("aiida2")} structures, using <b>pymatgen</b>
          {getRef("pymatgen")};
        </li>
        <li>
          correcting round-off errors in the atomic positions to recover the
          structure symmetries, thanks to <b>spglib</b>
          {getRef("spglib")};
        </li>
        <li>filtering out duplicate structures{getRef("pymatgen")};</li>
        <li>
          screening layered materials thanks to a geometrical algorithm based on
          the identification of chemical bonds from interatomic distances, using
          van der Waals atomic radii provided by Ref.{getRef("vdw_radii")};
        </li>
        <li>
          relaxing and computing the binding energies of the layered materials,
          using the <b>Quantum ESPRESSO</b>
          {getRef("qe")} code with <b>DFT-PBE</b> van der Waals functionals (
          <b>rVV10</b>
          {getRef("vdw_lee")}
          {getRef("vdw_cooper")} and <b>DF2-C09</b>
          {getRef("vdw_vydrov")}
          {getRef("vdw_sabatini")}), tested and converged pseudopotentials from
          the <b>SSSP</b>
          {getRef("sssp")};
        </li>
        <li>
          selecting easily exfoliable materials as those for which the binding
          energy is less than 30 meV/&#8491;<sup>2</sup>
          (with the DF2-C09 functional) or 35 meV/&#8491;<sup>2</sup> (with
          rVV10) and potentially exfoliable materials for which the binding
          energy is less than 120 meV/&#8491;<sup>2</sup>;
        </li>
        <li>
          optimizing the geometry of the monolayers as an isolated system using
          the PBE{getRef("pbe")} functional.
        </li>
      </ul>
      <p>
        On the subset of 2D easily exfoliable monolayers with less than 6 atoms
        in the unit cell, found in {getRef("mounet")} we also computed (at the
        PBE level):
      </p>
      <ul>
        <li>
          possible ferromagnetic and antiferromagnetic configurations, to obtain
          the magnetic ground state;
        </li>
        <li>electronic band structure;</li>
        <li>phonon dispersion curves.</li>
      </ul>
      <p>More details can be found in the associated publications.</p>
      <div id="definitions" className="about-h">
        Definitions and further details
      </div>
      <MathJax>
        <ul>
          <li>
            All the properties are computed at the DFT-PBE level. The only
            exceptions are binding energies, which were calculated using the
            DF2-C09 and the rVV10 van-der-Waals functionals.
          </li>
          <li>
            All properties for the 258 easily exfoliable materials computed in{" "}
            {getRef("mounet")} are calculated for the relaxed configuration in
            the correct magnetic ground state.
          </li>
          <li>
            Binding energies are always computed in a non-magnetic reference
            configuration, both for the 3D parent and for exfoliated monolayers.
            We checked that including magnetism for magnetic systems does not
            alter the binding energy by more than 10 meV/Å2, and in the vast
            majority of cases it does not alter the classification as easily
            exfoliable (see Supplementary Figure in the journal paper{" "}
            {getRef("sohier1")}).
          </li>
          <li>
            The total and absolute magnetizations are defined, respectively, as{" "}
            {"$$ M_{tot} = \\mu_B \\int m(\\vec{r}) \\, d\\vec{r} \\quad\\quad " +
              "M_{abs} = \\mu_B \\int |m(\\vec{r})| \\, d\\vec{r} $$"}
            where{" "}
            {
              "\\( m(\\vec{r})=n^\\uparrow(\\vec{r})-n^\\downarrow(\\vec{r}) \\)"
            }{" "}
            is the local magnetization and {"\\( n^\\uparrow(\\vec{r}) \\)"},{" "}
            {"\\( n^\\downarrow(\\vec{r}) \\)"} are the densities of spin-up and
            spin-down electrons.
          </li>
          <li>
            A system is labeled non-magnetic (NM) if in the ground state{" "}
            {"\\( M_{tot} = M_{abs} = 0 \\)"}, while it is labeled
            anti-ferromagnetic (AFM) if {"\\( M_{abs} \\neq 0 \\)"} and{" "}
            {"\\( M_{tot} < 0.1 \\mu_B \\)"}. In all other cases, the system is
            reported as ferromagnetic (FM).
          </li>
          <li>
            Magnetic band structures are plotted with two different colors for
            the two different spin states.
          </li>
          <li>
            For the same subset of 258 we have also performed phonon dispersion
            calculations. The calculation of 13 out of 258 phonon dispersions
            failed to converge in the self-consistent linear-response cycle,
            despite multiple attempts to tune calculation parameters. All the
            missing materials contain a lanthanide element (namely Ce, Dy, Er,
            Nd, Sm, Tb, Tm or Yb).
          </li>
          <li>
            Small imaginary ZA phonons close to Γ are a common numerical issue
            both in DFPT and in finite differences calculations for 2D
            materials. Recovering the perfect quadratic behavior of the ZA
            phonon, and the associated low frequencies near Γ requires
            prohibitively tight parameters (especially energy cutoffs).
          </li>
          <li>
            The frequency separation between longitudinal and transverse optical
            phonons (LO-TO splitting) in polar materials crucially depends on
            dimensionality. In 2D systems and in the long-wavelength limit, the
            LO-TO splitting vanishes but the LO modes display a finite slope
            {getRef("sohier1")}. Using a newly implemented 2D setup in DFT and
            DFPT {getRef("sohier2")}, we recover correctly this behavior in the
            phonon calculations. The phonon interpolation process is also
            appropriately modified {getRef("sohier1")} to correctly describe the
            2D LO-TO splitting.
          </li>
          <li>
            As mentioned in the main text, due to symmetry unstable optical
            phonons can be found at Γ. When this happens, we choose to relax the
            structure by optimizing the atomic coordinates according to the
            displacement pattern associated with the unstable optical phonon.
            This typically leads to a symmetry reduction, and subsequently we
            allow for variable cell relaxation in order to take into account
            possible cell deformations associated with the atomic displacements.
            The details of the procedure are described in the Methods section of
            the journal paper {getRef("campi")}.
          </li>
          <li>
            Structures presenting unstable phonons outside Γ may be stabilized
            by including temperature effects or by considering supercells for
            which the wavevector of the unstable phonon folds at Γ. We do not
            try to do this because of the computational costs, even if the
            procedure would be analogous to that used for phonons at Γ.
          </li>
          <li>
            Paths and special k-points follow the conventions for 2D systems
            from Ref. {getRef("ramirez")} as implemented in AiiDA{" "}
            {getRef("aiida1")}.
          </li>
          <li>
            This set of 258 materials can be identified based on the citation
            associated with each material. Materials included in this set report
            only Ref. {getRef("mounet")} as a reference paper.
          </li>
          <li>
            All the structures, 3D and 2D, computed in Ref. {getRef("campi")}{" "}
            are instead treated as non-magnetic using spin-unpolarized DFT
            regardless of their true magnetic ground state. The magnetic order
            has a negligible effect on the binding energies as discussed in Ref.
            {getRef("mounet")}, but caution is needed when looking at the
            electronic properties of materials with elements that might support
            a magnetic ground state. Materials with references of both Ref.{" "}
            {getRef("mounet")} and Ref. {getRef("campi")} or just Ref.{" "}
            {getRef("campi")} have been computed with this non-magnetic
            approximation.
          </li>
        </ul>
      </MathJax>
      <div className="about-h">Legacy app</div>
      <p>
        The previous version of this app can be found at{" "}
        <a
          href="https://www.materialscloud.org/discover/legacy-mc2d"
          target="_blank"
        >
          materialscloud.org/discover/legacy-mc2d
        </a>
        .
      </p>
      <div className="about-h">Acknowledgements and references</div>
      <b>HPC support</b>
      <br />
      Computational resources for this project have been provided by PRACE
      (Grant 2016163963 on KNL/Marconi at Cineca) and by the NCCR MARVEL (Piz
      Daint at CSCS).
      <br />
      <br />
      <b>Primary publications</b>
      {renderRefs("primary")}
      <b>Crystal structure databases</b>
      {renderRefs("db")}
      <b>Software</b>
      {renderRefs("software")}
      <b>Pseudopotentials and van der Waals functionals</b>
      {renderRefs("pseudo_functionals")}
      <b>Van der Waals radii</b>
      {renderRefs("vdw_radii")}
      <b>Other references</b>
      {renderRefs("other")}
      <b>Related projects</b>
      {renderRefs("related_projects")}
      <b>Similar studies</b>
      {renderRefs("similar_studies")}
    </div>
  </MathJaxContext>
);
