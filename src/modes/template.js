/**
 * This file isn't actually a mode. It's just a resource to help construct new modes.
 * Copy and paste its contents into the file of the new mode you want to create.
 * Note that the mode must
 * 1. Define its name in the constructor
 * 2. Provide a handler function for every possible event type
 * 3. Return a valid next mode from every handler
 * Do not attempt to remove 'unused' handlers. Instead, return the mode itself.
 */

/**
 * You might wonder why all the handlers are async functions. This is to support
 * offloading events to external extensions, which works as follows:
 * 1. The event is serialized and sent to the external extension
 * 2. The external extension does its own processing and calculates the new mode
 * 3. The external sends back the new mode to Saka Key
 * 4. Saka key's local handler returns the remotely calculate new mode from its handler
 */


/**
 * event.target, event.path, event.deeppath
 */

/**
 * Capturing and bubbling and default behavior
 * https://www.w3.org/TR/DOM-Level-3-Events/#event-flow
 * https://www.w3.org/TR/DOM-Level-3-Events/#event-flow-default-cancel
 * https://javascript.info/tutorial/bubbling-and-capturing
 * http://javascript.info/tutorial/default-browser-action
 * Default actions are usually performed after the event dispatch has been completed, but in exceptional cases they may also be performed immediately before the event is dispatched.
 * When an event is canceled, then the conditional default actions associated with the event is skipped (or as mentioned above, if the default actions are carried out before the dispatch, their effect is undone).
 */

/**
 * Synchronous and Asynchronous events
 * https://www.w3.org/TR/DOM-Level-3-Events/#sync-async
 */


/*
 * You will most likely want to stop event propagation and default behavior using:
 * 1. event.stopImmediatePropagation();
 *   * Prevents other listeners of the current element for the event from being called AND
 *     prevents the event from being propogated to other elements.
 *   * Does NOT affect default behavior.
 *   * Listeners are called in the order they were added
 *   * Example: Listener1, listener2, and listener3 for the 'click' event are added to element X.
 *     The user clicks on X, so a 'click' event e is dispatched to X. First listener 1 is called.
 *     Then listener 2 is called. Listener2 calls event.stopImmediatePropagation(), so listener3
 *     is not called. e then triggers the default behavior of X. X is contained within an element Y that also has a listener for 'click' events.
 *     Y's listener is NOT called because stopImmediatePropagation() stops the event from being
 *     propogated to Y.
 * 2. event.stopPropagation();
 *   * Prevents the event from being propogated to other elements (for both capturing and bubbling phases)
 *   * All remaining handlers of the current element still receive the event. Other elements just don't
 *     get the event.
 *   * Does NOT affect default behavior.
 *   * Example: Listener1, listener2, and listener3 for the 'click' event are added to element X.
 *     The user clicks on X, so a 'click' event e is dispatched to X. First listener 1 is called.
 *     Then listener 2 is called. Listener2 calls event.stopPropagation(). Listener3 is then called
 *     because stopPropagation() does not cancel the current event's handlers. X is contained within
 *     an element Y that also has a listener for 'click' events. Y's listener is NOT called because
 *     stopPropagation() stops the event from being propogated to Y.
 * 3. event.preventDefault();
 *   * Cancels the event if it is cancelable.
 *   * Does NOT affect further propagation of the event.
 *   * TODO: figure out whether default behaviour occurs after bubble up of current element, or after
 *           complete bubble up of all elements in dispatch path.
 *   * A cancelled event does not trigger the event's default behavior.
 *     (e.g. if you type 'a' into a text input but the 'a' keypress event is cancelled, 'a' won't appear)
 *   * Example: TODO (this is not accurate)
 *     Listener1, listener2, and listener3 for the 'click' event are added to element X.
 *     The user clicks on X, so a 'click' event e is dispatched to X. First listener 1 is called.
 *     Then listener 2 is called. Listener2 calls event.preventDefault(). Listener3 is then called
 *     because preventDefault() does not cancel the current event's handlers. X is contained within
 *     an element Y that also has a listener for 'click' events. Y's listener is NOT called because
 *     stopPropagation() stops the event from being propogated to Y.
 */

/**
 * Keyboard Events are tricky.
 * Please read the sections on keyboard events.
 * * https://www.w3.org/TR/DOM-Level-3-Events
 * * https://www.w3.org/TR/DOM-Level-3-Events/#keydown
 * * https://www.w3.org/TR/DOM-Level-3-Events/#keypress
 * * https://www.w3.org/TR/DOM-Level-3-Events/#keyup
 * The following is the subset of their behavior relavant to Saka key.
 * Understand the following before writing key event handlers:
 * 1. keydown
 *   * Dispatched when any key is pressed, including tab, shift, escape and backspace.
 *   * Default behahaviour will launch the keypress event (and other stuff)
 *   * e.g. if you call preventDefault(), no keypress() event will be dispatched.
 * 2. keypress
 *   * Dispatched by a keydown event's default handler, if the key is a character value
 *   * e.g. shift and tab won't trigger a keypress
 *   * Dispatched after keypress (assuming preventDefault() isn't called) and before keyup
 *   * Default behavior will enter character if dispatched to input[text]/textarea/contenteditable
 *   * Apparently depracated in favor of beforeinput event... but oh well
 * 3. keyup
 *   * Dispatched when any key is released, including tab, shift, escape and backspace.
 *   * No default action
 */

/**
 * Read this section for activation behavior and click events
 * https://www.w3.org/TR/html51/editing.html
 * https://www.w3.org/TR/html51/editing.html#running-synthetic-click-activation-steps
 */

/**
 * TODO: Consider using the input and beforeinput events
 */

import { Mode } from './mode';

class Template extends Mode {
  async keydown (event) {

  }
  async keypress (event) {

  }
  async keyup (event) {

  }
  async focus (event) {

  }
  async blur (event) {

  }
  async click (event) {

  }
  async mousedown (event) {

  }
  async scroll (event) {

  }
  async saka (event) {

  }
}

export const TEMPLATE = new Template('TEMPLATE');
