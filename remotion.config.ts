import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setChromiumOpenGlRenderer("angle-egl");
Config.setChromeMode("chrome-for-testing");
