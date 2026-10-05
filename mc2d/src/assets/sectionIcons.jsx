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
    <path d="M4 4v16h16" />
    <path d="M5 7Q12 15 19 7" />
    <path d="M5 17Q12 9 19 17" />
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
    <path d="M2 11v2" />
    <path d="M4.5 8v8" />
    <path d="M7 4v16" />
    <path d="M9.5 8v8" />
    <path d="M12 11v2" />
    <path d="M14.5 8v8" />
    <path d="M17 4v16" />
    <path d="M19.5 8v8" />
    <path d="M22 11v2" />
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
