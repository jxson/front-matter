
VERSION := patch
EXAMPLE_FILES := $(shell find example -name "*.md")

release:
	npm version $(VERSION)
	git push && git push --tags
	npm publish

clean:
	@$(RM) -fr node_modules $(STANDALONE).js
	@$(RM) -fr npm-debug.log

test: test/fixtures.json node_modules
	prova test/test-*.js

node_modules: package.json
	@npm prune
	@npm install

test/fixtures.json: $(EXAMPLE_FILES)
	node test/generate-fixtures.js --outfile $@ $^

.PHONY: release clean test/fixtures.json
