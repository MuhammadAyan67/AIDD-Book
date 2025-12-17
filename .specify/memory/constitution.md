<!--
  Version change: 1.1.0 → 1.1.1
  List of modified sections: Success Criteria (Deployment criterion removed).
  Added sections: None.
  Removed sections: None.
  Templates requiring updates:
    - .specify/templates/plan-template.md: ⚠ pending
    - .specify/templates/spec-template.md: ⚠ pending
    - .specify/templates/tasks-template.md: ⚠ pending
    - .specify/templates/commands/*.md: ⚠ pending
    - README.md: ⚠ pending
    - docs/quickstart.md: ⚠ pending
  Follow-up TODOs:
    - RATIFICATION_DATE: TODO: find original adoption date in .specify/memory/constitution.md
-->

<!--
  This is the project's foundational Constitution, outlining core principles,
  governance, and architectural mandates.

  It is a living document, subject to amendment. All changes MUST follow the
  amendment process defined herein.
-->

# Project Constitution: AI-Native Book on Physical AI & Humanoid Robotics with RAG Chatbot

## 1. Principles

### 1.1. Technical Accuracy
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
All content must be technically accurate and verifiable from primary sources.

### 1.2. Clarity for AI/Robotics Students
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
Content should be clear and accessible for AI/Robotics students.

### 1.3. Reproducibility of Code and Workflows
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
Code and workflows presented must be reproducible.

### 1.4. Spec-driven, AI-native Authoring
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
Authoring process must be spec-driven and AI-native.

### 1.5. Traceability of Claims
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
All claims must be traceable to official documentation or peer-reviewed papers.

### 1.6. Source Priority
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
Source priority must adhere to: official docs > papers > technical blogs.

### 1.7. Code Correctness
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
Code provided must be correct; pseudocode clearly labeled.

### 1.8. Engineering-Focused Explanations
<!-- Mandate: Non-negotiable rule. MUST be followed. -->
Explanations should be step-by-step and engineering-focused.

---

## 2. Governance

### 2.1. Versioning
This Constitution uses semantic versioning (MAJOR.MINOR.PATCH).
- **MAJOR** version increments: Backward-incompatible changes, removal of principles, or fundamental shifts in architectural mandates.
- **MINOR** version increments: Addition of new principles, significant expansion of existing guidance, or changes to governance processes.
- **PATCH** version increments: Clarifications, wording improvements, typo corrections, or non-semantic refinements.

### 2.2. Amendment Process
Amendments MUST be proposed as pull requests, reviewed by Project maintainers, Lead Developers, and require approval from Majority of Core Development Team. Each amendment MUST include a clear rationale and an updated `LAST_AMENDED_DATE`.

### 2.3. Compliance
All project participants and contributions MUST adhere to the principles and mandates set forth in this Constitution. Regular audits and reviews will be conducted to ensure compliance. Non-compliance will be addressed by Disciplinary action as determined by project leads.

---

## 3. Constraints

### 3.1. Platform
The primary platform for the book is Docusaurus, deployed to GitHub Pages.

### 3.2. Tools
The project utilizes Spec-Kit Plus and Claude Code for development and authoring.

### 3.3. Embedded RAG Chatbot
The RAG chatbot component will be built using OpenAI Agents/ChatKit and FastAPI, with Qdrant Cloud for vector storage and Neon Postgres for data. Its answers must be strictly derived from the book's content.

### 3.4. Required Coverage
The book must cover topics including ROS 2, Gazebo/Unity, NVIDIA Isaac, Nav2, VLA, and Whisper voice-to-action.

### 3.5. Data Integrity
No fabricated APIs or benchmarks are permitted within the content.

---

## 4. Success Criteria

### 4.1. Module Completion and Validity
All modules within the book must be complete and technically valid.

### 4.2. RAG Chatbot Accuracy
The embedded RAG chatbot must accurately answer questions based solely on the book's content.

### 4.3. Capstone Enablement
The book's content must enable the final capstone project: building an autonomous humanoid robot.

---

## Document Details

- **RATIFICATION_DATE**: TODO: find original adoption date
- **LAST_AMENDED_DATE**: 2025-12-15
- **CONSTITUTION_VERSION**: 1.1.1
