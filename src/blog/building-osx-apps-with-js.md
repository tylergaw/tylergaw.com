---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "Building OS X Apps with JavaScript"
date: "2014-09-27"
meta:
  description:
    OS X Yosemite introduced JavaScript for Automation. This makes it possible
    to build native OS X apps using good ol’ JS. This article covers the
    basics and walks through building an example app.
---

<p class="entry-intro">
  OS X Yosemite introduced JavaScript for Automation. This makes it possible to
  access native OS X frameworks with JavaScript. I’ve been
  digging in to this new world and putting together <a href="https://github.com/tylergaw/js-osx-app-examples">examples</a>
  along the way. In this post I’ll explain the basics and step through building
  a small <a href="https://github.com/tylergaw/js-osx-app-examples/tree/master/ChooseAndDisplayImage.app">example app</a>.
</p>

<p>
  WWDC 2014 included a session on
  <a href="https://developer.apple.com/librarY/prerelease/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/index.html">JavaScript for Automation</a>.
  The session explained that you would be able to use JavaScript in place of
  AppleScript to automate applications. That alone is exciting news. Being able to automate
  repetitive tasks using AppleScript has been around a long time. AppleScript is
  not the most fun thing to write so using a familiar syntax in its place is welcome.
</p>
<p>
  During the session the presenter explains the Objective-C bridge. This is where
  things get super cool. The bridge allows you to import any Objective-C framework
  into JS applications. For example, if you want to build a GUI using standard OS X
  controls you would import Cocoa:
</p>
<pre><code class="language-javascript">ObjC.import("Cocoa");
</code></pre>
<p>
  The <a href="https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/ObjC_classic/_index.html">Foundation</a>
  framework does what its name suggests. It provides the building blocks for
  OS X apps. The framework includes a large amount of classes and protocols.
  <code>NSArray</code>, <code>NSURL</code>, <code>NSUserNotification</code>, and so on. You may not be familiar with
  those classes, but their names hint at what they do. Because of its importance,
  you can use its classes without needing to import it in new apps. They are
  available by default.
</p>
<p>
  As far as I can tell, you can use JavaScript to build anything that you can
  with Objective-C or Swift.
</p>
<h2>Building an example app</h2>
<p class="note-special">
  <b>Note:</b> You need Yosemite Developer
  Preview 7+ for the examples to work.
</p>
<p>
  The best way to get going is to jump in and build something. I’m
  going to walk through building a small app that lets you display an image
  from your computer.
</p>
<p>
  You can download the completed example from my <a href="https://github.com/tylergaw/js-osx-app-examples">example apps repo</a>.
</p>
<figure>
    <img src="https://tylergaw.com/articles/assets/post-image-jsosx-example-01.jpg" alt="">
    <figcaption>
      A screenshot of the app we’ll build.
    </figcation>
</figure>
<p>
  Making up the app is; a window, text label, text input, and button. Or by their
  class names; <code>NSWindow</code>, <code>NSTextField</code>, <code>NSTextField</code>,
  and <code>NSButton</code>.
</p>
<p>
  Clicking the Choose an Image button will show an <code>NSOpenPanel</code> that allows you
  to select a file. We’ll configure the panel to restrict the file selection to .jpg,
  .png, or .gif.
</p>
<p>
  After selecting an image, we'll display it in the window. The window will
  resize to match the width and height of the image plus the height of the controls.
  We’ll also set a minimum width and height for the window to make sure the controls
  don’t get cut off.
</p>
<h3>Setting up the project</h3>
<p>
  Open the Apple Script Editor application located in <code>Applications > Utilities</code>.
  Script Editor ain’t the best editor I’ve ever used, but it’s necessary for now.
  It has a bunch of features that we need for building JS OS X apps. I’m not sure
  what goes on beyond the scenes, but it can compile and run your scripts as apps.
  It also creates extra stuff that we need like an Info.plist file. My guess is there
  are ways to make other editors do the same, but I haven’t looked into it yet.
</p>
<p>
  Create a new document with <code>File > New</code> or <code>cmd + n</code>. The
  first thing we need to do is save the document as an application.
  Save with <code>File > Save</code> or <code>cmd + s</code>.
  Don’t confirm the save right away. There are two options that are necessary to make
  this run as an application.
</p>
<figure>
    <img src="https://tylergaw.com/articles/assets/post-image-jsosx-save.jpg" alt="">
    <figcaption>
      The Script Editor Save dialog with important fields highlighted
    </figcation>
