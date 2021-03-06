---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "Dynamic Redux Reducers"
date: "2018-01-09"
meta:
  description: A detailed approach to a solution for adding Redux Reducers after initial store creation.
  image: /articles/assets/post-image-dynamic-reducers.png
---

<p>
  This post is specific to a need I had on recent React / Redux project. It’s a
  common need and one I’d run into before, but this was the first time I needed to
  come up with a solution for it. This was difficult for me. I had to slow down
  and take time to internalize what I was trying to do and all the pieces involved.
  My hope is that this post will help someone else also working to figure
  this out.
</p>
<p>
  I’ll detail my process in this post. Here’s a
  <a href="https://qk3n9xmm3w.codesandbox.io">live demo</a> and an
  <a href="https://codesandbox.io/s/qk3n9xmm3w">editable sandbox</a>.
  The best way to see the effects is to use the <a href="https://github.com/zalmoxisus/redux-devtools-extension">Redux DevTools Chrome extension</a>.
</p>

<p>
  If you’re reading this I’m going to assume you have knowledge of Redux and
  are using it with React by way of <code>react-redux</code>. I'm also going to
  assume you’re looking for a solution to a similar problem.
</p>

<h2>What am I trying to do and why?</h2>
<p>
  In standard Redux usage, you provide reducer functions at the time you create
  the store with <code>createStore</code>. I wanted a way to add reducer functions
  later, on demand.
</p>
<p>
  A lot of folks need this because their reducers are not available at
  <code>createStore</code> time due to code-splitting. That’s a perfect use for
  dynamic reducers.
</p>
<p>
  My project doesn’t use code-splitting. For this, dynamic reducers were a preference. I
  didn’t want to spread info about modules throughout the project structure.
  I wanted each feature to live in a directory, isolated as much as possible.
  That meant co-locating reducers, components, styles, and so on. I could do
  that and still import the reducers to the main reducer creation, but that
  would couple module reducers to the main reducer.
</p>

<h2>Existing solutions</h2>
<p>
  In my Googling for an existing solution I landing on
  <a href="https://stackoverflow.com/a/33044701">this Stack Overflow question and answer</a>.
  The answer is from Dan Abramov so I knew it was a way to go. My solution uses
  most of the code from that answer.
</p>
<p>
  In Dan’s answer, it all made sense to me until his example of how to inject
  reducers. I’m using React Router, but I don’t define routes the way he described. I didn’t
  want to have to change how I defined my routes for this. I also couldn’t find
  official documentation for methods he used in his example so I wanted to avoid
  copy / paste. I also wanted to fully understand the code I was adding to my project.
</p>
<p>
  It’s worth mentioning two projects I came across in my search.
  <a href="https://github.com/ioof-holdings/redux-dynamic-reducer">redux-dynamic-reducer</a>
  and <a href="https://github.com/asteridux/paradux">paradux</a>. I didn’t try
  either of them because I didn’t see the need in adding another dependency, but
  they might work for you.
</p>

<h2>What the demo shows</h2>
<p>
  The <a href="https://qk3n9xmm3w.codesandbox.io">demo</a> shows a simple page
  with a link to <code>/records</code>. When page loads, the Redux state tree
  contains two keys. One for each reducer function introduced at store creation.
</p>
<p>
  There’s a link to the <code>/records</code> page. When you navigate to that
  page, I add another reducer function for Records. In the rest of this post
  I’ll decribe how I do that.
</p>

<h2>The code</h2>
<p>
  You can follow along in the <a href="https://codesandbox.io/s/qk3n9xmm3w">CodeSandbox</a>.
  I’ll start with creating the root reducer in <code>/rootReducer.js</code>.
</p>

<pre><code class="language-javascript">import { combineReducers } from "redux";
import layout from "./reducers/layout";
import home from "./reducers/home";

/**
 * @param {Object} - key/value of reducer functions
 */
const createReducer = asyncReducers =>
  combineReducers({
    home,
    layout,
    ...asyncReducers
  });

export default createReducer;</code></pre>

<p>
  I pulled this code from Dan’s <abbr title="Stack Overflow">SO</abbr> answer.
  It has two reducer functions; <code>layout</code> and <code>home</code>.
  They’re global reducers, not module level, so they fit well in the root reducer.
</p>
<p>
  The key detail here is the <code>asyncReducers</code> parameter. Adding the
  contents of it to the object given to <code>combineReducers</code> is
  how we add reducers later.
</p>
<p>
  Next up is store creation in <code>/initializeStore.js</code>. Again, most
  of this code is from Dan’s example.
</p>

