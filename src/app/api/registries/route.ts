import { IMAGE_PROVIDERS } from "@omniroute/open-sse/config/imageRegistry.ts";
import { VIDEO_PROVIDERS } from "@omniroute/open-sse/config/videoRegistry.ts";
import { MUSIC_PROVIDERS } from "@omniroute/open-sse/config/musicRegistry.ts";
import {
  AUDIO_SPEECH_PROVIDERS,
  AUDIO_TRANSCRIPTION_PROVIDERS,
} from "@omniroute/open-sse/config/audioRegistry.ts";

export async function GET() {
  return Response.json({
    IMAGE_PROVIDERS,
    VIDEO_PROVIDERS,
    MUSIC_PROVIDERS,
    AUDIO_SPEECH_PROVIDERS,
    AUDIO_TRANSCRIPTION_PROVIDERS,
  });
}
