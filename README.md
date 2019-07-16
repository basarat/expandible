# Expandible

[![Greenkeeper badge](https://badges.greenkeeper.io/basarat/expandible.svg)](https://greenkeeper.io/)

> Making Expandibles / Collapsible / Accordian core easy ❤️

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

Built with / for TypeScript / React. Expand and collapse certain DOM with silky smooth transitions.

> [Powered by your github ⭐s](https://github.com/basarat/expandible/stargazers)

## Usage

`npm install expandible --save-dev`

Use with react: 

```tsx
import {Expandible} from "expandible";

// Later

{/** Toggle */}
<button onClick={() => this.setState({ open: !this.state.open })}>Toggle</button>

{/** Expandible */}
<Expandible open={this.state.open}>
  <div>
    Hello world!
  </div>
</Expandible>
```

## Demo 
The above code is exactly how this works: 
![](https://raw.githubusercontent.com/basarat/expandible/master/demo.gif)

[travis-image]:https://travis-ci.org/basarat/expandible.svg?branch=master
[travis-url]:https://travis-ci.org/basarat/expandible
[npm-image]:https://img.shields.io/npm/v/expandible.svg?style=flat
[npm-url]:https://npmjs.org/package/expandible