</figure>
<p>
  Change the File Format to “Application”. Check the “Stay open after run handler”
  option. <s>It’s important to set both of these options the first time you save the
  file because–as far as I can tell–there is no way to set them later. If you
  miss one of these you’ll have to create a new document and copy your code over.</s>
</p>
<p>
  <s>If anyone knows a way to change the settings after creation, let me know.</s>
</p>
<p class="note-update">
  <b>Update:</b> A nice <a href="https://tylergaw.com/articles/building-osx-apps-with-js#comment-1609250306">person</a>
  explained how to update the settings. Open the File menu and then hold down
  the option key. That will give you the “Save as...” option. The save dialog
  allows you to make changes to the settings. It’s still best to set these on first save to avoid the hassle.
</p>
<p>
  If you don’t select “Stay open after run handler” your app will open, flash for
  a split second, and then close. There is not much in the way of documentation for
  this stuff online. I only learned this detail after hours of forehead/keyboard merging.
</p>
<h3>Let’s make something do something!</h3>
<p>
  Add the following two lines to your script and then run it with <code>Script > Run Application</code>
  or <code>opt + cmd + r</code>.
</p>
<pre><code class="language-javascript">ObjC.import("Cocoa");
$.NSLog("Hi everybody!");
</code></pre>
<p>
  Not much happened. The only visible changes are in the menu bar and dock. The app
  name along with <code>File</code> and <code>Edit</code> menus are in the menu bar.
  You can see the app is running because its icon is in your dock.
</p>
<p>
  Where is the “Hi everybody!”? What is with the dollar sign, what is this, jQuery?
  Quit the app with <code>File > Quit</code> or <code>cmd + q</code> and
  we’ll find out where that <code>NSLog</code> went.
</p>
<p>
  Open the Console app: <code>Applications > Utilities > Console</code>. Every
  application can log messages to the console. This console is not much different
  than Developer Tools in Chrome, Safari, or Firefox. The main difference is you
  use it for debugging applications instead of websites.
</p>
<p>
  There’s a lot of messages in the console. You can filter it down by
  typing “applet” into the search field in the top right corner. Leave “applet” in
  the search field and go back to Script Editor. Run the application again
  with <code>opt + cmd + r</code>.
</p>
<figure>
    <img src="https://tylergaw.com/articles/assets/post-image-jsosx-console.jpg" alt="A screenshot showing a log message in Console.app">
</figure>
<p>
  Did you see it!? The message “Hi everybody!” should have logged to the console.
  If you didn’t see it, quit your application and run it again. A lot of times
  I forget to quit and the code doesn’t run again.
</p>
<h3>What about the dollar sign?</h3>
<p>
  The dollar sign is your access to the Objective-C bridge. Any time you need
  to access an Objective-c class or constant, you use <code>$.foo</code> or
  <code>ObjC.foo</code>. There are a couple of other ways
  to use <code>$</code> that I’ll cover later.
</p>
<p>
  Console App and <code>NSLog</code> are indispensable tools, you’ll use them
  non-stop for debugging.
  For examples of logging things other than strings, have a look at my
  <a href="https://github.com/tylergaw/js-osx-app-examples/tree/master/NSLog.app">NSLog example</a>.
</p>
<h3>Creating the window</h3>
<p>
  Let’s make something we can see and interact with. Update your script to look
  like the following code:
</p>
<pre><code class="language-javascript">ObjC.import("Cocoa");

var styleMask = $.NSTitledWindowMask | $.NSClosableWindowMask | $.NSMiniaturizableWindowMask;
var windowHeight = 85;
var windowWidth = 600;
var ctrlsHeight = 80;
var minWidth = 400;
var minHeight = 340;
var window = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
$.NSMakeRect(0, 0, windowWidth, windowHeight),
  styleMask,
  $.NSBackingStoreBuffered,
false
);

window.center;
window.title = "Choose and Display Image";
window.makeKeyAndOrderFront(window);
</code></pre>

<p>
  When that’s in place, run the app. <code>opt + cmd + r</code>. Now we’re
  talking! With a small amount of code we’ve built an app that launches a window
  with a title that we can move, minimize, and close.
</p>
<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-jsosx-basic-window.jpg" alt="">
  <figcaption>A basic NSWindow created with JS</figcaption>
