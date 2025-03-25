# Appointment Scheduling API

## Running the Server

```bash
pnpm dev
```

The server will start on port 4000 (or the port specified in your .env file).

## API Endpoints

### 1. Create Appointment

```http
POST /appointments
```

Request Body:

```json
{
  "appointmentDateTime": "2025-01-01T14:00:00Z",
  "timeZone": "America/New_York",
  "appointmentDuration": 30,
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "email": "john.doe@example.com"
  },
  "location": {
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "zipCode": "12345",
    "state": "NY",
    "city": "New York"
  },
  "vehicle": {
    "vin": "1234567890"
  }
}
```

Success Response (201):

```json
{
  "success": true,
  "id": "generated-uuid"
}
```

Example Error Response (400):

```json
{
  "success": false,
  "errors": [
    {
      "path": "appointmentDateTime",
      "message": "Invalid datetime"
    }
  ]
}
```

### 2. Get All Appointments

```http
GET /appointments
```

Success Response (200):

```json
{
  "success": true,
  "appointments": [
    {
      "id": "uuid",
      "appointmentDateTime": "2025-01-01T14:00:00Z",
      "timeZone": "America/New_York",
      "appointmentDuration": 30,
      "customer": {
        "firstName": "John",
        "lastName": "Doe",
        "phone": "1234567890",
        "email": "john.doe@example.com"
      },
      "location": {
        "line1": "123 Main St",
        "line2": "Apt 4B",
        "zipCode": "12345",
        "state": "NY",
        "city": "New York"
      },
      "vehicle": {
        "vin": "1234567890"
      }
    }
  ]
}
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Business Rules

1. Appointments can only be scheduled during business hours (9 AM - 5 PM local time)
2. Appointments cannot overlap with existing appointments
3. All customer information is required
4. Location must include at least line1, zipCode, state, and city
5. Vehicle VIN is required
6. Timezone must be a valid IANA or POSIX timezone identifier

## Error Handling

The API returns appropriate HTTP status codes:

- 201: Appointment created successfully
- 400: Invalid request data
- 500: Server error

Error responses include detailed messages about what went wrong, including validation errors.
