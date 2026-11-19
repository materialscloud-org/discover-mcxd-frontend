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
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 11v6" />
    <circle cx="12" cy="7.5" r="1.2" fill={color} stroke="none" />
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
    {/* unit cell wireframe, hidden edges dashed */}
    <path
      d="M4 8h12v12H4zM8 4h12v12h-4M4 8l4-4M16 8l4-4M16 20l4-4"
      strokeLinejoin="round"
    />
    <path d="M8 4v12h8M8 16l-4 4" strokeDasharray="1.5 2" />
  </svg>
);

export const ElectronicIcon = ({
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
    {/* valence/conduction bands with dashed Fermi level */}
    <path d="M2 6Q12 16 22 6M2 18Q12 8 22 18" />
    <path d="M2 12h20" strokeDasharray="2 2" strokeWidth={strokeWidth * 0.75} />
  </svg>
);

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
    {/* two atoms joined by a spring */}
    <circle cx="4.5" cy="12" r="3" fill={color} stroke="none" />
    <circle cx="19.5" cy="12" r="3" fill={color} stroke="none" />
    <path
      d="M7.5 12l1-3.5 1.75 7 1.75-7 1.75 7 1.75-7 1 3.5"
      strokeWidth={strokeWidth * 0.86}
      strokeLinejoin="round"
    />
  </svg>
);

export const TopologyIcon = ({
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
    <path d="m6.5 19.5 11-15" />
    <path d="m6.5 4.5 11 15" />
    <ellipse cx="12" cy="19.5" rx="5.5" ry="1.8" fill={color} />
    <ellipse cx="12" cy="4.5" rx="5.5" ry="1.8" fill={color} />
  </svg>
);

export const ParentsIcon = ({
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
    <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinejoin="round" />
    <path d="M2 17l10 5 10-5" strokeLinejoin="round" />
    <path d="M2 12l10 5 10-5" strokeLinejoin="round" />
  </svg>
);