</figure>
<p>
  If you’ve never built an app with Objective-C or Cocoa–like me–parts of this might
  look like a lot of gibberish. For me, that was due to the length of the
  method names. I enjoy descriptive names, but Cocoa takes it to the extreme.
</p>
<p>
  Looking past that though, this is JavaScript. This code looks just like code
  you’d write when building a website.
</p>
<p>
  What’s going on with that first new line where we set <code>styleMask</code>?
  You use style masks to configure windows. Each style option says what it adds;
  a title, a close button, a minimize button. These options are constants. Use a pipe “|”
  to separate options. That pipe is a C bitwise <code>OR</code> operator.
  I’m not gonna pretend to know what that means. I just know it’s
  needed to combine style options for a mask and that’s good enough for me.
</p>
<p>
  There are more style options. You can read about them in <a href="https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/WinPanel/Tasks/SettingWindowAppearance.html">the docs</a>.
  <code>NSResizableWindowMask</code> is one you’ll use. Try adding it to the
  style mask to see what it does.
</p>
<p>
  There are a couple interesting things about syntax that you’ll need to remember.
  <code>$.NSWindow.alloc</code> calls the <code>alloc</code> method of <code>NSWindow</code>.
  Notice there are no parenthesis “()” after alloc. In JavaScript that’s how we
  access properties, not how we call a methods. What’s with that? In JS for OS X parenthesis are only
  allowed when calling a method if you pass arguments to it. If you use parenthesis
  with no arguments, you will get a runtime error. Check Console for errors when
  things don’t do what you think they should.
</p>
<p>
  The next thing is about that super long method name:
</p>
<pre><code class="language-javascript">initWithContentRectStyleMaskBackingDefer</code></pre>
<p>
  Take a look at the <code>NSWindow</code> <a href="https://developer.apple.com/library/mac/documentation/Cocoa/Reference/ApplicationKit/Classes/NSWindow_Class/Reference/Reference.html#jumpTo_105">docs</a>
  for that method and you’ll notice it looks a bit different.
</p>
<pre><code class="language-javascript">initWithContentRect:styleMask:backing:defer:</code></pre>
<p>
  In Objective-C you would create the same window we did like this:
</p>
<pre><code class="language-clike">NSWindow* window [[NSWindow alloc]
  initWithContentRect: NSMakeRect(0, 0, windowWidth, windowHeight)
  styleMask: styleMask,
  backing: NSBackingStoreBuffered
  defer: NO];
</code></pre>
<p>
  The thing to note are the colons “:” in the original method signature. When you convert
  and Objective-C method to JS you remove the colons and capitalize the first letter
  following it. When you see two items in brackets “[]”, that is calling a method
  of a class or object. <code>[NSWindow alloc]</code> calls the <code>alloc</code> method
  of <code>NSWindow</code>. For JS, convert those to dot-notation and parenthesis
  if necessary; <code>NSWindow.alloc</code>.
</p>
<p>
  I think the rest of the code to create and display the window is straightforward-enough.
  I’ll skip any more detailed description of it.
  It takes time and a lot of reading the docs to understand what’s happening
  for each step along the way, but you’ll get there. As long as the window is
  showing up you’re doing great. Let’s do more.
</p>
<h3>Adding the controls</h3>
<p>
  We need a label, text field, and button in this window. We’ll use <code>NSTextField</code>
  and <code>NSButton</code> to make that happen. Update your script with the
  following code and then run the app.
</p>
<pre><code class="language-javascript">ObjC.import("Cocoa");

var styleMask = $.NSTitledWindowMask | $.NSClosableWindowMask | $.NSMiniaturizableWindowMask;
var windowHeight = 85;
var windowWidth = 600;
var ctrlsHeight = 80;
var minWidth = 400;
var minHeight = 340;
var window = $.NSWindow.alloc.initWithContentRectStyleMaskBackingDefer(
$.NSMakeRect(0, 0, windowWidth, windowHeight),
  styleMask,
  $.NSBackingStoreBuffered,
false
);

var textFieldLabel = $.NSTextField.alloc.initWithFrame($.NSMakeRect(25, (windowHeight - 40), 200, 24));
textFieldLabel.stringValue = "Image: (jpg, png, or gif)";
textFieldLabel.drawsBackground = false;
textFieldLabel.editable = false;
textFieldLabel.bezeled = false;
textFieldLabel.selectable = true;

