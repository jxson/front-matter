MAKEFLAGS += --warn-undefined-variables
PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

version ?= patch

node_modules: package.json
	@npm prune
	@npm install
	@touch node_modules

.PHONY: clean
clean:
	@$(RM) -fr node_modules
	@$(RM) -fr npm-debug.log
	@$(RM) -fr coverage

.PHONY: fmt
fmt: node_modules
	@standard-format -w

.PHONY: lint
lint: node_modules
	@standard

.PHONY: test
test: lint node_modules
	tape test/index.js

.PHONY: browser
browser:
	zuul --local 8080 --ui tape ${ZUUL_OPT} -- test/index.js 

.PHONY: release
release:
	npm version $(version)
	git push && git push --tags
	npm publish

.PHONY: coverage
coverage: node_modules index.js test/index.js node_modules
	@istanbul cover --report html --print detail ./test/index.js
	@touch coverage

.PHONY: coveralls
coveralls: node_modules coverage
	@istanbul report lcov && (cat coverage/lcov.info | coveralls)

.PHONY: travis
travis: test coveralls || test browser
