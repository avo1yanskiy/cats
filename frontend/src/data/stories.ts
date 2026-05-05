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
    "id": "story-4a63a898",
    "title": "Видимо вот",
    "date": "2026-05-05",
    "content": "Решила",
    "catId": "gavrik"
  }
];