export function anySignal(signals: Array<AbortSignal | null | undefined>): AbortSignal {
  const controller = new AbortController();
  const liveSignals = signals.filter(Boolean) as AbortSignal[];

  if (liveSignals.some((signal) => signal.aborted)) {
    const reason = liveSignals.find((signal) => signal.aborted)?.reason;
    controller.abort(reason);
    return controller.signal;
  }

  const onAbort = () => {
    const reason = liveSignals.find((signal) => signal.aborted)?.reason;
    controller.abort(reason);
    cleanup();
  };

  const cleanup = () => {
    for (const signal of liveSignals) signal.removeEventListener('abort', onAbort);
  };

  for (const signal of liveSignals) signal.addEventListener('abort', onAbort, { once: true });
  return controller.signal;
}
