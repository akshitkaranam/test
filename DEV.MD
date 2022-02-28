## Installing new packages

To install new packages, run `npm i` in the utility docker containers to ensure that the packages installed are installed in alpine OS.

1. Change directory to the `utils` folder
2. For client packages, run

```sh
docker-compose run --rm client npm i <package_name>
```

3. Similarly, for server packages, run

```sh
docker-compose run --rm api npm i <package_name>
```

## Installing packages already in package.json

When installing packages already in package.json, we want to install the exact versions of dependencies, so we should use the command `npm ci` which refers to `package-lock.json` for installation.

## Git workflow

Each new feature should reside in its own branch. When a feature is complete, it gets merged into master via a pull request.

### Creating a new feature branch

```sh
git branch <branch_name>
git checkout <branch_name>
```

When done with development on feature, make sure that your repo is up-to-date.

```sh
git checkout master
git pull
```

Then, rebase your feature branch on master and push.

```sh
git checkout <branch_name>
git rebase master
git push
```

After resolving merge conflicts(if any) submit a pull request on GitHub.

### Submitting a pull request

1. Go to the [repo](github.com/pehweihang/cryspbook) on GitHub.
2. Click on [Pull Requests](github.com/pehweihang/cryspbook/pulls)
3. Click on New pull request.
4. Request a merge to master branch.