var textField = $.NSTextField.alloc.initWithFrame($.NSMakeRect(25, (windowHeight - 60), 205, 24));
textField.editable = false;

var btn = $.NSButton.alloc.initWithFrame($.NSMakeRect(230, (windowHeight - 62), 150, 25));
btn.title = "Choose an Image...";
btn.bezelStyle = $.NSRoundedBezelStyle;
btn.buttonType = $.NSMomentaryLightButton;

window.contentView.addSubview(textFieldLabel);
window.contentView.addSubview(textField);
window.contentView.addSubview(btn);

window.center;
window.title = "Choose and Display Image";
window.makeKeyAndOrderFront(window);
</code></pre>

<p>
  If things worked you’ll now have a window with controls.
  You can’t type in the text field and the button doesn’t do anything, but hey,
  we’re getting somewhere.
</p>
<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-jsosx-controls.jpg" alt="">
  <figcaption>Label, field, and button elements in the window</figcaption>
</figure>
<p>
  What did we do in that addition? <code>textFieldLabel</code> and <code>textField</code>
  are similar. They’re both instances of <code>NSTextField</code>. We make them
  in a similar way as we made the window. When you see <code>initWithFrame</code>
  and <code>NSMakeRect</code>, it’s a good sign that the script is creating
  a UI element. <code>NSMakeRect</code> does what it says. It makes a rectangle
  with the given position and dimensions; <code>(x, y, width, height)</code>. That
  creates what’s called a struct in Objective-C. In JavaScript we’d refer to it as an
  object or hash or maybe dict. It’s a thing with keys and values.
</p>
<p>
  After creating the text fields we set a handful of properties on each to get the
  results we’re looking for. Cocoa doesn’t have anything like the html <code>label</code>
  element. For that we make our own by disabling editing and background styling.
</p>
<p>
  We’ll populate the text field programmatically, so we disable editing on it as well.
  If we didn’t need that, creating a standard text field is a one-liner.
</p>
<p>
  For the button we use <code>NSButton</code>. Like the text fields, creating
  it requires drawing a rectangle. There are two properties that stand out;
  <code>bezelStyle</code> and <code>buttonType</code>. The values for both are
  constants. These properties control how the button will render and the style
  it will have. Check out the <code>NSButton</code>
  <a href="https://developer.apple.com/library/mac/documentation/cocoa/reference/applicationkit/classes/NSButton_Class/Reference/Reference.html">docs</a>
  to see everything you can do with it. I also have
  an <a href="https://github.com/tylergaw/js-osx-app-examples/tree/master/NSButton.app">example app</a>
  that shows the different button types and styles in action.
</p>
<p>
  The last new thing we do is add the elements to the window with <code>addSubview</code>.
  When I first tried this I did <code>window.addSubview(theView)</code>. That works
  for other standard views that you create with <code>NSView</code>, but not for
  instances of <code>NSWindow</code>. I’m not sure why that is, but for windows you
  need to add sub views to the <code>contentView</code>. The docs describe it as;
  “The highest accessible NSView object in the window’s view hierarchy”. Works for
  me.
</p>
<h3>Making the button do something</h3>
<p>
  When clicking the Choose an Image button, we want a panel to open that shows
  files on our computer. Before we do that, let’s warm up by logging a message
  to the console when clicking the button.
</p>
<p>
  In JavaScript you bind event listeners to elements to handle clicks.
  Objective-C doesn’t use quite that same concept. It has what’s called message passing.
  With it, you send a message containing a method name to an object. That object needs
  to have information about what to do when it receives a message containing
  the method name. That may not be a spot-on description, but it’s
  how I understand it.
</p>
<p>
  The first thing we need to do is set the button <code>target</code> and <code>action</code>.
  The <code>target</code> is the object we want to send the <code>action</code>
  to. If this doesn’t make sense now, just keep going and it’ll get more clear
  when you see the code. Update the button setup part of the script with the
  following properties.
</p>
<pre><code class="language-javascript">...
btn.target = appDelegate;
btn.action = "btnClickHandler";
...
</code></pre>
<p>
  <code>appDelegate</code> and <code>btnClickHandler</code> don’t exist yet. We need to
  make them. In the next addition to the script, order matters. I put
  comments in the following code to show where you should add the new stuff.
</p>
<pre><code class="language-javascript">ObjC.import("Cocoa");

// New stuff
ObjC.registerSubclass({
name: "AppDelegate",
methods: {
"btnClickHandler": {
types: ["void", ["id"]],
implementation: function (sender) {
\$.NSLog("Clicked!");
}
}
}
});

