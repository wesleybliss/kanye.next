# kanye.rest

## Endpoints

| Endpoint        | Method       | Description                 |
|-----------------|--------------|-----------------------------|
| `/init`         | `POST`       | *(INTERNAL)* Initializes & seeds the database |
| `/reset`        | `POST`       | *(INTERNAL)* Resets all quotes to unused      |
| `/stats`        | `GET`        | Gets stats (used & available counts)          |
| `/yeet`         | `GET`        | Gets a random quote & marks it as used        |
