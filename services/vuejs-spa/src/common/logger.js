function initLogger(name = '') {
  return {
    info(data) {
      const level = 'INFO';
      const display = this.__display.bind(this, level);
      display(data);
    },
    debug(data) {
      const level = 'DEBUG';
      const display = this.__display.bind(this, level);
      display(data);
    },
    error(data) {
      const level = 'ERROR';
      const display = this.__display.bind(this, level);
      display(data);
    },

    __display(type = '', messages) {
      // if (!config.debugEnabled) return;
      const say = (type.toLowerCase() === 'error' ? console.error : console.log).bind(console);
      const header = `/‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾${name} ${type}‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾`;
      const footer = `\\___________________${name} ${type} END___________________`;

      say(header);

      if (Array.isArray(messages)) {
        say(...messages.map((m, i) => ((typeof m === 'string' && i) && `\n${m}`) || m));
      } else {
        say(messages);
      }

      say(footer);
    },
  };
}
export default initLogger;
