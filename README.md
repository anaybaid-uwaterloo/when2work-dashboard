## Why I Built This

As a UWaterloo student working part-time, I got frustrated with When2Work's cluttered interface. Important information like my next shift was buried under navigation menus and notifications.

This extension solves that by:
- Putting critical info front and center
- Reducing clicks needed for common tasks
- Making the interface actually pleasant to use

**Tech Stack:** JavaScript, Chrome Extensions API, CSS3  
**Impact:** Used by [X] UW students (track via GitHub stars)

## What I Learned

- Chrome Extension Manifest V3 architecture
- Content script injection
- DOM manipulation and event handling
- Modern CSS (gradients, animations, glassmorphism)
- User-centered design principles

## Quick Commands Reference

# Daily workflow
git pull                           # Start of day
# ... make changes ...
git add extension/dashboard.js     # Stage specific files
git commit -m "Fix stat parsing"   # Commit with message
git push                           # Push to GitHub

# When you add new features
git add extension/
git commit -m "Add keyboard shortcut customization"
git push

# View your work
git log --oneline --graph
