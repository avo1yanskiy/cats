import base64
import json
import uuid
from pathlib import Path
import re

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
    
    sha = None
    try:
        response = httpx.get(url, headers=get_headers(), timeout=10)
        if response.status_code == 200:
            sha = response.json()["sha"]
    except Exception as e:
        print(f"Error getting SHA: {e}")
    
    encoded = base64.b64encode(content.encode("utf-8")).decode("utf-8")
    
    data = {
        "message": message,
        "content": encoded,
    }
    if sha:
        data["sha"] = sha
    
    try:
        response = httpx.put(url, headers=get_headers(), json=data, timeout=10)
        print(f"Save response: {response.status_code} - {response.text[:200]}")
        return response.status_code in (200, 201)
    except Exception as e:
        print(f"Error updating file: {e}")
        return False


def load_stories() -> list:
    """Load stories from TS file"""
    content = get_file_content(STORIES_FILE)
    if not content:
        print("No file content received - creating empty list")
        return []
    
    print(f"File content length: {len(content)}")
    
    # Find the array by counting brackets
    start_idx = content.find("export const stories: Story[] =")
    if start_idx == -1:
        print("Could not find stories declaration")
        return []
    
    print(f"Found declaration at: {start_idx}")
    
    # Find the opening [
    arr_start = content.find("[", start_idx)
    if arr_start == -1:
        print("Could not find array opening [")
        return []
    
    print(f"Found [ at: {arr_start}")
    
    # Count brackets to find matching ]
    depth = 0
    arr_end = 0
    i = arr_start
    while i < len(content):
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
            if depth == 0:
                arr_end = i + 1
                break
        i += 1
    
    if arr_end == 0:
        print("Could not find array end")
        return []
    
    json_str = content[arr_start:arr_end]
    print(f"Extracted array length: {len(json_str)}")
    print(f"Extracted: {json_str[:200]}...")
    
    try:
        stories = json.loads(json_str)
        print(f"Parsed {len(stories)} stories")
        return stories
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return []


def save_stories(stories: list, message: str = "Add new story") -> bool:
    """Save stories to TS file"""
    ts_content = """export interface Story {
  id: string;
  title: string;
  date: string;
  content: string;
  catId: string;
  image?: string;
}

export const stories: Story[] = """ + json.dumps(stories, ensure_ascii=False, indent=2) + ";"
    
    print(f"Saving {len(stories)} stories to {STORIES_FILE}")
    print(f"Stories to save: {json.dumps(stories, ensure_ascii=False, indent=2)}")
    
    return update_file(STORIES_FILE, ts_content, message)


def add_story(title: str, content: str, cat_id: str, date: str = None, image: str = None) -> bool:
    """Add new story"""
    print(f"=== ADD STORY START ===")
    print(f"Title: {title}")
    
    stories = load_stories()
    print(f"After load_stories: {len(stories)} stories")
    
    story = {
        "id": f"story-{uuid.uuid4().hex[:8]}",
        "title": title,
        "date": date or "2024-01-01",
        "content": content,
        "catId": cat_id,
    }
    if image:
        story["image"] = image
    
    print(f"New story: {story}")
    
    stories.append(story)
    print(f"After append: {len(stories)} stories")
    
    result = save_stories(stories, f"Add story: {title}")
    print(f"Save result: {result}")
    print(f"=== ADD STORY END ===")
    
    return result


def upload_image(image_data: bytes, filename: str) -> str | None:
    """Upload image to GitHub and return raw URL"""
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
        if response.status_code in (200, 201):
            return response.json()["content"]["download_url"]
    except Exception as e:
        print(f"Error uploading image: {e}")
    return None


def get_raw_asset_url(path: str) -> str:
    """Get raw URL for asset"""
    return f"https://raw.githubusercontent.com/{GITHUB_REPO}/main/{path}"