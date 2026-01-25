# Unified MC3D and MC2D React frontend

This repository contains:

- `mc3d` - the MC3D React app;
- `mc2d` - the MC2D React app; and
- `shared` - a package that contains the shared code. Is imported directly from source in the apps, so does not need to be built.

`npm` workspaces are used to manage this project, so one should just directly run at the repo root:

```bash
# Install all dependencies
npm install

# Develop either app
npm run dev:mc3d
npm run dev:mc2d

# Build for production (prod backend)
npm run build:mc3d
npm run build:mc2d

# Build for development (dev backend)
npm run build:be-dev:mc3d
npm run build:be-dev:mc2d

# Preview the built distribution
npm run preview:mc3d
npm run preview:mc2d
```

## Deployment

Cloudflare is used to automatically deploy:

- Production (`main` branch) to
  - https://discover-mc3d.pages.dev
  - https://discover-mc2d.pages.dev
- Development (`develop` branch) to
  - https://develop.discover-mc3d.pages.dev
  - https://develop.discover-mc2d.pages.dev

And any other branch (e.g. `branch_name/1`) will be deployed under (note that symbols like `_` and `/` get replaced by `-`):

- `https://branch-name-1.discover-mcxd.pages.dev`
