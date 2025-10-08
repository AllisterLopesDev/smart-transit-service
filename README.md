# Smart Transit Service

Smart Transit Service is a modern, scalable service designed to optimize public transport operations, offering real-time tracking, route optimization, and seamless integration with transport management systems.

---

## Features

- **Real-Time Tracking** – Monitor buses and trains in real time.
- **Route Optimization** – Suggests the most efficient routes based on live data.
- **Scalable Architecture** – Built to handle city-wide transport systems.
- **API-Driven** – Easily integrate with third-party systems.

---

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)

### Installation & Setup

1. **Clone the repository:**

```bash
git clone https://github.com/AllisterLopesDev/smart-transit-service.git
cd smart-transit-service
```

2. **Install dependencies:**

```bash
npm install   # or yarn install
```

3. **Configure environment variables:**

   - Copy the example environment file and update with your configuration.

```bash
cp .env.example .env
```

- Set database connection strings, API keys, and other variables in `.env`.

4. **Run database migrations (if applicable):**

5. **Start the development server:**

```bash
npm run dev   # starts the service in watch mode
```

### Running Tests

```bash
npm test
```

### Running with Docker (Optional)

```bash
docker-compose up --build
```

This will spin up the service and dependencies (e.g., database) in containers.

---

## Branching Strategy

This project follows **Git Flow** for branching and release management.

- `main` – Always production-ready.
- `develop` – Next release integration branch.

For detailed contribution and branching guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Release Process

- Merge `develop` into `main` when a release is ready.
- Tag releases using the format `vX.Y.Z`.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on environment setup, branching strategy, commit conventions, and pull request process.





## Integrating Linting & Code Quality Tools

This document explains how to set up and enforce linting & code quality in our project (Node.js, Express, React Native, PostgreSQL).

🔹 1. Why Linting & Code Quality?

Linting ensures:

Consistent coding style.

Early detection of errors (unused variables, bad imports, etc.).

Enforced team coding standards.

Higher maintainability and fewer bugs.

We use:

ESLint → Linting for JavaScript/TypeScript (backend + React Native).

Prettier → Automatic code formatting.

Husky + lint-staged → Git pre-commit hooks to enforce rules locally.

GitHub Actions / CI → Run lint checks on every push & PR.

🔹 2. Installation & Setup
Step 1: Install dependencies
npm install eslint prettier husky lint-staged eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks --save-dev

Step 2: ESLint configuration

Create .eslintrc.json in project root:

{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "plugins": ["react", "react-hooks"],
  "rules": {
    "no-unused-vars": "warn",
    "eqeqeq": "error",
    "semi": ["error", "always"],
    "indent": ["error", 2],
    "react/prop-types": "off"
  }
}

Step 3: Prettier configuration

Create .prettierrc:

{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true
}

🔹 3. Pre-commit Hook Setup
Step 1: Initialize Husky
npx husky install

Step 2: Add hook
npx husky add .husky/pre-commit "npx lint-staged"

Step 3: Add lint-staged config in package.json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
}


✅ Now linting & formatting run automatically before every commit.

🔹 4. CI/CD Lint Check

We enforce linting in CI pipelines to block bad code.

GitHub Actions Example (.github/workflows/lint.yml):

name: Lint Code

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint

🔹 5. Running Lint & Fixing Issues
Manual Linting
npm run lint

Auto-fix issues
npm run lint -- --fix
npm run format

🔹 6. Common Issues & Fixes

❌ no-unused-vars → Remove unused imports/variables.

❌ eqeqeq → Use === instead of ==.

❌ Prettier formatting issues → Run npm run format.

❌ React Hooks error → Ensure hooks are used inside components/functions.

🔹 7. Summary

✅ ESLint + Prettier = Consistent style & error detection.

✅ Husky + lint-staged = Prevent bad commits.

✅ CI Linting = Enforced in pipelines.

✅ Documentation = Clear developer guide for fixing issues.