var appDelegate = \$.AppDelegate.alloc.init;
// end of new stuff

// Below here is in place already
var textFieldLabel = $.NSTextField.alloc.initWithFrame($.NSMakeRect(25, (windowHeight - 40), 200, 24));
textFieldLabel.stringValue = "Image: (jpg, png, or gif)";
...
</code></pre>

<p>
  Run the app, click the Choose Image button, and watch Console. Do you see “Clicked!”
  when you click the button? If so, that’s pretty darn cool right? If not, double
  check your script matches the code here and look for any errors in Console.
</p>
<h3>Subclassing</h3>
<p>
  What’s this <code>ObjC.registerSubclass</code> all about? Subclassing is a way
  to create a new class that inherits from another Objective-C class. Side note; the likelihood
  I’m using incorrect terminology here is through the roof. Bear with me.
  <code>registerSubclass</code> takes a single argument;
  a JS object with the members of the new object. Members can be; <code>name</code>,
  <code>superclass</code>, <code>protocols</code>, <code>properties</code>, and
  <code>methods</code>. I’m not 100% sure that’s an exhaustive list, but that’s what’s
  in the <a href="https://developer.apple.com/librarY/prerelease/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/index.html#//apple_ref/doc/uid/TP40014508-CH109-SW30">release notes</a>.
</p>
<p>
  That’s all well and good, but what did we do there? Since we didn’t provide a
  <code>superclass</code> we inherited from <code>NSObject</code>. That’s the root
  class of most Objective-C classes. Setting a <code>name</code> let’s us reference
  the object later through the bridge with <code>$</code> or <code>ObjC</code>.
</p>
<p>
  <code>$.AppDelegate.alloc.init;</code> creates an
  instance of our <code>AppDelegate</code> class. Again, notice we don’t
  use parenthesis with the <code>alloc</code> or <code>init</code> methods since
  we’re not passing arguments.
</p>
<h3>Subclass methods</h3>
<p>
  You create a method by giving it any string name. In this case “btnClickHandler”.
  Give it an object with <code>types</code> and <code>implementation</code> members.
  I haven’t found official docs for what the <code>types</code> array should
  contain. Through trial and error I found it goes like this:
</p>
<pre><code class="language-javascript">["return type", ["arg 1 type", "arg 2 type",...]]</code></pre>
<p>
  <code>btnClickHandler</code> won’t return anything so we set the return type to <code>void</code>.
  It takes one parameter, the sender object. In this case it will be the <code>NSButton</code>
  we named <code>btn</code>. We use the “id” type because represents any object.
</p>
<p>
  The full list of types is in the
  <a href="https://developer.apple.com/librarY/prerelease/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/index.html#//apple_ref/doc/uid/TP40014508-CH109-SW32">release notes</a>.
</p>
<p>
  <code>implementation</code> is a normal function. Inside of it you write
  JavaScript. You have the same access to the <code>$</code> bridge as you do
  outside of an object. You also have access to variables you create outside
  the function.
</p>
<h3>A quick note on using protocols</h3>
<p>
  You can implement existing Cocoa protocols with sublcasses,
  but there’s a “gotcha”.
  I found out that if you use the <code>protocols</code> array your script
  will just stop with no errors. I wrote an <a href="https://github.com/tylergaw/js-osx-app-examples/blob/master/docs/subclass-using-NSUserNotificationCenterDelegate.md">example and explanation</a>
  that you’ll want to have a look at if you’re doing that type of thing.
</p>
<h3>Choosing and displaying images</h3>
<p>
  We’re ready to open the panel, choose an image, and display it. Update the
  <code>btnClickHandler</code> implementation function with following code:
</p>
<pre><code class="language-javascript">...
implementation: function (sender) {
  var panel = $.NSOpenPanel.openPanel;
  panel.title = "Choose an Image";

var allowedTypes = ["jpg", "png", "gif"];
// NOTE: We bridge the JS array to an NSArray here.
panel.allowedFileTypes = \$(allowedTypes);

if (panel.runModal == \$.NSOKButton) {
// NOTE: panel.URLs is an NSArray not a JS array
var imagePath = panel.URLs.objectAtIndex(0).path;
textField.stringValue = imagePath;

    var img = $.NSImage.alloc.initByReferencingFile(imagePath);
    var imgView = $.NSImageView.alloc.initWithFrame(
    $.NSMakeRect(0, windowHeight, img.size.width, img.size.height));

    window.setFrameDisplay(
      $.NSMakeRect(
        0, 0,
        (img.size.width > minWidth) ? img.size.width : minWidth,
        ((img.size.height > minHeight) ? img.size.height : minHeight) + ctrlsHeight
      ),
      true
    );

    imgView.setImage(img);
    window.contentView.addSubview(imgView);
    window.center;

}
}
</code></pre>

