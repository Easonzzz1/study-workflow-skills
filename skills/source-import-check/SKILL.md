---
name: source-import-check
description: Add user-authorized material to an existing knowledge notebook and verify readable parsed content while avoiding duplicate imports. Use for source ingestion and import audits, not for generating study notes.
---

# Verify source imports

Identify the requested destination and source set. Reuse an existing notebook unless the user asks for a new one. Inspect its sources before importing; compare titles, versions, and available identifiers. A matching filename alone does not establish identical content. If identity remains uncertain, report the possible duplicate rather than creating another copy automatically.

For each authorized new source, track separately: submitted, processing, readable, failed, or unverified. Open the parsed source and confirm a recognizable heading plus substantive body text. A source-count increase or an upload-complete badge establishes presence, not successful parsing. For recordings, confirm usable transcript content and course/topic mapping before treating them as learning sources.

Preserve local originals and existing sources. Do not replace or delete them as cleanup. When a destination is inaccessible, record the actual blocker and continue with independent sources only if their destinations are known. Do not repeatedly submit the same blocked upload.

Return a per-source report with destination, duplicate decision, observed parsing evidence, status, and remaining action. Keep excerpts minimal and local; source text or identifiers may be private. Claim completion only for the requested sources whose readable content was inspected.
