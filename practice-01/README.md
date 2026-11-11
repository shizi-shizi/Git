# Practice 01: Pi Agent Setup and Use

Student: yuanshiwen  
Date: 2026-11-11

## Work completed

- Installed and launched Pi Agent 1.5.2 in the local pi-test project.
- Configured the DeepSeek provider and completed conversations with deepseek-flash:low and deepseek-v4-pro:high.
- Ran hello.py; it printed 5. Asked Pi to explain the referenced file.
- Created paste-image-test.png (200 x 200) and asked Pi to identify its contents.
- Installed the pi-web-access package and confirmed that it loaded. The package's web search tool returned official Pi documentation. A separate page-fetch test was blocked by the configured SSRF protection, so that fetch path was not verified.
- Downloaded the complete pptx skill from anthropics/skills, preserving SKILL.md, LICENSE.txt, and scripts. Source commit: 2c5958ecac7cee2b583967a2c4981d0f4a75c579. Pi discovered the project skill and answered a /skill:pptx invocation.

## Evidence files

- files/hello.py: code used for the file-reference task.
- files/paste-image-test.png: small image used for the image-input task.
- pptx/: downloaded skill source and supporting files.

## Screenshot status

The requested real Pi UI screenshots (S1-S8) are not included. Pi's terminal window was not exposed to the available desktop capture interface during this run, so no terminal screenshots could be captured. This report records command-line and file-based checks; it does not represent them as screenshots. The screenshot evidence requirement remains incomplete.