<p>
  The first thing we do is create an instance of an <code>NSOpenPanel</code>. If
  you’ve ever selected a file to open, or a location to save a file you’ve seen
  panels in action.
</p>
<p>
  We only want the app to open images. Setting <code>allowedFileTypes</code> lets
  us specify the allowed types for the panel. It expects an <code>NSArray</code>. We create
  a JS array with <code>allowedTypes</code>, but we need to convert that to an
  <code>NSArray</code>. We make that conversion with <code>$(allowedTypes)</code>.
  This is another use of the bridge. You use it in this way to bridge
  a JS value to Objective-C. To bridge an Objective-C value to JavaScript you’d
  use <code>$(ObjCThing).js</code>.
</p>
<p>
  We open the panel with <code>panel.runModal</code>. That pauses code execution.
  When you click Cancel or Open, the panel will return a value.
  If you clicked Open, the contstant value of <code>$.NSOKButton</code> is returned.
</p>
<p>
  The other note about <code>panel.URLs</code> is important. In JS, we access
  the first value of an array with <code>array[0]</code>. Because <code>URLs</code>
  is an <code>NSArray</code> we can’t use bracket notation. Instead we use the <code>objectAtIndex</code>
  method. They both give the same results.
</p>
<p>
  Once we have the URL of the image we can create a new <code>NSImage</code>.
  Since it’s common to create an image from a file URL, there’s a handy method
  doing it:
</p>
<pre><code class="language-javascript">initByReferencingFile</code></pre>
<p>
  We create an <code>NSImageView</code> using the same process we did for creating
  other UI elements. <code>imgView</code> handles displaying the image.
</p>
<p>
  We want to change the width and height of our window to match the width and height of
  the image. We also want to make sure we don’t go below a minimum width or height.
  We use <code>setFrameDisplay</code> to change the size of the window.
</p>
<p>
  We wrap things up by setting the image view image and
  adding it to the window. Since its width and
  height have updated we re-center the window.
</p>
<p>
  And that’s our little app. Kick it around, open a bunch of images. And yes,
  animated gifs will display and play so be sure to try some.
</p>
<h3>Tidbits</h3>
<p>
  So far, we’ve been running the app from Script Editor
  with <code>opt + cmd + d</code>. You run the actual app by double clicking
  its icon like any other application.
</p>
<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-jsosx-appicon.jpg" alt="">
  <figcaption>Double click the icon to run the app</figcaption>
</figure>
<p>
  You can update the app icon by replacing <code>/Contents/Resources/applet.icns</code>.
  To access the app resources, right click on the app icon and choose “Show Package Contents”.
</p>
<h2>Why I’m excited</h2>
<p>
  I’m excited about this because I think it has a lot of potential. Here’s
  how I’ve been thinking about it. When Yosemite is available, anyone that installs
  the OS will be able to sit down and write a native application. They will be
  able to do so using one of the most ubiquitous programming languages that exists. They
  won’t need to download or install anything extra. You don’t even have to install
  or open Xcode if you don’t want to. That removes a massive barrier to entry.
  It’s incredible.
</p>
<p>
  I know there’s a whole lot more to building OS X apps than just being able
  whip up a quick script. I don’t have any illusions that JavaScript will become
  the defacto way to build for the Mac. I do think this will allow developers
  to build small apps that make development easier for themselves and for other
  people. Have a team member that’s not so comfortable using the command line?
  Build a quick GUI for them. Need a quick, visual way to create and update
  a large configuration file? Make a little app for it.
</p>
<p>
  Other languages have these capabilities. Python and Ruby have access to the same
  native APIs and people make apps using those languages. Something just feels
  different about being able to use JavaScript. It feels subversive. It feels
  like some of the DIY of the Web knocking on the door of the Desktop.
  Apple left the door unlocked, I’m inviting myself in.
</p>
<p>
  <i>Thanks for reading</i>
</p>
