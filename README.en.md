# Algoritmo Doce v2

[Português](README.md) | **English**

A web application for a real artisan confectionery business and a practical project in my software-development studies. This second version evolves the first website's structure and technologies.

## Context and goals

Algoritmo Doce connects technology and confectionery. The project is a place to practice software development while building tools for the business's presentation and evolution. Features can grow as business needs and technical knowledge develop.

## Technologies

TypeScript, JavaScript, HTML5, CSS3 and Vite. An experimental Rust module is kept in `crate-engine/`, with WebAssembly-related files under `src/wasm/`.

TypeScript is used to practice static typing and code organization. Rust integration remains experimental and should not be read as a finished production architecture.

## Structure

```text
.github/workflows/   # Automation
crate-engine/        # Experimental Rust module
public/              # Public assets
src/                 # Application code, product/cart logic and styles
src/wasm/            # WebAssembly integration files
index.html           # Entry page
package.json         # Dependencies and scripts
tsconfig.json        # TypeScript configuration
vite.config.ts       # Vite configuration
LICENSE              # MIT license
```

## Run locally

Install Node.js compatible with the repository's Vite version and npm.

```bash
git clone https://github.com/GustavoBenAbraham/algoritmo-doce-v2.git
cd algoritmo-doce-v2
npm ci
npm run dev
```

Open the address printed by Vite. `npm run build` runs TypeScript checks and builds the site; `npm run preview` previews the build.

## What I am practicing

Programming logic, TypeScript and JavaScript, static typing, project structure, Git/GitHub, Vite, debugging, refactoring and exploring new technologies. The work is ongoing; parts of the application are experimental.

## Roadmap

- Improve the interface, responsiveness and error handling.
- Refactor application logic and strengthen architecture.
- Expand TypeScript usage and explore the Rust module.
- Add business-related features and integrations.
- Improve tests, quality and technical documentation.
- Prepare a production release.

Screenshots and a demonstration can be added as the project evolves.

## Contributions

Suggestions and issues are welcome. To contribute code, fork the repository, create a feature branch, implement the change and open a pull request.

## Author and license

[Gustavo Ben Abraham Silva](https://github.com/GustavoBenAbraham) · [LinkedIn](https://www.linkedin.com/in/gustavo-ben-abraham-silva-81058119b/)

Licensed under [MIT](LICENSE).
