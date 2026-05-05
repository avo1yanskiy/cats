import os

TELEGRAM_BOT_TOKEN = os.environ["TELEGRAM_BOT_TOKEN"]
GITHUB_TOKEN = os.environ["TOKEN_BOT"]
GITHUB_REPO = os.environ["REPO_BOT"]
STORIES_FILE = "frontend/src/data/stories.ts"
IMAGES_DIR = "assets/images"

print(f"Bot config loaded:")
print(f"  GITHUB_REPO: {GITHUB_REPO}")
print(f"  STORIES_FILE: {STORIES_FILE}")