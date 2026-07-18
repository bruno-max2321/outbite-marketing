import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
// Match broadcast-friendly AAC; source VO should be 48 kHz when recorded.
Config.setAudioCodec("aac");
Config.setAudioBitrate("192k");
