# H.C. Mark 2

Current status: backend-only search service, responding to POSTs on `/howard` route.

Post a form-urlencoded body, receive JSON response. Shape of the body must be:

```javascript
{
  "argument": "text or number, depending on type",
  "type": 'a number (or string representation of number) between 1 and 5'
}
```

At the command line, this should work: `curl -d "kind=3&argument=3" -X POST example.com/howard`

## Type 1: Get a particular episode. Use as follows

```javascript
{
  "argument": "55",
  "type": 1
}
```

returns

```JSON
{
    "response": {
        "title": "The Pickles Never Touch",
        "episode": 55
    }
}
```

## Type 2: Get a random episode

```javascript
{
  "argument": "this is ignored, but must be included.",
  "type": 2
}
```

returns, e.g.,

```JSON
{
    "response": {
        "title": "A Goat in the Pipe",
        "topic": "Disruptions in Service",
        "episode": 274
    }
}
```

## Type 3: Get some number of random quotes

```javascript
{
  "argument": 3,
  "type": 2
}
```

returns, e.g.,

```javascript
{
    "response": [
        {
            "text": "SE or SE/30?"
        },
        {
            "text": "Is this the show?"
        },
        {
            "text": "ALEXA, STOP!"
        }
    ]
}
```

## Type 4: Search quotes

```javascript
{
  "argument": "America",
  "type": 4
}
```

returns

```javascript
{
    "response": [
        {
            "text": "It would be like America, if there were sheep and everyone tried."
        },
        {
            "text": "It's okay to be weird. This is America. The nerds have won."
        }
    ]
}
```

## Type 5: Returns something markov-like

```javascript
{
  "argument": "apple",
  "type": 5
}
```

returns, e.g.,

```javascript
{
    "response": {
        "text": "apple head everything."
    }
}
```
