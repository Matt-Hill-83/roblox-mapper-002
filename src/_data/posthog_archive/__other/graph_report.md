# Enterprise Knowledge Graph Report

## Overview

- **Total Entities:** 1460
- **Total Relations:** 828
- **Entity Types:** 15
- **Relation Types:** 23

## Entity Summary

| Entity Type | Count | Percentage |
|-------------|-------|------------|
| file | 600 | 41.1% |
| flag | 200 | 13.7% |
| class | 200 | 13.7% |
| method | 200 | 13.7% |
| artifact | 66 | 4.52% |
| user | 50 | 3.42% |
| tool | 34 | 2.33% |
| resource | 31 | 2.12% |
| module | 30 | 2.05% |
| component | 16 | 1.1% |
| system | 13 | 0.89% |
| group | 9 | 0.62% |
| domain | 7 | 0.48% |
| environment | 3 | 0.21% |
| infraProvider | 1 | 0.07% |

## Relation Summary

| Relation Type | Count | Percentage |
|---------------|-------|------------|
| defined_in | 200 | 24.15% |
| deployed_in | 137 | 16.55% |
| deployed_to | 113 | 13.65% |
| creates | 66 | 7.97% |
| controls | 43 | 5.19% |
| maintains | 40 | 4.83% |
| part_of | 30 | 3.62% |
| owns | 29 | 3.5% |
| contains | 29 | 3.5% |
| depends_on | 29 | 3.5% |
| monitors | 22 | 2.66% |
| belongs_to | 22 | 2.66% |
| exposes | 15 | 1.81% |
| used_by | 10 | 1.21% |
| packaged_as | 9 | 1.09% |
| consumes | 7 | 0.85% |
| manages | 6 | 0.72% |
| tests | 5 | 0.6% |
| secures | 5 | 0.6% |
| provided_by | 3 | 0.36% |
| member_of | 3 | 0.36% |
| uses | 3 | 0.36% |
| tracks_errors | 2 | 0.24% |

## Entity Property Coverage

### flag (200 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| default | 200 | 100.0% |
| description | 200 | 100.0% |

### user (50 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 50 | 100.0% |
| email | 50 | 100.0% |
| role | 50 | 100.0% |
| team | 50 | 100.0% |

### domain (7 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 7 | 100.0% |

### class (200 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 200 | 100.0% |
| file_path | 200 | 100.0% |
| language | 200 | 100.0% |

### group (9 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 9 | 100.0% |

### environment (3 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 3 | 100.0% |
| region | 3 | 100.0% |

### artifact (66 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 66 | 100.0% |
| type | 66 | 100.0% |
| version | 66 | 100.0% |
| sdk_type | 50 | 75.76% |

### system (13 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 13 | 100.0% |

### module (30 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 30 | 100.0% |
| type | 30 | 100.0% |

### infraProvider (1 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 1 | 100.0% |

### method (200 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| class | 200 | 100.0% |
| description | 200 | 100.0% |
| language | 200 | 100.0% |

### resource (31 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 31 | 100.0% |
| technology | 31 | 100.0% |
| type | 31 | 100.0% |

### file (600 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 600 | 100.0% |
| language | 600 | 100.0% |
| type | 600 | 100.0% |

### tool (34 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 34 | 100.0% |
| purpose | 34 | 100.0% |

### component (16 entities)

| Property | Count | Coverage |
|----------|-------|----------|
| description | 16 | 100.0% |
| language | 16 | 100.0% |
| type | 16 | 100.0% |
| x_end | 16 | 100.0% |


## Relation Patterns

### secures Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| tool | component | 5 |

### maintains Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| user | artifact | 40 |

### uses Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| component | tool | 3 |

### monitors Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| tool | component | 22 |

### creates Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| tool | artifact | 66 |

### part_of Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| module | system | 30 |

### tracks_errors Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| tool | component | 2 |

### provided_by Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| environment | infraProvider | 3 |

### deployed_to Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| artifact | resource | 113 |

### deployed_in Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| artifact | environment | 137 |

### packaged_as Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| component | artifact | 9 |

### defined_in Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| method | class | 200 |

### belongs_to Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| system | domain | 22 |

### owns Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| group | component | 16 |
| group | system | 13 |

### controls Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| flag | artifact | 43 |

### consumes Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| component | module | 7 |

### depends_on Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| component | component | 29 |

### contains Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| system | component | 18 |
| domain | system | 11 |

### member_of Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| user | group | 3 |

### exposes Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| component | module | 15 |

### manages Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| tool | resource | 6 |

### tests Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| tool | component | 5 |

### used_by Relations

| Source Type | Target Type | Count |
|-------------|-------------|-------|
| tool | component | 10 |
