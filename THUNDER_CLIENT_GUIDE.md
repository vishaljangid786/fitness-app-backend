# How to Upload Images with Thunder Client

## Step-by-Step Guide

### 1. Create a New Request

- Open Thunder Client in VS Code
- Click "New Request" or use the `+` button
- Set the method to **POST**
- Enter the URL: `http://localhost:3000/api/exercises`

### 2. Set Headers

- Go to the **Headers** tab
- Thunder Client will automatically set `Content-Type: multipart/form-data` when you use form-data
- **You don't need to manually set Content-Type** - it will be set automatically

### 3. Set Body (Form-Data)

- Go to the **Body** tab
- Select **Form** (or **Form-Data**) option
- Add the following fields:

#### Required Fields:

| Key           | Type | Value                              | Description                                               |
| ------------- | ---- | ---------------------------------- | --------------------------------------------------------- |
| `name`        | Text | `Push-ups`                         | Exercise name                                             |
| `description` | Text | `A classic bodyweight exercise...` | Exercise description                                      |
| `category`    | Text | `Strength`                         | Category (Strength, Cardio, Flexibility, Balance, Sports) |
| `difficulty`  | Text | `Beginner`                         | Difficulty level (Beginner, Intermediate, Advanced)       |

#### Optional Fields:

| Key                 | Type     | Value                             | Description                        |
| ------------------- | -------- | --------------------------------- | ---------------------------------- |
| `image`             | **File** | [Select your image file]          | **This is the image upload field** |
| `muscleGroups`      | Text     | `Chest, Shoulders, Triceps, Core` | Comma-separated or JSON array      |
| `equipment`         | Text     | `None`                            | Comma-separated or JSON array      |
| `instructions`      | Text     | `Step 1, Step 2, Step 3`          | Comma-separated or JSON array      |
| `caloriesPerMinute` | Text     | `8`                               | Number as string                   |
| `videoUrl`          | Text     | `https://example.com/video`       | Optional video URL                 |

### 4. Upload the Image

- For the `image` field:
  - Click on the field type dropdown
  - Select **File** (not Text)
  - Click "Choose File" or the file picker button
  - Select your image file (jpg, png, gif, webp)
  - Maximum file size: 5MB

### 5. Example Request

**URL:** `POST http://localhost:3000/api/exercises`

**Body (Form-Data):**

```
name: Push-ups
description: A classic bodyweight exercise that targets the chest, shoulders, and triceps.
category: Strength
difficulty: Beginner
muscleGroups: Chest, Shoulders, Triceps, Core
equipment: None
instructions: Start in plank position, Lower body, Push back up, Keep core engaged
caloriesPerMinute: 8
image: [FILE - Select your image]
```

### 6. Alternative: Using JSON Arrays

If you prefer JSON format for arrays, you can use:

**muscleGroups:** `["Chest", "Shoulders", "Triceps", "Core"]`
**equipment:** `["None"]`
**instructions:** `["Start in plank position", "Lower body", "Push back up"]`

### 7. Send the Request

- Click the **Send** button
- You should receive a response with the created exercise including the Cloudinary image URL

## Example Response

```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Push-ups",
    "description": "A classic bodyweight exercise...",
    "category": "Strength",
    "difficulty": "Beginner",
    "muscleGroups": ["Chest", "Shoulders", "Triceps", "Core"],
    "equipment": ["None"],
    "instructions": ["Start in plank position", "Lower body", "Push back up"],
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/exercises/exercise-1234567890.jpg",
    "caloriesPerMinute": 8,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Updating an Exercise with Image

For **PUT** requests to update an exercise:

**URL:** `PUT http://localhost:3000/api/exercises/:id`

**Body (Form-Data):** Same as above, but include the `image` field only if you want to update/replace the image.

## Troubleshooting

1. **"Only image files are allowed"** - Make sure you selected a valid image file (jpg, png, gif, webp)
2. **"Image upload failed"** - Check your Cloudinary credentials in `.env` file
3. **"File too large"** - Image must be under 5MB
4. **"Content-Type error"** - Make sure you're using Form-Data, not JSON

## Cloudinary Setup

Make sure your `.env` file has:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
