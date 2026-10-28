# Dua / Isometric Remotion Preview

A Remotion preview project for the supplied Bengali SRT, built in the selected **Warm Dawn** palette. It contains one portrait composition named `Main` (1080 × 1920, 30 fps), with its duration and scene cue points derived from `public/captions.srt`.

## Visual beats

- A question about dua, shown with a rising light path.
- Two staggered phrases for crying and asking.
- The spring-animated, axis-free isometric chart: **দোয়া → অপেক্ষা → ভরসা → আশা**. The bars are a symbolic visual metaphor only—there are no invented values or claims.
- A hardship statement, the Surah Ash-Sharh line, prayer, and a hopeful close.

Bengali text uses locally bundled Hind Siliguri font files. Six short UI-style SFX are synthesized into `public/sfx/`; no music is used. The optional `PreviewAudio` component is present but voiceover is disabled by default. To audition speech, add `public/voiceover.mp3` and set `ENABLE_VOICEOVER` to `true` in `src/Main.tsx`.

## Run locally

```bash
npm install
npx remotion studio
npx remotion render src/index.ts Main out/video.mp4
```

To regenerate the SFX assets, run `npm run sfx`. The SRT's 40.44-second endpoint rounds to the nearest 30-fps frame (1213 frames, approximately 40.43 seconds).
