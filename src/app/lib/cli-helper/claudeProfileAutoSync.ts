import { syncClaudeProfilesFromModels } from "./setup-claude";

export async function syncClaudeProfiles(
  models: any[],
  options: {
    claudeHome?: string;
    profileBaseUrl?: string;
  }
) {
  const { claudeHome, profileBaseUrl } = options;

  // @ts-ignore - bin CLI modules are shipped as ESM JavaScript, without TS declarations.
  const result = await syncClaudeProfilesFromModels(models, {
    claudeHome,
    baseUrl: profileBaseUrl,
  });

  return {
    added: result.added || [],
    updated: result.updated || [],
    removed: result.removed || [],
  };
}
