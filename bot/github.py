import base64
import json
import uuid
from pathlib import Path

import httpx
from config import GITHUB_REPO, GITHUB_TOKEN, IMAGES_DIR, STORIES_FILE

API_URL = f"https://api.github.com/repos/{GITHUB_REPO}"

def get_headers():
    return {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json",
    }


def get_file_content(path: str) -> str | None:
    """Get file content from GitHub"""
    url = f"{API_URL}/contents/{path}"
    try:
        response = httpx.get(url, headers=get_headers(), timeout=10)
        if response.status_code == 200:
            data = response.json()
            return base64.b64decode(data["content"]).decode("utf-8")
    except Exception as e:
        print(f"Error getting file: {e}")
    return None


def update_file(path: str, content: str, message: str) -> bool:
    """Update or create file in GitHub"""
    url = f"{API_URL}/contents/{path}"
    
    # Get current SHA if file exists
    sha = None
    try:
        response = httpx.get(url, headers=get_headers(), timeout=10)
        if response.status_code == 200:
            sha = response.json()["sha"]
    except Exception as e:
        print(f"Error getting SHA: {e}")
        pass
    
    # Encode content
    encoded = base64.b64encode(content.encode("utf-8")).decode("utf-8")
    
    data = {
        "message": message,
        "content": encoded,
    }
    if sha:
        data["sha"] = sha
    
    try:
        response = httpx.put(url, headers=get_headers(), json=data, timeout=10)
        print(f"Save stories response: {response.status_code} - {response.text}")
        return response.status_code in (200, 201)
    except Exception as e:
        print(f"Error updating file: {e}")
        return False


def load_stories() -> list:
    """Load stories from JSON file"""
    content = get_file_content(STORIES_FILE)
    if content:
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            pass
    return []


def save_stories(stories: list, message: str = "Add new story") -> bool:
    """Save stories to JSON file"""
    content = json.dumps(stories, ensure_ascii=False, indent=2)
    return update_file(STORIES_FILE, content, message)


def upload_image(image_data: bytes, filename: str) -> str | None:
    """Upload image to GitHub and return raw URL"""
    # Generate unique filename
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "jpg"
    unique_name = f"{uuid.uuid4().hex}.{ext}"
    path = f"{IMAGES_DIR}/{unique_name}"
    
    url = f"{API_URL}/contents/{path}"
    encoded = base64.b64encode(image_data).decode("utf-8")
    
    data = {
        "message": f"Add image: {unique_name}",
        "content": encoded,
    }
    
    try:
        response = httpx.put(url, headers=get_headers(), json=data, timeout=30)
        print(f"Upload image response: {response.status_code} - {response.text}")
        if response.status_code in (200, 201):
            return response.json()["content"]["download_url"]
    except Exception as e:
        print(f"Error uploading image: {e}")
    return None


def get_raw_asset_url(path: str) -> str:
    """Get raw URL for asset"""
    return f"https://raw.githubusercontent.com/{GITHUB_REPO}/main/{path}"