<pre><code class="language-javascript">import { createStore } from "redux";
import createReducer from "./rootReducer";

const initializeStore = () => {
  const store = createStore(createReducer());

  store.asyncReducers = {};
  store.injectReducer = (key, reducer) => {
    store.asyncReducers[key] = reducer;
    store.replaceReducer(createReducer(store.asyncReducers));
    return store;
  };

  return store;
};

export default initializeStore;</code></pre>

<p>
  The first line of <code>initializeStore</code> is where we create the Redux
  store with the initial reducers from <code>createReducer</code>. In standard
  Redux usage, this is all you’d need. The store is set up and ready with the
  <code>home</code> and <code>layout</code> reducers.
</p>
<p>
  <code>createStore</code> returns a plain object, so we’ll take advantage of that
  by tacking helpful items onto it. We’ll use <code>store.asyncReducers</code> to house
  our dynamic reducers. With <code>store.injectReducer</code> I deviate from
  Dan’s example. The function does the same thing as his <code>injectAsyncReducer</code>,
  but I attach it to the <code>store</code> object for convenience that I’ll
  show later.
</p>
<p>
  <code>injectReducer</code> has two responsibilities. First, store all dynamic
  reducers in <code>asyncReducers</code>. This ensures that each time we invoke
  <code>injectReducer</code> we don’t lose other dynamic reducers. Next up
  is the main work. <a href="https://redux.js.org/docs/api/Store.html#replaceReducer"><code>replaceReducer</code></a>
  isn’t custom, it’s part of Redux. It does does what it says on the tin.
  Invoking it replaces the reducer function with one you give it.
</p>

<h3>Where things got tricky for me</h3>
<p>
  At this point everything seemed straightforward to me, but then I got lost fast. I
  have a store, I have a function to add new reducers. But where can I access
  that function to invoke it? In all my frantic Googling, I couldn’t find an
  example that worked for my setup. So, I sat down to figure out a solution.
</p>
<p>
  It took me a while to figure out where I could access that <code>store</code>
  object. I had clues though. In my entry point file <code>/index.js</code> I
  use the <code>Provider</code> component. This is standard for React / Redux projects.
</p>

<!-- prettier-ignore-start -->
<pre><code class="language-javascript">import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import initializeStore from "./initializeStore";
import App from "./App";

const store = initializeStore();
render(
  &lt;Provider store={store}&gt;
    &lt;App /&gt;
  &lt;/Provider&gt;,
  document.getElementById("root")
);</code></pre>
<!-- prettier-ignore-end -->

<p>
  Giving the <code>store</code> to <code>Provider</code> makes it available to
  all child components by way of the <code>connect</code> function. I read more about it and learned that <code>store</code>
  is also available in the <code>context</code> of each component.
  If you’ve read anything about
  React <code>context</code>, you’ve read that you probably shouldn’t use it.
  For my purposes here it seemed isolated enough to be OK. Time will tell if that’s correct or not.
  More details on my <code>context</code> usage to later.
</p>

<h2>Putting the pieces together</h2>

<p>
  I want to use as little code as possible to add reducers. I do that with a
  <a href="https://reactjs.org/docs/higher-order-components.html">higher-order component</a>
  in <code>/withReducer.js</code>.
</p>

<pre><code class="language-javascript">import React from "react";
import { object } from "prop-types";

const withReducer = (key, reducer) => WrappedComponent => {
  const Extended = (props, context) => {
    context.store.injectReducer(key, reducer);
    return &lt;WrappedComponent {...props} /&gt;
  };

  Extended.contextTypes = {
    store: object
  };

  return Extended;
};

export { withReducer };</pre></code>

<p>
  And example usage in <code>routes/Records/Records.js</code>:
</p>

<pre><code class="language-javascript">import { withReducer } from "../../withReducer";
import reducer from "./ducks";

const Records = () => (...);
export default withReducer("records", reducer)(Records);</code></pre>

<p>
  I’ll start with usage in <code>Records.js</code>. I import the records
  reducer from <code>routes/Records/ducks/index.js</code>. The reducer doesn’t
  do much. It sets hard-coded initial state, then returns it as-is.
  The component acts like a container component.
  I could <code>connect</code> it, but for the purposes of this
  demo, left it out.
</p>
<p>
  The pertinent bit is the last line. There I invoke <code>withReducer</code> and
  provide it a key of “records” and the record reducer. Then I invoke the
  returned function, providing the <code>Records</code> component.
</p>
<p>
  <code>Records</code> is a React component I import to use as
  the value of the <code>component</code> property of a React Router <code>&lt;Route /&gt;</code>.
</p>

