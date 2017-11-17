# quickfix
Detects and saves local changes to dependencies that are protected by .gitignore.

## Why?

You've worked 8,000 million-bazillion hours on 4 cups of coffee a minute trying to fix some stupid bug. It's 2am. If it's not fixed by morning Australia will cease to be a country. 

You've found it. It's in a dependency of a dependency of a dependency. You've gone too many layers deep. Making a mirror is gonna take two much time so you just edit the code directly. 

You can't commit `node_modules`. Your code's gonna be deleted.  

Poof. Gone. Never to be seen again.

![but wait](https://media.giphy.com/media/11FRmJRii0I8iA/giphy.gif) 

But **wait**. 
* Wait
* Wait
* Wait

> Hold up.

There's a stupid solution. An amazing, Australia-saving, stupid solution:

```
$ quickfix push
```

Quickfix will save your changes to a `__quickfix__` folder, and then later you can run `quickfix` to update your `node_modules` with your 2am decisions once again. 

Boom. Work saved. 

## Installation
```bash 
$ yarn global add quickfix
```

Add `quickfix` as a `postinstall` attribute in your `package.json`:

``` json
{
  "postinstall": "quickfix"
}
```

## Instructions
After making changes in `node_modules` run the command:
```bash
$ quickfix push
```
To update changes after installing a workspace using quickfix run:

```bash
$ quickfix
```

<p align="center">
  <img src="https://media.giphy.com/media/3orifiTqyQVa1cTpIc/giphy.gif" width="450px" />
</p>
