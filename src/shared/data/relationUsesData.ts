// Auto-converted from relationUsesData.js
export interface RelationData {
  guid: string;
  name: string;
  source_guid: string;
  source_type: string;
  target_guid: string;
  target_type: string;
  creation_timestamp: string;
  creation_source: string;
}

export const relationUsesData = [
  {
    "guid": "d7729f7d-1b2e-7bbb-d07b-df746d9b333b",
    "name": "django_web_app_uses_pytest",
    "source_guid": "fc0483d0-7462-84cf-8145-b8cefe04bbb3",
    "source_type": "component",
    "target_guid": "ee56e779-ed6c-2240-99b5-26f03891f9f8",
    "target_type": "tool",
    "creation_timestamp": "2025-04-23T18:42:31.092685",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "2480b4ba-6851-d700-9727-2164b6781caa",
    "name": "frontend_app_uses_jest",
    "source_guid": "25d87628-0832-bffb-0142-44fe39b6b033",
    "source_type": "component",
    "target_guid": "fdf1e5d1-5927-ec07-497a-e0618f57bc70",
    "target_type": "tool",
    "creation_timestamp": "2025-04-23T18:42:31.092689",
    "creation_source": "posthog/posthog_fork/README.md\r"
  },
  {
    "guid": "d38eb94a-a98b-ac85-1a53-a9a6aa6f1b71",
    "name": "frontend_app_uses_playwright",
    "source_guid": "25d87628-0832-bffb-0142-44fe39b6b033",
    "source_type": "component",
    "target_guid": "37fe16bd-034e-f06c-c123-12fd2353f50d",
    "target_type": "tool",
    "creation_timestamp": "2025-04-23T18:42:31.092693",
    "creation_source": "posthog/posthog_fork/README.md"
  }
];
