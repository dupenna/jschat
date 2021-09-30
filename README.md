# jschat
A simple chat bot with decision tree and user input that you can add to any website.

## Implementation
Add this before the ```</body>``` of your html.
```html
<script>
  var jschat = {}
</script>
<script src="https://dupenna.github.io/jschat/jschat.js"></script>
```

The ```jschat``` should have this attributes:
```javascript
var jschat = {
  path: 'https://dupenna.github.io/jschat/', // path to jschat repository
  bot_name: 'My Bot Name', // name of your bot
  bot_avatar: 'https://i.pravatar.cc/100', // url to the bot avatar
  colors: {
    primary: '#900', // background of header, footer and options badges
    secondary: '#FFF', // background of the chat body
    text: '#FFF', // text color applied where the primary color is used
  },
  triggers: '#open_chat', // selector to objects that should open the chat
  script: script, // json of the script
  start_script: 'welcome', // name of the first script message
  values: { // any values that you wanna use in the script
    'company_name': 'JSChat',
  },
}
```
## Building the Script

Now that you imported the main code and set the initial options, you must build an array of objects with your script. Each main object represents a message.

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

 or write it on the jschat object
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

```json
{
  "name": "welcome",
  "value": "Welcome to the bot :)",
  "delay_before": 1500,
  "goto": "next-step"
}
```
This example will render a simple message with the text "Welcome to the bot :)"

The message attributes are:
* ```name``` is a string to refer this message when link to the and of another one
* ```value``` is the actual text of the message
* ```delay_before``` is the time in ms to wait before showing the message (default: 0)
* ```goto``` is the name of the next message object to go

### Multiple choice message

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
This example will render a simple message with the text "How old are you?" and 2 badges under with "under 18" and "over 18" texts.

In this case, the main ```goto``` attribute should be ```null``` because each option will have there on.

The options attributes are:
* ```name``` is the name of the variable storaged with the user choice
* ```label``` is the text of the badge and the value storage
* ```text``` is the text that will render as a user message
* ```goto``` is the name of the next message object to go if this option were selected

### User input message

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
This example will render a simple message with the text "What is your name?" and unlock the input on the footer so user can type and submit.

Same as in multiple choice, the main ```goto``` attribute should be ```null``` and must be provided on the input object.

The input attributes are:
* ```name``` is the name of the variable storaged with the user input
* ```placeholder``` is the placeholder of the input element
* ```text``` is the text that will render as a user message
* ```goto``` is the name of the next message object to go when the user submit the response

## Using variables
The responses from both **multiple choice messages** and **user input messages** can be used in the of any message using the ```name``` attribute informed.

```json
{
  "name": "user-email",
  "value": "Hi, ${name}!",
  "delay_before": 1500,
  "goto": "next-step"
}
```

## ToDo
* [OK] restart chat
* input validations (regex)
* input types (numbers, dates...)
* callback function on goto
* url redirect on goto
* remove jquery dependency
* visual script builder tool

## Bugs (so far)
* [OK?] injected jquery conflict with previous version
* weird horizontal scroll in some browsers