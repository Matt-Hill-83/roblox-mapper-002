# F007 - Harness Code Categorization - Summary

## Overview

This feature analyzes the Harness repository (https://github.com/harness/harness) to generate structured data for visualization. It scans the codebase to identify file properties and creates 200 JSON objects with categorized metadata, replacing the current fake data with real repository information.

## ASCII Representation of GUI

```
┌─────────────────────────────────────────────────────────────────┐
│                 Harness Repository Analyzer                      │
├─────────────────────────────────────────────────────────────────┤
│ Scanning Progress                                                │
│ ┌─────────────────────────────────────────────────────────┐    │
│ │ ████████████████████████░░░░░░░░░░  75% (150/200 files) │    │
│ └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│ Property Distribution                                            │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ Service:      [Platform: 45] [CI: 38] [CD: 32] [CE: 25]   │  │
│ │ Component:    [API: 55] [UI: 42] [Utils: 38] [Test: 35]   │  │
│ │ Language:     [Java: 78] [Go: 52] [JS: 40] [Python: 20]   │  │
│ │ Size:         [Small: 95] [Medium: 65] [Large: 30]         │  │
│ │ Type:         [Source: 140] [Test: 35] [Config: 25]        │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│ Sample Output                                                    │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ {                                                           │  │
│ │   "path": "platform/service/src/api/handler.java",         │  │
│ │   "service": "platform",                                    │  │
│ │   "component": "api",                                       │  │
│ │   "language": "java",                                       │  │
│ │   "size": "medium",                                         │  │
│ │   "type": "source"                                          │  │
│ │ }                                                           │  │
│ └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Features

- Repository scanning and analysis
- Property extraction for 200 files
- 5 properties per file with 5+ categories each
- JSON dataset generation
- Real data to replace current fake data