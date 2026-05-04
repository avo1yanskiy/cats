import asyncio
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

import httpx
from aiogram import Bot, Dispatcher, Router, types
from aiogram.enums import MessageEntityType
from aiogram.filters import Command, CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import BufferedInputFile, Message

from config import GITHUB_REPO, TELEGRAM_BOT_TOKEN
from github import (
    get_raw_asset_url,
    load_stories,
    save_stories,
    upload_image,
)

# Create bot and dispatcher
bot = Bot(token=TELEGRAM_BOT_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)

router = Router()
dp.include_router(router)


# States for story creation
class StoryStates(StatesGroup):
    waiting_for_title = State()
    waiting_for_text = State()
    waiting_for_photos = State()
    waiting_for_cat = State()
    waiting_for_confirm = State()


# Storage for story data
class StoryData:
    def __init__(self):
        self.title: str = ""
        self.text: str = ""
        self.photos: list[str] = []
        self.cat_id: str = ""


story_data: dict[int, StoryData] = {}


# Inline keyboards
def get_cat_keyboard() -> types.InlineKeyboardMarkup:
    return types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(text="🐱 Катя", callback_data="cat:katya"),
                types.InlineKeyboardButton(text="🐱 Гаврик", callback_data="cat:gavrik"),
                types.InlineKeyboardButton(text="🐱 Оба", callback_data="cat:both"),
            ]
        ]
    )


def get_confirm_keyboard() -> types.InlineKeyboardMarkup:
    return types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(text="✅ Опубликовать", callback_data="confirm:yes"),
                types.InlineKeyboardButton(text="❌ Отмена", callback_data="confirm:no"),
            ]
        ]
    )


def get_photo_done_keyboard() -> types.InlineKeyboardMarkup:
    return types.InlineKeyboardMarkup(
        inline_keyboard=[
            [
                types.InlineKeyboardButton(text="✅ Готово", callback_data="photo:done"),
            ]
        ]
    )


@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        "Привет! 🐱\n\nЯ бот историй Кати и Гаврика.\n\n"
        "Команды:\n"
        "/newstory - Создать новую историю\n"
        "/cancel - Отменить создание\n"
        "/help - Помощь",
        reply_markup=types.InlineKeyboardMarkup(
            inline_keyboard=[
                [types.InlineKeyboardButton(text="📝 Новая история", callback_data="newstory")]
            ]
        ),
    )


@router.message(Command("help"))
async def cmd_help(message: Message):
    await message.answer(
        "📖 Создание истории:\n\n"
        "1. /newstory - начать\n"
        "2. Напиши название истории\n"
        "3. Напиши текст истории\n"
        "4. Отправь фото (необязательно)\n"
        "5. Выбери кота\n"
        "6. Подтверди публикацию\n\n"
        "История будет добавлена на сайт!"
    )


@router.message(Command("cancel"))
async def cmd_cancel(message: Message, state: FSMContext):
    user_id = message.from_user.id
    if user_id in story_data:
        del story_data[user_id]
    await state.clear()
    await message.answer("❌ Отменено")


@router.callback_query()
async def handle_callback(callback: types.CallbackQuery, state: FSMContext):
    await callback.answer()
    user_id = callback.from_user.id
    data = callback.data
    
    if data == "newstory":
        await start_story(callback.message, state, user_id)
    elif data.startswith("cat:"):
        await select_cat(callback.message, state, user_id, data.split(":")[1])
    elif data.startswith("confirm:"):
        await confirm_story(callback.message, state, user_id, data.split(":")[1])
    elif data == "photo:done":
        await finish_photos(callback.message, state, user_id)


@router.message(Command("newstory"))
async def cmd_newstory(message: Message, state: FSMContext):
    await start_story(message, state, message.from_user.id)


async def start_story(message: Message, state: FSMContext, user_id: int):
    story_data[user_id] = StoryData()
    await state.set_state(StoryStates.waiting_for_title)
    await message.answer(
        "📝 Создание новой истории\n\n"
        "Напиши название истории:",
    )


@router.message(StoryStates.waiting_for_title)
async def process_title(message: Message, state: FSMContext):
    user_id = message.from_user.id
    if user_id not in story_data:
        return
    
    title = message.text.strip()
    story_data[user_id].title = title
    
    await state.set_state(StoryStates.waiting_for_text)
    await message.answer(
        f"✅ Название: {title}\n\n"
        "Теперь напиши текст истории:",
    )


