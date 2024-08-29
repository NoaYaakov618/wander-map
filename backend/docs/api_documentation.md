# API Documentation

## Base URL

`http://localhost:5000/api`

## Endpoints

### 1. GET /journeys

- **Description:** Retrieve all journeys.
- **Response:**
  - **200 OK:** A list of all journeys.
  - **Sample Response:**
    ```json
    [
      {
        "id": 1,
        "title": "Trip to Paris",
        "description": "A wonderful trip to Paris...",
        "location": "Paris, France",
        "created_at": "2024-08-20T10:00:00",
        "user_id": 1
      },
      ...
    ]
    ```

### 2. POST /journeys

- **Description:** Create a new journey.
- **Request Body:**
  - **Sample Request:**
    ```json
    {
      "title": "Hiking Adventure",
      "description": "A thrilling hike in the mountains...",
      "location": "Rocky Mountains, USA",
      "user_id": 2
    }
    ```
- **Response:**
  - **201 Created:** The newly created journey.
  - **Sample Response:**
    ```json
    {
      "id": 2,
      "title": "Hiking Adventure",
      "description": "A thrilling hike in the mountains...",
      "location": "Rocky Mountains, USA",
      "created_at": "2024-08-20T10:15:00",
      "user_id": 2
    }
    ```

### 3. GET /journeys/{id}

- **Description:** Retrieve a single journey by ID.
- **Response:**
  - **200 OK:** The journey with the given ID.
  - **404 Not Found:** If the journey does not exist.
  - **Sample Response:**
    ```json
    {
      "id": 1,
      "title": "Trip to Paris",
      "description": "A wonderful trip to Paris...",
      "location": "Paris, France",
      "created_at": "2024-08-20T10:00:00",
      "user_id": 1
    }
    ```

### 4. PUT /journeys/{id}

- **Description:** Update an existing journey.
- **Request Body:**
  - **Sample Request:**
    ```json
    {
      "title": "Updated Title",
      "description": "Updated description...",
      "location": "New Location",
      "user_id": 1
    }
    ```
- **Response:**
  - **200 OK:** The updated journey.
  - **404 Not Found:** If the journey does not exist.

### 5. DELETE /journeys/{id}

- **Description:** Delete a journey by ID.
- **Response:**
  - **200 OK:** A message confirming deletion.
  - **404 Not Found:** If the journey does not exist.
