// // This section sets up some basic app metadata,
// // the entire section is optional.
// App.info({
//   id: 'com.example.matt.uber',
//   name: 'gbg 2.0',
//   description: 'Get über power in one button click',
//   author: 'Matt Development Group',
//   email: 'contact@example.com',
//   website: 'http://example.com'
// });

// // Set up resources such as icons and launch screens.
App.icons({
  'iphone': 'icons/Artboard-3.png',
  'iphone_2x': 'icons/Artboard-3@2x.png',
  'iphone_3x': 'icons/Artboard-3@3x.png'
});

App.launchScreens({
  'iphone': 'public/launch_screens/loading-01.png',
  'iphone_2x': 'public/launch_screens/loading-02.png',
  'iphone5':'public/launch_screens/loading-03.png',
  'iphone6':'public/launch_screens/loading-04.png',
  'iphone6p_portrait':'public/launch_screens/loading-05.png'
});







// 320x480
// 640x960
// 640x1136
// 750x1334
// 1242x2208px

// // Set PhoneGap/Cordova preferences
// App.setPreference('BackgroundColor', '0xff0000ff');
// App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('EnableViewportScale', true);
// App.setPreference('StatusBarOverlaysWebView', false);
