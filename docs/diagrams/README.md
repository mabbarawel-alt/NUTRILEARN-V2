# NutriLearn — revised paper diagrams

Mermaid sources for the diagrams in *The Analysis and Design of NutriLearn* (Nexora), revised to match the system as built. Boxes drawn red and dashed, or labelled `NEW`, were missing from the paper; `Phase 2` marks planned work that is not built yet.

| Figure | File | Main change |
|---|---|---|
| 3.1 Use Case | `3.1-use-case.mmd` | Added growth tracker, announcements, follow-up, report endorsement and data-correction use cases |
| 3.3.1 Context DFD | `3.3.1-dfd-context.mmd` | Added announcement and correction-request flows |
| 3.3.2 Level-1 DFD | `3.3.2-dfd-level1.mmd` | Added 7.0 Announcement Management and D7 |
| 3.4 ERD | `3.4-erd.mmd` | MEAL_TEMPLATE in Level 1; new FOLLOW_UP, ANNOUNCEMENT, MONTHLY_REPORT, CORRECTION_REQUEST, AUDIT_LOG; string IDs |
| 3.5 Class | `3.5-class.mmd` | Methods added; new classes for the new entities and the sync queue |
| 4.1 Architecture | `4.1-architecture.mmd` | FastAPI back end (not Spring Boot), offline storage and sync outbox |
| 4.3 Request flow | `4.3-request-flow.mmd` | Offline path; JWT check marked Phase 2 |
| 5.1.1–5.1.3 Interaction flows | `5.1.*.mmd` | Reports screens built; meal guide, follow-up, reset password, archive |

The 3.2 activity diagrams need no change: the system was updated to follow them.

**Using a diagram in the paper**

- draw.io: *Arrange → Insert → Advanced → Mermaid*, paste the file contents (the result stays editable).
- Image: paste the file contents into https://mermaid.live and export PNG or SVG.

The ERD matches `supabase_schema.sql` in the repository root.
