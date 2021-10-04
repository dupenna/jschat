# jschat

A simple chat bot with decision tree and user input that you can add to any website.

## Implementation

Add this before the `</body>` of your html.
```html
<script>
  var jschat = {}
</script>
<script src="https://dupenna.github.io/jschat/jschat.js"></script>
```

The `jschat` should have this attributes:
```javascript
var jschat = {
  path: 'https://dupenna.github.io/jschat/',
  bot_name: 'My Bot Name',
  bot_avatar: 'https://i.pravatar.cc/100',
  colors: {
    primary: '#900',
    secondary: '#FFF',
    text: '#FFF',
  },
  triggers: '#open_chat',
  script: script,
  start_script: 'welcome',
  values: {
    'company_name': 'JSChat',
  },
}
```

| Attribute | Description |
| --- | --- |
| `path` | Required. Path to jschat repository. |
| `bot_name` | Required. Name of your bot. |
| `bot_avatar` | Required. URL to the bot avatar. |
| `colors` | Required. Object for the main colors. |
| `triggers` | Required. Selector to objects that should open the chat. |
| `script` | Required. JSON with the script. |
| `start_script` | Required. Name of the first script message. |
| `values` | Optional. Any values that you wanna use in the script. |

## Building the Script

Now that you imported the main code and set the initial options, you must build an array of objects with your script. Each main object represents one message.

So far, you can provide 3 types of messages:
* Simple text
* Multiple choice
* User input

You can either define as a variable (preferred):
```javascript
const script = [{
  name: 'welcome',
  value: 'Welcome to the bot :)',
  delay_before: 1500,
  goto: 'next-step'
}];
```

 or write it directly on the jschat object
```javascript
var jschat = {
  // (...)
  script: [{
    name: 'welcome',
    value: 'Welcome to the bot :)',
    delay_before: 1500,
    goto: 'next-step'
  }]
  // (...)
};
```

### Simple text message

This example will render a simple message with the text "Welcome to the bot :)"

```json
{
  "name": "welcome",
  "value": "Welcome to the bot :)",
  "delay_before": 1500,
  "goto": "next-step"
}
```

| Attribute | Description |
| --- | --- |
| `name` | Required. String to refer this message when link to the and of another one. |
| `value` | Required. The actual text of the message. |
| `delay_before` | Optional (default: 0). The time in ms to wait before showing the message. |
| `goto` | Required. The name of the next message object to go |

### Multiple choice message

This example will render a simple message with the text "How old are you?" and 2 badges under with "under 18" and "over 18" texts.

```json
{
  "name": "user-age-range",
  "value": "How old are you?",
  "delay_before": 1500,
  "goto": null,
  "params": {
    "options": [{
      "name": "age-range",
      "label": "under 18",
      "text": "I'm under 18",
      "goto": "exit"
    },
    {
      "name": "age-range",
      "label": "over 18",
      "text": "I'm over 18",
      "goto": "next-step"
    }]
  }
}
```

In this case, the main `goto` attribute should be `null` because each option will have there on.

| Attribute | Description |
| --- | --- |
| `name` | Required. The name of the variable storaged with the user choice. |
| `label` | Required. The text of the badge and the value storage. |
| `text` | Required. The text that will render as a user message. |
| `goto` | Required. The name of the next message object to go if this option were selected. |

### User input message

This example will render a simple message with the text "What is your name?" and unlock the input on the footer so user can type and submit.

```json
{
  "name": "user-name",
  "value": "What is your name?",
  "delay_before": 1500,
  "goto": null,
  "params": {
    "input": {
      "name": "name",
      "placeholder": "Type your name...",
      "goto": "next-step"
    }
  }
}
```

Same as in multiple choice, the main `goto` attribute should be `null` and must be provided on the input object.

| Attribute | Description |
| --- | --- |
| `name` | Required. The name of the variable storaged with the user input. |
| `placeholder` | Optional. The placeholder of the input element. |
| `text` | Required. The text that will render as a user message. |
| `goto` | Required. The name of the next message object to go when the user submits the response. |

## Using variables

The responses from both **multiple choice messages** and **user input messages** can be used in the `value` of any message using the `name` attribute informed.

```json
{
  "name": "user-name",
  "value": "What is your name?",
  "delay_before": 1500,
  "goto": null,
  "params": {
    "input": {
      "name": "name",
      "placeholder": "Type your name...",
      "goto": "next-step"
    }
  }
},
{
  "name": "next-step",
  "value": "Hi, ${user-name}!",
  "delay_before": 1500,
  "goto": "another-step"
}
```

## ToDo

* `OK` restart chat
* `OK` input types (numbers, dates...)
* `OK` input validations (min and max)
* `OK` input validations (regex)
* url redirect on goto
* callback function on goto
* remove jquery dependency
* visual script builder tool

## Bugs (so far)

* `OK?` injected jquery conflict with previous version
* `OK` weird horizontal scroll in some browsers