@router.message(StoryStates.waiting_for_text)
async def process_text(message: Message, state: FSMContext):
    user_id = message.from_user.id
    if user_id not in story_data:
        return
    
    text = message.text.strip()
    story_data[user_id].text = text
    
    await state.set_state(StoryStates.waiting_for_photos)
    await message.answer(
        f"✅ Текст сохранён!\n\n"
        "Хочешь добавить фото?\n"
        "Отправь фото или нажми 'Готово' если без фото:",
        reply_markup=get_photo_done_keyboard(),
    )


@router.message(StoryStates.waiting_for_photos)
async def process_photo(message: Message, state: FSMContext):
    user_id = message.from_user.id
    if user_id not in story_data:
        return
    
    # Check for photos
    if not message.photo:
        return
    
    # Download photo
    photo = message.photo[-1]
    file = await bot.get_file(photo.file_id)
    
    try:
        content = await bot.download_file(file.file_path)
        image_data = content.read()
        
        # Generate filename
        filename = f"{uuid.uuid4().hex}.jpg"
        
        # Upload to GitHub
        url = upload_image(image_data, filename)
        if url:
            story_data[user_id].photos.append(url)
            await message.answer(f"✅ Фото добавлено ({len(story_data[user_id].photos)})")
    except Exception as e:
        await message.answer(f"❌ Ошибка загрузки: {e}")


async def finish_photos(message: Message, state: FSMContext, user_id: int):
    if user_id not in story_data:
        return
    
    await state.set_state(StoryStates.waiting_for_cat)
    await message.answer(
        "📸 Фото добавлены\n\n"
        "Выбери чья это история:",
        reply_markup=get_cat_keyboard(),
    )


async def select_cat(message: Message, state: FSMContext, user_id: int, cat_id: str):
    if user_id not in story_data:
        return
    
    story_data[user_id].cat_id = cat_id
    
    cat_name = {"katya": "Катя", "gavrik": "Гаврик", "both": "Катя и Гаврик"}[cat_id]
    
    story = story_data[user_id]
    text_preview = story.text[:100] + "..." if len(story.text) > 100 else story.text
    
    await state.set_state(StoryStates.waiting_for_confirm)
    await message.answer(
        f"📋 Проверь историю:\n\n"
        f"🏷 Название: {story.title}\n"
        f"🐱 Кот: {cat_name}\n"
        f"📄 Текст: {text_preview}\n"
        f"📸 Фото: {len(story.photos)} шт.\n\n"
        f"Опубликовать?",
        reply_markup=get_confirm_keyboard(),
    )


async def confirm_story(message: Message, state: FSMContext, user_id: int, confirm: str):
    if user_id not in story_data:
        return
    
    if confirm == "no":
        await message.answer("❌ Отменено")
        del story_data[user_id]
        await state.clear()
        return
    
    story = story_data[user_id]
    
    # Load existing stories
    stories = load_stories()
    
    # Create new story
    new_story = {
        "id": f"story-{uuid.uuid4().hex[:8]}",
        "catId": story.cat_id,
        "title": story.title,
        "text": story.text,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "images": story.photos if story.photos else None,
    }
    
    # Remove None values
    if new_story["images"] is None:
        del new_story["images"]
    
    # Add to stories (newest first)
    stories.insert(0, new_story)
    
    # Save
    success = save_stories(
        stories, 
        f"Add new story: {story.title}"
    )
    
    if success:
        await message.answer(
            f"✅ История опубликована!\n\n"
            f"🏷 {story.title}\n"
            f"🐱 Кот: {story.cat_id}\n"
            f"📸 Фото: {len(story.photos)} шт."
        )
    else:
        await message.answer(
            "❌ Ошибка сохранения на GitHub. Попробуй позже."
        )
    
    del story_data[user_id]
    await state.clear()


# Error handlers
@router.message()
async def handle_message(message: Message, state: FSMContext):
    current_state = await state.get_state()
    
    if current_state == StoryStates.waiting_for_title:
        await message.answer("Напиши название истории:")
    elif current_state == StoryStates.waiting_for_text:
        await message.answer("Напиши текст истории:")
    elif current_state == StoryStates.waiting_for_photos:
        await message.answer("Отправь фото или нажми 'Готово':")
    elif current_state == StoryStates.waiting_for_cat:
        await message.answer("Выбери кота:")
    elif current_state == StoryStates.waiting_for_confirm:
        await message.answer("Нажми кнопку:")
    else:
        await message.answer(
            "Используй команды:\n"
            "/newstory - Новая история\n"
            "/help - Помощь"
        )


async def main():
    """Start bot"""
    print("🐱 Bot starting...")
    dp.run polling(bot)


if __name__ == "__main__":
    asyncio.run(main())