export const VibrationalIcon = ({
  size = 18,
  color = "#767676",
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    {...props}
  >
    {/* wave packet: flat, a burst of oscillation, flat */}
    <path
      d="M2 12h4.5Q7.25 9 8 12T9.8 12Q10.8 -2 11.8 12Q12.8 26 13.8 12Q14.7 4 15.6 12Q16.4 15.6 17.2 12H22"
      strokeLinejoin="round"
    />
  </svg>
);

export const OverviewIcon = ({
  size = 18,
  color = "#767676",
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    {...props}
  >
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export const StructureIcon = ({
  size = 18,
  color = "#767676",
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    {...props}
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.3 7l8.7 5 8.7-5" strokeLinejoin="round" />
    <path d="M12 22V12" />
  </svg>
);

// Official AiiDA icon (aiidateam/aiida-core docs/source/images/aiida-icon.svg,
// MIT), cropped to a square viewBox.
export const ProvenanceIcon = ({ size = 18, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="12 0 376 376"
    {...props}
  >
    <g stroke="none">
      <path
        d="M232.448 221.866C224.342 233.246 220.976 240.112 218.289 253.725H273.746V231.306L336.873 269.654L273.746 305.642V283.223H218.289C221.066 296.693 223.296 303.403 232.448 314.492C240.672 324.83 245.958 329.392 256.047 336.321C266.177 341.853 271.956 344.194 282.596 345.76C299.281 346.576 308.27 346.077 322.714 341.04C336.217 335.005 342.939 331.245 352.212 320.391C361.556 310.995 363.422 305.642 368.732 293.253C371.61 284.363 372.529 279.136 372.271 269.654C372.561 260.285 371.216 254.872 368.868 245.424L368.732 244.875C364.179 232.629 360.169 226.498 352.212 215.967C342.783 206.563 336.389 202.123 322.714 195.908C308.302 191.356 299.587 190.293 282.596 191.778C268.676 195.044 263.091 197.138 256.047 201.217C245.833 206.993 240.705 211.604 232.448 221.866Z"
        fill="#0096DE"
      />
      <path
        d="M177.501 238.379C171.698 225.669 167.435 219.321 156.99 210.187L129.262 258.215L148.677 269.424L83.903 304.919L84.2998 232.256L103.715 243.465L131.444 195.438C118.391 191.108 111.464 189.684 97.2848 192.066C84.2194 194.019 77.6262 196.316 66.581 201.589C56.7249 207.596 51.8084 211.429 45.1318 219.861C36.0828 233.903 32.0208 241.937 29.1602 256.964C27.6351 271.676 27.5307 279.377 32.2935 292.835C35.759 305.624 39.462 309.917 47.5367 320.71C53.7961 327.648 57.8629 331.058 66.2039 335.575C74.1727 340.511 79.5336 342.052 88.8898 344.743L89.4329 344.899C102.314 347.079 109.629 346.673 122.728 345.047C135.586 341.583 142.629 338.266 154.849 329.53C165.996 319.325 171.274 312.309 178.484 296.852C182.616 283.164 183.595 277.28 183.584 269.14C183.689 257.407 182.26 250.66 177.501 238.379Z"
        fill="#30B808"
      />
      <path
        d="M190.928 183.231C204.837 184.561 212.466 184.043 225.598 179.564L197.869 131.537L178.454 142.746L180.101 68.9026L242.831 105.578L223.416 116.787L251.145 164.815C261.421 155.675 266.117 150.389 271.144 136.918C275.986 124.627 277.293 117.768 278.249 105.567C277.975 94.0274 277.113 87.8529 273.15 77.855C265.513 62.9974 260.587 55.4626 249.003 45.4716C237.025 36.7949 230.407 32.8538 216.371 30.2497C203.563 26.8561 197.993 27.9166 184.609 29.5129C175.471 31.4649 170.485 33.2821 162.402 38.2468C154.143 42.6803 150.128 46.5522 143.12 53.3095L142.713 53.7017C134.384 63.7674 131.079 70.3056 125.937 82.462C122.508 95.3301 121.859 103.087 123.315 118.038C126.579 132.795 130.016 140.873 139.797 154.846C149.586 165.268 154.191 169.058 161.246 173.118C171.355 179.076 177.913 181.212 190.928 183.231Z"
        fill="#FF7D17"
      />
    </g>
  </svg>
);

export const XrdIcon = ({
  size = 18,
  color = "#767676",
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    {...props}
  >
    {/* Bragg reflection: X-ray scattering off a lattice plane */}
    <path d="M3 4.5l9 9 9-9M16 4.5h5v5" strokeLinejoin="round" />
    <g fill={color} stroke="none">
      {[3, 7.5, 12, 16.5, 21].map((x) => (
        <circle key={x} cx={x} cy="16.8" r="1.5" />
      ))}
    </g>
  </svg>
);

export const SuperconductivityIcon = ({
  size = 18,
  color = "#767676",
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    {...props}
  >
    {/* SQUID: superconducting ring, two Josephson junctions, field through it */}
    <path d="M12 13.5V3M10 5l2-2 2 2" strokeLinejoin="round" />
    <path d="M9 13c-.3-3-1.5-5.5-3.5-8" />
    <path d="M15 13c.3-3 1.5-5.5 3.5-8" />
    <ellipse cx="12" cy="15.5" rx="8" ry="4" />
    <path d="M1 15.5h3M20 15.5h3" />
    <g fill="#e03131" stroke="none">
      <rect x="10.75" y="10.25" width="2.5" height="2.5" rx="0.4" />
      <rect x="10.75" y="18.25" width="2.5" height="2.5" rx="0.4" />
    </g>
  </svg>
);

export const MechanicalIcon = ({
  size = 18,
  color = "#767676",
  strokeWidth = 1.75,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    {...props}
  >
    <circle cx="12" cy="12" r="2.5" />
    <path d="M9.5 12H4" />
    <path d="M6.2 9.8L4 12l2.2 2.2" strokeLinejoin="round" />
    <path d="M14.5 12h5.5" />
    <path d="M17.8 9.8l2.2 2.2-2.2 2.2" strokeLinejoin="round" />
  </svg>
);
