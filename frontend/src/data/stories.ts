export interface Story {
  id: string;
  title: string;
  date: string;
  content: string;
  catId: string;
  image?: string;
}

export const stories: Story[] = [
  {
    "id": "story-1a3e7a30",
    "title": "О топ мои",
    "date": "2026-05-05",
    "content": "Послали",
    "catId": "both"
  }
];