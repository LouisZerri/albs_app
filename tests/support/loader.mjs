import { existsSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolvePath(dirname(fileURLToPath(import.meta.url)), '../..');
const stubs = pathToFileURL(resolvePath(root, 'tests/support/native-stubs.mjs')).href;

/** Modules natifs (indisponibles hors du téléphone) → bouchons. */
const NATIVE = new Set([
  'expo-secure-store',
  'expo-file-system',
  'expo-localization',
  '@react-native-community/netinfo',
  'react-native',
  'nativewind',
]);

const withExtension = (path) =>
  [path, `${path}.ts`, `${path}.tsx`, `${path}/index.ts`].find(
    (candidate) => existsSync(candidate) && !candidate.endsWith('/'),
  );

export async function resolve(specifier, context, nextResolve) {
  if (NATIVE.has(specifier)) return { url: stubs, shortCircuit: true };

  const base = specifier.startsWith('@/')
    ? resolvePath(root, 'src', specifier.slice(2))
    : specifier.startsWith('.') && context.parentURL?.startsWith('file:')
      ? resolvePath(dirname(fileURLToPath(context.parentURL)), specifier)
      : null;

  if (base) {
    const file = [`${base}.ts`, `${base}/index.ts`, base].find(
      (c) => existsSync(c) && !c.endsWith('/src'),
    );
    if (file && /\.(ts|mjs|js)$/.test(file))
      return { url: pathToFileURL(file).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}
