# Unified MC3D and MC2D React frontend

This repository contains:

- `mc3d` - the MC3D React app;
- `mc2d` - the MC2D React app; and
- `shared` - a package that contains the shared code. Is imported directly from source in the apps, so does not need to be built.

`npm` workspaces are used to manage this project, so one should just directly run at the repo root:

```
npm install

npm run dev:mc3d
npm run dev:mc2d

npm run build:mc3d
npm run build:mc2d
```
