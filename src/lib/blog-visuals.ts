let chartModulePromise: Promise<typeof import('chart.js/auto')['default']> | null = null;
let mermaidModulePromise: Promise<typeof import('mermaid')['default']> | null = null;
let katexAutoRenderPromise: Promise<typeof import('katex/contrib/auto-render')['default']> | null =
  null;

export function loadChartJs() {
  if (!chartModulePromise) {
    chartModulePromise = import('chart.js/auto').then((module) => module.default);
  }

  return chartModulePromise;
}

export function loadMermaid() {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then((module) => module.default);
  }

  return mermaidModulePromise;
}

export function loadKatexAutoRender() {
  if (!katexAutoRenderPromise) {
    katexAutoRenderPromise = import('katex/contrib/auto-render').then(
      (module) => module.default,
    );
  }

  return katexAutoRenderPromise;
}
