build: prepare-build
	@env BABEL_ENV=esm npx babel src --config-file ./babel.config.js --source-root src --out-dir lib --extensions .mjs,.ts --out-file-extension .mjs --quiet
	@env BABEL_ENV=cjs npx babel src --config-file ./babel.config.js --source-root src --out-dir lib --extensions .mjs,.ts --out-file-extension .js --quiet
	@npx tsc -p tsconfig.lib.json || echo "Built TypeScript declarations with errors"

prepare-build:
	@rm -rf lib/*
	@mkdir -p lib
	@cp package.json lib
	@cp *.md lib
