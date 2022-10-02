install_deps:
	@echo "Installing dependencies..."
	@npm ci

build_static:
	@echo "Building static assets..."
	@yarn build

appimage: build_static
	@echo "Building AppImage..."
	@yarn dist --linux appimage

dev:
	@echo "Starting development server..."
	@npx concurrently --kill-others "yarn craco:start" "wait-on http://localhost:8080 && yarn electron:start"