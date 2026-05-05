import base64
import json
import uuid

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
        print(f"Save response: {response.status_code}")
        return response.status_code in (200, 201)
    except Exception as e:
        print(f"Error updating file: {e}")
        return False


def add_story(title: str, content: str, cat_id: str, date: str = None, image: str = None) -> bool:
    """Add new story to TS file"""
    print(f"=== ADD STORY: {title} ===")
    
    current = get_file_content(STORIES_FILE)
    if not current:
        print("No file found")
        return False
    
    # Create TS-formatted object
    new_story = f'''  {{
    id: "story-{uuid.uuid4().hex[:8]}",
    title: "{title}",
    date: "{date or "2024-01-01"}",
    content: "{content}",
    catId: "{cat_id}",
  }}'''
    
    print(f"New story: {new_story}")
    
    # Add new story to TS file
    current = current.rstrip()
    
    # Remove ]; from end
    if current.endswith("];"):
        current = current[:-2]
    
    # Ensure comma after last story (before adding new one)
    current = current.rstrip()
    if not current.endswith(","):
        current += ","
    
    # Add new story and close array
    new_content = current + "\n  " + new_story + "\n];"
    
    print(f"New content: {new_content[-200:]}")
    
    return update_file(STORIES_FILE, new_content, f"Add story: {title}")


def load_stories() -> list:
    """Load stories - for compatibility"""
    content = get_file_content(STORIES_FILE)
    if not content:
        return []
    
    # Extract array
    start = content.find("[")
    end = content.rfind("]")
    if start != -1 and end != -1:
        try:
            return json.loads(content[start:end+1])
        except Exception as e:
            print(f"Parse error: {e}")
    return []


def save_stories(stories: list, message: str) -> bool:
    """Save stories - full rewrite"""
    content = """export interface Story {
  id: string;
  title: string;
  date: string;
  content: string;
  catId: string;
  image?: string;
}

export const stories: Story[] = """ + json.dumps(stories, ensure_ascii=False, indent=2) + ";"
    
    return update_file(STORIES_FILE, content, message)


def upload_image(image_data: bytes, filename: str) -> str | None:
    """Upload image to GitHub"""
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