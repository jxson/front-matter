
VERSION=patch

release:
	npm version $(VERSION)
	git push && git push --tags
	npm publish

.PHONY: release