<h3>The withReducer component</h3>
<p>
  <code>withReducer</code> is a <a href="https://reactjs.org/docs/higher-order-components.html">Higher-Order Component</a>.
  The <code>key</code> parameter becomes the key in the Redux state tree.
  The <code>reducer</code> parameter is the reducer to add. It returns a function
  that accepts a single parameter, <code>WrappedComponent</code>. That’s expected
  to be a valid React component. In the earlier usage example, that’s the
  <code>Records</code> component.
</p>
<p>
  I’ll jump ahead to an important part of <code>withReducer</code> that was
  new to me and might be confusing.
</p>
<pre><code class="language-javascript">...
Extended.contextTypes = {
  store: object
};
...</code></pre>
<p>
  <code>Extended</code> is a stateless component, so it must define
  a <code>contextTypes</code> property to gain access to <code>context</code>.
  From the React docs:
</p>
<blockquote>
  <p>
    Stateless functional components are also able to reference context if contextTypes is defined as a property of the function.
  </p>
  <cite>
    <a href="https://reactjs.org/docs/context.html#referencing-context-in-stateless-functional-components">reactjs.org/docs/context.html#referencing-context-in-stateless-functional-components</a>
  </cite>
</blockquote>

<p>
  In <code>contextTypes</code> I defined the property I want to access in the
  component, <code>store</code>. That uses the
  <code>object</code> type from the <code>prop-types</code> library.
</p>

<p>
  When a component defines a <code>contextTypes</code> property, it receives
  a second parameter, <code>context</code>. That’s visible in
  the <code>Extended</code> signature:
</p>
<pre><code class="language-javascript">...
const Extended = (props, context) => {...}
...</code></pre>

<p>
  <code>Extended</code> now has access to the <code>store</code> object. That’s
  because <code>&lt;Provider store={store}&gt;</code> in <code>/index.js</code>
  makes it available to all child components via <code>context</code>.
</p>

<p>
  This happens in the <code>Provider.js</code> source with
  <a href="https://github.com/reactjs/react-redux/blob/master/src/components/Provider.js#L26"><code>getChildContext</code></a>
  and <a href="https://github.com/reactjs/react-redux/blob/master/src/components/Provider.js#L52"><code>childContextTypes</code></a>.
  That code is good reading if you’re looking for examples of <code>context</code> usage.
</p>

<p>
  In <code>initializeStore.js</code> I created a function on the store object,
  <code>store.injectReducer</code>. Now, I use that to add the new reducer:
</p>

<pre><code class="language-javascript">...
const Extended = (props, context) => {
  context.store.injectReducer(key, reducer);
  return &lt;WrappedComponent {...props} /&gt;;
};
...</code></pre>

<p>
  The orginal component doesn’t change. <code>Extended</code> only returns
  it with any original properties.
</p>

<h2>How to see this working</h2>
<p>
  At this point, the code works. But, this type of change can be difficult to
  visualize. As mentioned earlier, the <a href="https://github.com/zalmoxisus/redux-devtools-extension">Redux DevTools Chrome extension</a>.
  works best for me.
  In the <a href="https://qk3n9xmm3w.codesandbox.io">demo</a> I included the
  devtools snippet when creating the store. If you install the extension and
  view the Redux panel, you can see new reducers change the state tree.
</p>
<figure>
  <img src="https://d3vv6lp55qjaqc.cloudfront.net/items/1n0J3V3G0j1X2a1M1C00/Screen%20Recording%202018-01-07%20at%2009.52%20PM.gif" alt="Animated gif showing a new reducer added in Redux devtools Chrome extension.">
  <figcaption>
    Demo of the records reducer being added when navigating to the /records route.
  </figcation>
</figure>

<p>
  To further show the results in the demo, I <code>connect</code>ed the record
  route to display record data from the store.
</p>

<!-- prettier-ignore-start -->
<pre><code class="language-javascript">...
const mapStateToProps = (state, props) => {
  const { match: { params: { id } } } = props;

  return {
    recordId: id,
    record: state.records[id] || {}
  };
};

export default connect(mapStateToProps)(Record);</code></pre>

<!-- prettier-ignore-end -->

<p>
  The full code is in <code>/routes/Records/routes/Record.js</code>.
</p>

<h2>A solution</h2>
<p>
  As I mentioned earlier, this is a common need in React/Redux projects for
  different reasons. I’ve used other, similar methods for dynamic
  routes in the past. Other folks have different approaches. With that, this is <em>a</em>
  solution, not necessiarly <em>the</em> solution.
</p>
<p>
  If this is helpful and you use it as-is or change it to fit your needs, let
  me know. There’s always room for improvement.
</p>
