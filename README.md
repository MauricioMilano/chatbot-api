# Chatbot API

## Try it

You can try chatbot [HERE](https://shorturl.at/hkoW1)

## Overview

This API is designed to interact with a chatbot. It currently supports one endpoint, `/webhook`, which allows for sending messages to the chatbot and receiving responses.

## Endpoint

### POST /webhook

This endpoint is used to send a message to the chatbot and receive a response.

#### Parameters

- `id`: A string that represents the unique identifier of the user.
- `text`: A string that represents the message from the user.

#### Example Request

```json
{
  "id": "user123",
  "text": "Hello, chatbot!"
}
```

### Response

The response will be a JSON object containing the chatbot’s reply.

#### Example Response

```json
[
  {
    "response.type": "text",
    "text": "Hello, user123! How can I assist you today?"
  },
  {
    "response.type": "options",
    "title": "You can choose one, or say something else",
    "options": [
      {
        "Label": "Option 1",
        "input": {
          "text": "Option 1 "
        }
      },
      {
        "Label": "Option 2",
        "input": {
          "text": "Option 2"
        }
      }
    ]
  }
]
```

Enjoy interacting with our chatbot!
