# How to Plan Features - Quick Guide

## Overview
This guide provides a step-by-step process for planning new features in the Roblox Mapper project. Follow these steps to ensure consistent, well-documented features.

## Step 1: Feature Identification (30 minutes)

### 1.1 Define the Feature
- **Name**: Choose a clear, descriptive name
- **Purpose**: Write one sentence explaining why this feature is needed
- **Scope**: Define what is and isn't included

### 1.2 Assign Feature Number
- Check existing features in `001-Features/`
- Use next available F### number
- Create directory: `F###-FeatureName/`

## Step 2: Create Initial Documentation (1 hour)

### 2.1 Create F###-Summary.md
Include these sections:
- **Overview**: 2-3 paragraph description
- **Key Components**: Bullet list of major parts
- **Implementation Goals**: What success looks like
- **Technical Architecture**: High-level approach
- **User Experience**: How users will interact

### 2.2 Create F###-Questions.md
Start with questions to clarify scope:
- List 10 questions in priority order
- Group by: Critical, Important, Nice-to-Have
- Focus on unknowns and assumptions

## Step 3: Define Requirements (2 hours)

### 3.1 Create F###-Reqs.md
Structure requirements hierarchically:
```
## R###: High-Level Requirement Name

1. ⬛ R###.1: Specific requirement statement
   1. ⬛ R###.1.1: Sub-requirement detail
   2. ⬛ R###.1.2: Sub-requirement detail
```

### 3.2 Requirement Guidelines
- Make them **testable** and **measurable**
- Use "The system shall..." format
- Include acceptance criteria
- Aim for 4-6 major requirements
- Each with 3-5 sub-requirements

## Step 4: Break Down Tasks (2 hours)

### 4.1 Create F###-Tasks.md
Map tasks to requirements:
```
## T###: Task Group Name (R###)

1. ⬛ T###.1: Major task description
   1. ⬛ T###.1.1: Subtask (1-4 hours)
   2. ⬛ T###.1.2: Subtask (1-4 hours)
```

### 4.2 Task Guidelines
- Each task should be 1-4 hours of work
- Include specific deliverables
- Note dependencies between tasks
- Add [PLACEHOLDER] for unclear tasks

## Step 5: Review and Refine (30 minutes)

### 5.1 Completeness Check
- [ ] All requirements have tasks
- [ ] All tasks link to requirements  
- [ ] Questions cover major unknowns
- [ ] Summary provides clear overview

### 5.2 Estimation
- Count total subtasks
- Multiply by average task duration (2.5 hours)
- Add 20% buffer for unknowns
- Document in summary

## Step 6: Get Feedback (Ongoing)

### 6.1 Share for Review
- Post feature plan for team review
- Highlight critical questions
- Request feedback on scope/approach

### 6.2 Iterate
- Update based on feedback
- Mark questions as answered
- Refine requirements and tasks
- Keep documents current

## Quick Planning Checklist

**Before Starting:**
- [ ] Clear problem statement
- [ ] Stakeholder alignment
- [ ] Feature number assigned

**Documentation:**
- [ ] F###-Summary.md created
- [ ] F###-Reqs.md with R### numbers
- [ ] F###-Tasks.md with T### numbers  
- [ ] F###-Questions.md with priorities

**Quality Checks:**
- [ ] Requirements are testable
- [ ] Tasks are appropriately sized
- [ ] Dependencies identified
- [ ] Effort estimated

**Ready for Development:**
- [ ] Questions answered/documented
- [ ] Requirements approved
- [ ] Tasks assigned/prioritized
- [ ] Success criteria clear

## Common Pitfalls to Avoid

1. **Too Vague**: "Improve performance" → "Reduce load time to <2s"
2. **Too Large**: 40-hour tasks → Break into 4-hour chunks
3. **Missing Context**: Document assumptions and constraints
4. **No Success Criteria**: Define how to verify completion
5. **Skipping Questions**: Unknown unknowns cause delays

## Example Timeline

- **Small Feature** (1-3 days work): 2-3 hours planning
- **Medium Feature** (1-2 weeks): 4-6 hours planning  
- **Large Feature** (2-4 weeks): 1-2 days planning
- **Epic Feature** (>1 month): 2-3 days planning, iterative

Remember: Good planning reduces development time and rework!