import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
    dataset: (process.env.SANITY_STUDIO_DATASET as string) || 'production',
  },
  // Pick a unique name once; it becomes https://<name>.sanity.studio
  studioHost: 'drazynth-vault',
})
