
VERSION=patch

release:
	npm version $(VERSION)
	git push && git push --tags
	npm publish

clean:
	@$(RM) -fr node_modules $(STANDALONE).js
	@$(RM) -fr npm-debug.log

test: node_modules
	@npm test

node_modules: package.json
	@npm prune
	@npm install

.PHONY: release clean
