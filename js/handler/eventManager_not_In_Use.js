class EventManager {
    constructor() {
      this.activeContexts = new Set(); // To store active contexts
      this.eventListeners = {}; // To store event listeners for each context
      this.keyDownListeners = {}; // To store key down listeners for each context
  
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
  
    addContext(contextName, context) {
      this.activeContexts.add(contextName);
      this.eventListeners[contextName] = {};
      this.keyDownListeners[contextName] = {};
      context.registerEvents(this);
    }
  
    registerEventListener(contextName, eventType, callback) {
      this.eventListeners[contextName][eventType] = callback;
    }
  
    registerKeyDownListener(contextName, key, callback) {
      this.keyDownListeners[contextName][key] = callback;
    }
  
    handleMouseDown(event) {
      // Handle mouse down event based on active contexts
      for (const contextName of this.activeContexts) {
        const callback = this.eventListeners[contextName]['mousedown'];
        if (callback) {
          callback(event);
        }
      }
    }
  
    handleMouseMove(event) {
      // Handle mouse move event based on active contexts
      for (const contextName of this.activeContexts) {
        const callback = this.eventListeners[contextName]['mousemove'];
        if (callback) {
          callback(event);
        }
      }
    }
  
    handleMouseUp(event) {
      // Handle mouse up event based on active contexts
      for (const contextName of this.activeContexts) {
        const callback = this.eventListeners[contextName]['mouseup'];
        if (callback) {
          callback(event);
        }
      }
    }
  
    handleKeyDown(event) {
      // Handle key down event based on active contexts
      for (const contextName of this.activeContexts) {
        const callback = this.keyDownListeners[contextName][event.key];
        if (callback) {
          callback(event);
        }
      }
    }
  
    handleKeyUp(event) {
      // Handle key up event (if needed)
    }
  }
  
  // Example context
  class MyContext {
    constructor(sprite) {
      this.sprite = sprite;
    }
  
    registerEvents(eventManager) {
      eventManager.registerEventListener('MyContext', 'mousedown', this.handleMouseDown.bind(this));
      eventManager.registerEventListener('MyContext', 'mousemove', this.handleMouseMove.bind(this));
      eventManager.registerEventListener('MyContext', 'mouseup', this.handleMouseUp.bind(this));
      eventManager.registerKeyDownListener('MyContext', 'Control', this.handleControlKeyDown.bind(this));
      // Add more event registrations as needed for this context
    }
  
    handleMouseDown(event) {
      // Handle mouse down event for this context
    }
  
    handleMouseMove(event) {
      // Handle mouse move event for this context
    }
  
    handleMouseUp(event) {
      // Handle mouse up event for this context
    }
  
    handleControlKeyDown(event) {
      // Handle Ctrl key down event for this context
    }
  }
  
  // Usage
  const eventManager = new EventManager();
  const sprite = PIXI.Sprite.from('yourImage.png');
  const myContext = new MyContext(sprite);
  eventManager.addContext('MyContext', myContext);
  
  // Assuming mouse and keyboard events are attached to the document or specific elements
  document.addEventListener('mousedown', eventManager.handleMouseDown.bind(eventManager));
  document.addEventListener('mousemove', eventManager.handleMouseMove.bind(eventManager));
  document.addEventListener('mouseup', eventManager.handleMouseUp.bind(eventManager));
  document.addEventListener('keydown', eventManager.handleKeyDown.bind(eventManager));
  document.addEventListener('keyup', eventManager.handleKeyUp.bind(eventManager));
  