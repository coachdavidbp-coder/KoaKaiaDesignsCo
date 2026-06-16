"use client";

import { useCallback, useRef } from "react";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    return new Ctx();
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  gain: number,
  type: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

export function useSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = getAudioContext();
    }
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Short click — tap feedback
  const playClick = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 880, t, 0.06, 0.15, "sine");
  }, [getCtx]);

  // Correct answer chime — ascending two-note
  const playCorrect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 523, t, 0.18, 0.25);        // C5
    playTone(ctx, 784, t + 0.15, 0.22, 0.25); // G5
  }, [getCtx]);

  // Wrong answer buzz
  const playWrong = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 200, t, 0.25, 0.2, "square");
  }, [getCtx]);

  // Mission complete fanfare — ascending arpeggio
  const playComplete = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      playTone(ctx, freq, t + i * 0.12, 0.3, 0.28);
    });
  }, [getCtx]);

  // Level unlock fanfare — triumphant
  const playLevelUp = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    const notes = [523, 659, 784, 659, 1047]; // C5 E5 G5 E5 C6
    notes.forEach((freq, i) => {
      playTone(ctx, freq, t + i * 0.1, 0.35, 0.3);
    });
    playTone(ctx, 1047, t + 0.6, 0.6, 0.35); // sustained high C
  }, [getCtx]);

  // Crystal/coin collect sparkle
  const playCollect = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;
    playTone(ctx, 1047, t, 0.12, 0.2);
    playTone(ctx, 1319, t + 0.08, 0.12, 0.18);
    playTone(ctx, 1568, t + 0.16, 0.16, 0.15);
  }, [getCtx]);

  return { playClick, playCorrect, playWrong, playComplete, playLevelUp, playCollect };
}
