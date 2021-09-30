function require(file, callback) {
  // create script element

  var script = document.createElement("script");
  script.src = file;

  // monitor script loading

  // IE < 7, does not support onload
  if (callback) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        // no need to be notified again
        script.onreadystatechange = null;
        // notify user
        callback();
      }
    };

    // other browsers
    script.onload = function () {
      callback();
    };
  }

  // append and execute script
  document.documentElement.firstChild.appendChild(script);
}

if (!jschat) var jschat = {};

jschat.path = jschat.path || 'https://dupenna.github.io/jschat/';

var css = document.createElement("link")
css.setAttribute("rel", "stylesheet")
// css.setAttribute("type", "text/css")
css.setAttribute("href", jschat.path+"jschat.css")
document.head.appendChild(css);

// require('https://code.jquery.com/jquery-3.6.0.min.js', () => {

  $.noConflict();
  jQuery(document).ready(function ($) {

    jschat.open = () => {
      $(jschat.main).addClass('open');
      $(jschat.main).removeClass('close');

      if (!jschat.started) {
        jschat.started = true;
        jschat.goto(jschat.start_script);
      }
    }

    jschat.sendMessage = (text, from, params = {}) => {
      const time = new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0');

      const message = $('<li>')
        .addClass(from)
        .append(
          $('<div>')
            .addClass('message')
            .append([
              $('<span>')
                .addClass('text')
                .text(text),
              $('<span>')
                .addClass('time')
                .text(time)
            ])
        )

      if (params.options) {
        const options = params.options;

        const list = $('<ul>')
          .addClass('options');

        options.forEach(option => {
          list.append($('<li>')
            .append($('<a>')
              .attr('href', 'javascript:void(0)')
              .text(option.label)
              .click((e) => {
                e.preventDefault();
                $(e.target).addClass('selected');
                $(e.target.parentNode.parentNode).addClass('selected');
                jschat.sendMessage(option.text, 'me');
                jschat.values[option.name] = option.label;
                jschat.goto(option.goto);
              })
            )
          )
        })

        message.append(list);
      }

      if (params.input) {
        const input = params.input;

        $(jschat.form).removeClass('disabled');
        $(jschat.input).attr('placeholder', input.placeholder);
        $(jschat.input).focus();

        jschat.form.addEventListener('submit', listener = (e) => {
          e.preventDefault();
          const text = jschat.input.value.trim();
          if (text.length > 0) {
            jschat.values[input.name] = text;
            jschat.sendMessage(text, 'me');
            $(jschat.form).addClass('disabled');
            $(jschat.input).attr('placeholder', '');
            $(jschat.input).blur();
            jschat.form.removeEventListener('submit', listener);
            e.target.reset();
            jschat.goto(input.goto);
            console.log(jschat.values);
          }
        })

      }

      $(jschat.chat).append(message);
    }

    jschat.goto = (step_name) => {
      const steps = script.filter(step => step.name == step_name);

      if (steps.length === 0) return;

      const current = steps[0];
      const next = current.goto;
      const delay = current.delay_before || 0;
      let text = current.value;

      if (matches = text.match(/\$\{[^}]*\}/g)) {
        matches.forEach(match => {
          value_name = match.replace(/[${}]/g, '');
          text = text.replace(match, jschat.values[value_name]);
        })
      }

      let params;
      if (current.params) {
        params = current.params;
      }

      window.setTimeout(() => {
        jschat.sendMessage(text, 'bot', params);
        if (next) jschat.goto(next);
      }, delay);
    }

    jschat.load = () => {
      const bot_name = jschat.bot_name || 'Bot';
      const bot_avatar = jschat.bot_avatar || 'https://i.pravatar.cc/100';

      $('body').append(
        $('<div>')
          .attr('id','jschat')
          .append([
            $('<div>')
              .addClass('header')
              .addClass('online')
              .append([
                $('<img>')
                  .attr('src', bot_avatar)
                ,$('<span>')
                  .text(bot_name)
                ,$('<a>')
                  .attr('href', 'javascript:void(0)')
              ])
            ,$('<div>')
              .addClass('body')
              .append(
                $('<ul>')
              )
            ,$('<div>')
              .addClass('footer')
              .append(
                $('<form>')
                  .addClass('disabled')
                  .append([
                    $('<input>')
                      .attr('type', 'text')
                    ,$('<button>')
                      .attr('type', 'submit')
                  ])
              )
          ])
      )

      jschat.main = document.querySelector('#jschat');
      jschat.header = document.querySelector('#jschat .header');
      jschat.close = document.querySelector('#jschat .header a');
      jschat.chat = document.querySelector('#jschat .body > ul');
      jschat.form = document.querySelector('#jschat .footer form');
      jschat.input = document.querySelector('#jschat .footer form input');
      jschat.started = false;

      const values = jschat.values;
      jschat.values = [];
      Object.entries(values).forEach(([key, value]) => {
        jschat.values[key] = value;
      });

      document.querySelectorAll(jschat.triggers).forEach(el => {
        el.addEventListener('click', (e) => {
          jschat.open();
        })
      });

      jschat.close.addEventListener('click', (e) => {
        e.preventDefault();
        $(jschat.main).addClass('close');
        $(jschat.main).removeClass('open');
      })

      let root = document.documentElement;

      const primary_color = jschat.colors.primary || '#999';
      const secondary_color = jschat.colors.secondary || '#EEE';
      const text_color = jschat.colors.secondary || '000';

      root.style.setProperty('--jschat-primary-color', primary_color);
      root.style.setProperty('--jschat-secondary-color', secondary_color);
      root.style.setProperty('--jschat-text-color', text_color);
    
    }

    jschat.load();

  });
// });