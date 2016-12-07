# What is this

Monaca project template for monaca-lib.

## Branches

There are some branches for us (not for monaca-lib).
`for-lib-2.2.2` branch manages revisions which can be tagged with `2.2.2`.

## How to update

1. Checkout an appropriate branch.
2. Make changes and commit them (except for `webpack.dev.conf.js` and `webpack.prod.conf.js`).
3. Update transpiled contents with `monaca transpile` and commit them.
4. Update `version` described in `package.json` with the syntax `[monaca-lib version]+[date].[count]` and commit it.
    - Example:
        - 2.1.1+20160901.1
        - 2.1.1+20160923.1
        - 2.2.2+20161024.1
        - 2.2.2+20161024.2 (if you make changes many times in a same day)
    - This versioning is required for identifying which revision a user downloaded.
5. Push the commits.
6. Delete tag from the old revision.
7. Add tag to the new revision.
8. If you creates new tag, clear the cache in the Monaca server (for more details, ask Monaca team).

## Specification of `monaca-lib`

[`monaca-lib`](https://github.com/monaca/monaca-lib) downloads a zip file which GitHub generates for each tag.

monaca-lib determines which revision is appropriate for its version as follows:

```
[newer]
...                   ┤
monaca-lib 2.2.3      ┤
monaca-lib 2.2.2      ┼————————   revision E (<- tagged with `2.2.2`, downloaded by monaca-lib) 
                      └————————   revision D (<- not tagged)
monaca-lib 2.2.0      ┐
monaca-lib 2.1.3      ┤
monaca-lib 2.1.2      ┤
monaca-lib 2.1.1      ┼————————   revision C (<- tagged with `2.1.1`, downloaded by monaca-lib))
                      └————————   revision B (<- not tagged)
monaca-lib 2.1.0      ┬————————   revision A (<- tagged with `base`, downloaded by monaca-lib)
...                   ┤
[older]
```

For example, monaca-lib 2.2.3 downloads revision E.
