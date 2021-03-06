---
layout: post
title: Integrating Unity 3D Within a Native iOS App
tags: [ios, unity3d, tech]
author: ming
---

One of the limitations with using the [Unity 3D](http://www.unity3d.com) game engine for developing an iOS app is that, by design, the Unity-built app runs within its own environment where access to native iOS capabilities is restricted. For the majority of Unity's use cases, this works very well. After all, Unity is a game engine and games are not expected to need a tab bar or a navigation bar. For non-standard Unity-based iOS applications however, this means that developers have to resort to various tricks to accommodate Unity within their iOS apps. 

At [Floored](http://www.floored.com), we encountered this issue recently when we have to leverage Unity's 3D capabilities for a subset our app's feature set. The app is meant to function like any other iOS apps, with native iOS interface and buttons, but on certain views it switches to Unity for 3D renders. 

<figure>
<img src="/blog/images/2013-01-08-unity-ios-comparison.jpg" width="585" alt="Screenshot of Floored app, with iOS view and Unity view" />
<figcaption>Floored app with native iOS view on left and Unity view on right</figcaption>
</figure>

This blog post&#8212;our first technical blog post!&#8212;will detail the approach we took to achieve this, including the steps necessary to overlay native iOS UI interface above the Unity view and have the Unity view support all interface orientations smoothly.

## Two Problems

Integrating Unity and iOS immediately presents two problems that have to be addressed:

1. Enable effective communication between the Unity and iOS/Objective-C component of the application; and 
2. Reduce a self-contained Unity-generated app to a view component within an larger iOS app that can be presented and dismissed by other view controllers as necessary

The first problem has been addressed by a few blog posts:

- [Bridging Unity and the iOS SDK](http://millipede.com.au/blog/bridging-unity-and-the-ios-sdk/)
- [The Unity/Objective-C Divide](http://www.tinytimgames.com/2010/01/10/the-unityobjective-c-divide/)
- [Call Objective-C from Unity & Call Unity from Objective-C](http://alexanderwong.me/post/29861010648/call-objective-c-from-unity-call-unity-from)

All of these methods work relatively well; for our app we used `UnitySendMessage` for iOS to Unity communication.

Here, we will focus mainly on the second problem, built upon the solution outlined in [Building a iOS Unity + UIView / UIViewController / Interface Builder App](http://alexanderwong.me/post/29949258838/building-a-ios-unity-uiview-uiviewcontroller). It is a good starting point, and the approach we took was broadly similar. The key difference is that instead of forwarding methods to the Unity controller, we subclass Unity's AppController and use it as the application delegate. We find this to more cleanly separate the Unity-generated AppController from the typical app delegate. 

Also, do note that whichever method you choose to adopt, forgoing a Unity-only app comes at the expense of easy portability to other platforms.

## Unity in a Tab Bar Controller

We will use the iOS app built from Unity's example project "Angrybots" as an example. It is based on iOS 6 and Unity 3.5, and we will modify the code generated by Unity and "enclose" Unity in a tab bar controller. This will allow users to switch from iOS to Unity and vice versa via with native iOS tabs.

Let's start with the `AppController.mm` file in the Unity-generated Xcode project. 

By default, Unity sets the `UIApplicationMain` function in `main.mm` to assign the `AppController` class as the application delegate. On application start, the `startUnity` method in `AppController.mm`'s `application:didFinishLaunchingWithOptions:launchOptions` will be called. `startUnity` will trigger `UnityInitApplication`, and upon initialization, the program flow will be passed back to the `OpenEAGL_UnityCallback` function. This occurs right before `prepareRunLoop` is called.

The `OpenEAGL_UnityCallback` performs a few crucial steps. It creates the application window and initializes an instance of `UnityViewController`. Similarly, an instance of `EAGLView`&#8212;the view responsible for rendering Unity's OpenGL scenes&#8212;is created. This is assigned as the controller's view, and the controller is then made the root view controller. 

AppController has roughly four related components:

- C/C++ function declarations 
- The app delegate&#8212;`AppController`
- `UnityViewController`
- `EAGLView`

### Decouple UnityViewController from AppController

Since our app needs to display and hide Unity's view as necessary, our first task is to decouple `UnityViewController` from `AppController`.

#### Reassign the app delegate

To separate these components, the first step is to reassign the app delegate:

1. Create new .h and .m files called AppDelegate

2. Make AppDelegate a subclass of AppController

3. In AppDelegate.m, add the `application:didFinishLaunchingWithOptions:launchOptions` method and have it call the corresponding method in its superclass 

4. Modify `UIApplicationMain` in main.mm to use `AppDelegate` instead of `AppController`:

        
        UIApplicationMain(argc, argv, nil, @"AppDelegate");

#### Make UnityViewController accessible
At this point, the app should still function exactly like it did before. The next step is to create a property for UnityViewController so that we can access it in the new AppDelegate:

1. In AppController.h, in the interface section for `AppController`, create a method that returns UnityViewController:

        - (UIViewController *)unityVC;

2. Add this method in AppController.mm, under the implementation section for `AppController`:

        - (UIViewController *)unityVC
        {
            return UnityGetGLViewController();
        }

3. Declare the `unityVC` property in AppDelegate.h

        @property (nonatomic, strong) UIViewController *unityVC;

4. In AppDelegate.m right after `[super application:application didFinishLaunchingWithOptions:launchOptions];`, assign the Unity View Controller to this property:

        self.unityVC = [super unityVC];

### Add a UITabBarController

We will now add a UITabBarController to the app:

1. In AppDelegate.h create the UIWindow `window` and UITabBarController `tabVC` properties. Synthesize these properties in AppDelegate.m 

2. In AppDelegate.m's `application:didFinishLaunchingWithOptions`, initialize the window.

        CGRect rect = [[UIScreen mainScreen] bounds];
        self.window = [[UIWindow alloc] initWithFrame:rect];

3. Initialize `tabVC`, assigning it two view controllers, and make `tabVC` the window's rootViewController:

        UIViewController *viewController1 = [[UIViewController alloc] init];
        viewController1.view = [[UIView alloc] initWithFrame:self.window.frame];
        viewController1.view.backgroundColor = [UIColor whiteColor];
        UIViewController *viewController2 = [[UIViewController alloc] init];
        viewController2.view = [[UIView alloc] initWithFrame:self.window.frame];
        viewController2.view.backgroundColor = [UIColor grayColor];
        self.tabVC.viewControllers = @[viewController1, viewController2];
        self.window.rootViewController = self.tabVC;

4. Finally, make `window` the application's key window:

    `[self.window makeKeyAndVisible];`


### Wrapping up

Build and run the app. If everything works correctly, you should see two tabs, one displaying a white background and the other showing a gray background. If the background color of the views is `[UIColor clearColor]`, you will see Unity running in the background. This is because there is currently no way to unload Unity from the app once it has started running.

At this point, assigning the UnityViewController as one of the tabs will trigger a `UIViewControllerHierarchyInconsistency` exception when the app is run. This is because UnityViewController is still assigned as the rootViewController of the UIWindow created in AppController.mm's `OpenEAGL_UnityCallback`. We have to make sure that it isn't assigned as a root view controller before we can make UnityViewController a child of the tab bar controller: 

1. Remove these lines from `OpenEAGL_UnityCallback` in AppController.mm

        if( [_window respondsToSelector:@selector(rootViewController)] )
        _window.rootViewController = controller;

2. In AppDelegate.m's `application:didFinishLaunchingWithOptions`, add `self.unityVC` to `self.tabVC.viewControllers = @[viewController1, viewController2];` so that it looks like this:

        self.tabVC.viewControllers = @[viewController1, viewController2, self.unityVC];

That's about it! 

Build and run the app. You should have the Unity view in the last tab and switching tabs from iOS to Unity should work properly.

## Up next: rotation issues

If your Unity view supports multiple interface orientations, there are subtle rotation issues that will arise using this approach. In a future post, we will outline the modifications to AppController needed to resolve this.