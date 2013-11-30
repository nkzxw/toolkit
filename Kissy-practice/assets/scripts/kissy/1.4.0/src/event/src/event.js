/**
 * @ignore
 * event facade for event module.contains custom dom and touch event
 * @author yiminghe@gmail.com
 */
KISSY.add('event', function (S, DomEvent, CustomEvent) {
    /**
     * KISSY event utils. Provides event management.
     * @class KISSY.Event
     * @singleton
     * @mixins KISSY.Event.DomEvent
     */
    var Event = S.Event = S.merge(DomEvent, {
        DomEvent: DomEvent,
        CustomEvent: CustomEvent
    });


    /**
     * @member KISSY.Event
     * @property {KISSY.Event.CustomEvent.Target} Target
     */

    /**
     * @property {KISSY.Event.CustomEvent.Target} EventTarget
     * @member KISSY
     */

    /**
     * global event target
     * @property {KISSY.Event.CustomEvent.Target} global
     * @member KISSY.Event
     */
    Event.global = CustomEvent.global;

    // compatibility
    S.EventTarget = Event.Target = CustomEvent.targetObject;

    return Event;
}, {
    requires: ['event/dom', 'event/custom']
});