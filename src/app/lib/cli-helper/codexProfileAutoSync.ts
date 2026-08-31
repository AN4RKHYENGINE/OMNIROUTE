import { syncCodexProfilesFromModels } from "./setup-codex";

export async function syncCodexProfiles(
  models: any[],
  options: {
    codexHome?: string;
  }
) {
  const { codexHome } = options;

  // @ts-ignore - bin CLI modules are shipped as ESM JavaScript, without TS declarations.
  const result = await syncCodexProfilesFromModels(models, { codexHome });

  return {
    added: result.added || [],
    updated: result.updated || [],
    removed: result.removed || [],
  };
}
