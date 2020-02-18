# Go lint action

Use `golangci-lint` to lint your code.

## Usage

For all possible inputs see [action.yml](action.yml).

### Usage: basic

Go to the [golangci-lint releases](https://github.com/golangci/golangci-lint/releases) page to find
the release version you would like to use.  Enter that version into the `version` input.

```yaml
steps:
  - name: lint
    uses: polothy/turbo-journey@v1
    with:
      version: 1.23.6
```

For added security, you can specify a download checksum. To find the checksum, find the
`golangci-lint-X.Y.Z-checksums.txt` file on the
[golangci-lint releases](https://github.com/golangci/golangci-lint/releases) page.  Download the file,
open it, and find the line with `linux-amd64` (or the platform/arch you are using).  It would look like this:

```
9a00786e1671f9ddbc8eeed51fe85825bcb10a2586ac8ab510c4ceb1ec499729  golangci-lint-1.23.6-linux-amd64.tar.gz
```

Copy the checksum value enter that into the `checksum` input:

```yaml
steps:
  - name: lint
    uses: polothy/turbo-journey@v1
    with:
      version: 1.23.6
      checksum: 9a00786e1671f9ddbc8eeed51fe85825bcb10a2586ac8ab510c4ceb1ec499729
```

### Usage: control failure

By default, the action will fail the step if any auto-fixable linting issues were found. 

If you want the step to never fail due to any linting issues, then use `failOnFixable` input:

```yaml
steps:
  - name: lint
    uses: polothy/turbo-journey@v1
    with:
      version: 1.23.6
      failOnFixable: false
```

If you the step to always fail due to any linting issues, then use `failOnIssue` input:

```yaml
steps:
  - name: lint
    uses: polothy/turbo-journey@v1
    with:
      version: 1.23.6
      failOnIssue: true
```

## Developing

Install the dependencies  
```bash
$ npm install
```

Build the typescript
```bash
$ npm run build
```

Run the tests :heavy_check_mark:  
```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

Update the distribution (required for releasing and testing workflow):
```bash
$ npm run build && npm run pack
$ git commit -a dist/index.js -m "Update dist"
```

## Helpful resources

* [Jest](https://jestjs.io/docs/en/getting-started)
* [Actions toolkit](https://github.com/actions/toolkit)
* [setup-go action](https://github.com/actions/setup-go)
* [GoReleaser action](https://github.com/goreleaser/goreleaser-action)
* [Javascript action tutorial](https://help.github.com/en/actions/building-actions/creating-a-javascript-action)
