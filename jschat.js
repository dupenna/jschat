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
css.setAttribute("type", "text/css")
css.setAttribute("href", jschat.path+"jschat.css")
document.head.appendChild(css);

require('https://code.jquery.com/jquery-3.6.0.min.js', () => {

  $.noConflict();
  jQuery(document).ready(function ($) {

    jschat.open = () => {
      $(jschat.el.main).addClass('open');
      $(jschat.el.main).removeClass('close');

      if (!jschat.started) {
        jschat.started = true;
        jschat.fn.goto(jschat.start_script);
      }
    }

    jschat.fn = {};

    jschat.fn.restart = () => {
      $(jschat.el.main).addClass('open');
      $(jschat.el.main).removeClass('close');

      $(jschat.el.chat).empty();
      $(jschat.el.form).addClass('disabled');

      jschat.started = true;
      jschat.fn.goto(jschat.start_script);
    }

    jschat.fn.sendMessage = (text, from, params = {}) => {
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
                jschat.fn.sendMessage(option.text, 'me');
                jschat.values[option.name] = option.label;
                jschat.fn.goto(option.goto);
              })
            )
          )
        })

        message.append(list);
      }

      if (params.input) {
        const input = params.input;

        $(jschat.el.form).removeClass('disabled');
        $(jschat.el.input).attr('placeholder', input.placeholder);
        $(jschat.el.input).focus();

        jschat.el.form.addEventListener('submit', listener = (e) => {
          e.preventDefault();
          const text = jschat.el.input.value.trim();
          if (text.length > 0) {
            jschat.values[input.name] = text;
            jschat.fn.sendMessage(text, 'me');
            $(jschat.el.form).addClass('disabled');
            $(jschat.el.input).attr('placeholder', '');
            $(jschat.el.input).blur();
            jschat.el.form.removeEventListener('submit', listener);
            e.target.reset();
            jschat.fn.goto(input.goto);
            console.log(jschat.values);
          }
        })

      }

      $(jschat.el.chat).append(message);
    }

    jschat.fn.goto = (step_name) => {
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
        jschat.fn.sendMessage(text, 'bot', params);
        if (next) jschat.fn.goto(next);
      }, delay);
    }

    jschat.fn.load = () => {
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
                  .addClass('restart')
                  .attr('href', 'javascript:void(0)')
                ,$('<a>')
                  .addClass('close')
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

      jschat.el = {
        main: document.querySelector('#jschat'),
        header: document.querySelector('#jschat .header'),
        restart: document.querySelector('#jschat .header a.restart'),
        close: document.querySelector('#jschat .header a.close'),
        chat: document.querySelector('#jschat .body > ul'),
        form: document.querySelector('#jschat .footer form'),
        input: document.querySelector('#jschat .footer form input'),
      };
      
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

      jschat.el.restart.addEventListener('click', (e) => {
        e.preventDefault();
        jschat.fn.restart();
      })

      jschat.el.close.addEventListener('click', (e) => {
        e.preventDefault();
        $(jschat.el.main).addClass('close');
        $(jschat.el.main).removeClass('open');
      })

      let root = document.documentElement;

      const primary_color = jschat.colors.primary || '#999';
      const secondary_color = jschat.colors.secondary || '#EEE';
      const text_color = jschat.colors.secondary || '000';

      root.style.setProperty('--jschat-primary-color', primary_color);
      root.style.setProperty('--jschat-secondary-color', secondary_color);
      root.style.setProperty('--jschat-text-color', text_color);
    
    }

    jschat.fn.load();

  });
});