---
author: Vlad
title: Improving Performance with Chrome Profiling Tools
tags:
  - Profiling
date: '2018-04-13'
---
Software engineering is a game of cost benefit analysis. When looking at a performance issue, there could be a wide range of causes. Taking some time to analyze the root cause of an issue, and making a plan of attack, can save you time in the long run.

If you want an introduction on how to use Chrome performance tools, I’d recommend having a look at [this Chrome Devtools article](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/). If you’re looking for a basic, but very real scenario where the tool provides a systematic approach to addressing a slow loading page, keep reading!
### “Show All” button
Enter our example. A basic non-customer facing CMS page, with a “Show all entries” button. It pulls a list of all buildings, and renders a building card for each one. This is something that worked perfectly fine when it was first implemented, but became very slow as the database grew. Real world load times here are in the 10 second range, for a dataset of ~2000 objects.

![slow loading button](/assets/blog/profiler/show_all_anim.gif)

As a developer who’s eager to optimize, we can start making guesses:
* Maybe the organization of our database is causing a slowdown in the retrieval of these entries.
* Maybe this is a large chunk of data, and it takes a while for the network call to complete.
* Maybe we’re drawing these objects to the screen in an inefficient manner. 

These sound fairly educated, but personally I’m not comfortable committing time and effort to a solution just yet. Let’s dig in and try to identify the root cause of the issue, and then scope out the cost and benefit of possible possible solutions. 
### Workflow
Let’s record an initial performance profile, and make some educated guesses as to where we should find improvements. 

![First run of profiler](/assets/blog/profiler/perf_1.png)

The doughnut chart above is a mostly accurate summary of where we’re spending time, the only caveat is that the async network call is considered “Idle.” What this graph tells us, is that we do indeed wait on a network call, but we also spend more than 10x as long processing and rendering the response of that network call. 
A developer who dove in and started working on methods to speed up the backend call would probably make this page run faster, but the profile tells us that there’s potential to make this interaction much faster with just front-end changes. 

Real world solutions would involve rendering smaller chunks of the data, with something like pagination or infinite scrolling. The details of that are outside the scope of this article, but let’s prove to ourselves that rendering a subset of the data actually speeds things up. Instead of rendering the entire ~2000 object list, let’s only render the first 50. This should mimic the performance of a paged approach (drawing 50 objects per page.) 

![Code snippet limiting number of buildings drawn to 50](/assets/blog/profiler/code_snip.png)

Now let’s run another profile.

![Second run of profiler](/assets/blog/profiler/perf_2.png)

This dropped our load time from ~7600ms to ~880, and the slowest component is now our network call. The network call still accounts for ~600ms, but the page drawing down dropped from ~7000ms, to ~230ms (we’re drawing ~1/40th of the elements in ~1/30th of the time)

This gives us an idea for the lower bound of how fast of an experience we can provide, using just a front end change. We’re now equipped with a key piece of information: we can rework the front end to where it will load and render the building list about 10x as fast as it does today, but this will not be faster than our network call. If this is an acceptable trade-off, we can proceed with this solution. If there is a requirement for a sub 500ms loading time, this solution will not suffice. What’s the right choice? Depends on your requirements.


### Caveats
Keep in mind the performance data is affected by a ton of variables, including your network conditions and CPU speed. No two consecutive profiles will be identical. I’m using approximations instead of exact numbers above because I believe these numbers will change from profile to profile, but still tell a very valid story.

Please be aware of what your typical user looks like, too. Are they in a different country? Are they on mobile internet? Are they using slow machines? 

If you have an interaction that is 10% network and 90% CPU, someone on a very slow connection could experience this as 70% network and 30% CPU. Chrome does provide some tools to simulate these situations. Under the Performance tab, we have the following dropdowns available to us:

![Enabling network throttling](/assets/blog/profiler/throttle.png)

Let’s run our second profile one more time, with the network and CPU throttling enabled. 

![Third run of profiler](/assets/blog/profiler/perf_3.png)


The same network call now takes ~2s, and represents 90% of our interaction. 

### Takeaway
Here’s the things we learned from our brief investigation:
1. This page will get slower if/when the number of records grows.
2. A front-end only change could drop the load time by almost 90%. (In Node world, this could be as simple as dropping in an [infinite scrolling module](https://www.npmjs.com/package/infinite-scroll). )
3. The bottom limit to a front-end solution is the time of the network call. This will increase if/when the number of records grows. This will also increase in time if a user is on a slower network connection.
4. The higher cost solution is to make smaller network calls, but that solution might be too high cost if a customer never sees this page, and if the page is not used often. I’m assuming this solution is higher cost, because it will require changes to the backend call, as well as front end changes to process the new data format. 

What’s the right path forward? It depends on your requirements and priorities. Armed with this knowledge you should be able to make a much better decision. 
