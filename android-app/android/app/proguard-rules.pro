# React Native specific proguard rules
-keep @interface com.facebook.proguard.annotations.DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclasseswithmembernames class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

-keepclasseswithmembers class * {
    native <methods>;
}

-keep class * extends com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * extends com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class *  { public *; }

-keepclassmembers @com.facebook.react.bridge.ReactMethod class *.* {
    public <methods>;
}

-keepclassmembers class * extends com.facebook.react.bridge.BaseJavaModule {
    public <methods>;
}

# okhttp
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**

# Android lifecycle
-keep class * implements android.arch.lifecycle.LifecycleObserver {
    <init>(...);
}

-keepclassmembers class * implements android.arch.lifecycle.LifecycleObserver {
    <init>(...);
}
