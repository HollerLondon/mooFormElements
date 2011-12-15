alert('mooforms');

var mooFormElements = new Class({
  Implements: [ Options ],
  
  options: {
    checkbox: {
      height:   25
    },
    radio: {
      height:   25
    },
    select: {
      width:    190
    },
    with_class: 'styled'
  },
  
  initialize: function (options)
  {
    this.setOptions(options);

    this.hideElementsToStyle();

    // Sort out checkboxes and radio buttons
    $$('input[type=radio].styled, input[type=checkbox].styled').each(this.replaceButtonWidget.bind(this));
    // Sort out selects
    $$('select.styled:not([multiple])').each(this.replaceSelectWidget.bind(this));
  },

  /**
   * Hide the actual form elements with class 'styled'
   **/
  hideElementsToStyle: function ()
  {
    $$('input.'+this.options.with_class).setStyle('display','none');
    $$('select:not([multiple]).'+this.options.with_class).setStyles({
      'width':    this.options.select.width,
      'opacity':  0,
      'z-index':  5
    })
    $$('input.disabled, select.disabled').setStyle('opacity',0.5);
  },
  
  /**
   * Replaces select widget with stuff and binds events
   **/
  replaceSelectWidget: function (input)
  {
    selected  = this.getSelectedOptionText(input);
    
    replacement = new Element('span',{
      'text':     selected,
      'class':    'select',
      'id':       'select'+input.get('name')
    });
    
    replacement.inject(input,'before');
    
    if(input.get('disabled'))
    {
      replacement.addClass('disabled');
    }
    else
    {
      input.addEvent('change',this.selectChoose.bind(this));
    }
  },
  
  /**
   * Gets the text of a selected option in a <select>
   **/
  getSelectedOptionText: function (input)
  {
    selected = input.getSelected();
    return selected[0].get('text');
  },
  
  selectChoose: function (ev)
  {
    input     = ev.target
    trigger   = input.getPrevious('span.select');
    selected  = this.getSelectedOptionText(ev.target);
    trigger.set('text',selected);
  },
  
  /**
   * Replace radio and checkbox elements with styled spans, injecting them
   * before the widget itself, binding mouse events to trigger changes to the
   * inputs themselves
   **/
  replaceButtonWidget: function (widget)
  {
    replacement = new Element('span',{
      'class':    widget.get('type')
    });
    
    if(widget.checked)
    {
      switch(widget.get('type'))
      {
        case 'checkbox':
          replacement.setStyle('background-position','0 -'+(this.options.checkbox.height*2)+'px');
          break;
        case 'checkbox':
          replacement.setStyle('background-position','0 -'+(this.options.radio.height*2)+'px');
          break;
      }
    }
    
    replacement.inject(widget,'before');

    if(widget.get('disabled'))
    {
      replacement.addClass('disabled');
    }
    else
    {
      replacement.addEvents({
        'mousedown':    this.widgetMouseEvent.bind(this),
        'mouseup':      this.widgetMouseEvent.bind(this)
      });
    }
    widget.addEvent('change', this.widgetClear.bind(this));
  },
  
  /**
   * Delegates mouse(up|down) events on radio and checkbox widgets
   **/
  widgetMouseEvent: function (ev)
  {
    trigger = ev.target;
    input   = trigger.getNext();

    switch(ev.type)
    {
      case 'mousedown':
        this.widgetMouseDown(trigger,input);
        break;
      case 'mouseup':
        this.widgetMouseUp(trigger,input);
        break;
    }
  },
  
  /**
   * Handle a mousedown event on a checkbox or radio button. 'trigger' is the
   * span, input is the actual form widget
   **/
  widgetMouseDown: function (trigger,input)
  {
    if(input.checked)
    {
      switch(input.get('type'))
      {
        case 'checkbox':
          trigger.setStyle('background-position','0 -'+ this.options.checkbox.height*3 +'px');
          break;
        case 'radio':
          trigger.setStyle('background-position','0 -'+ this.options.radio.height*3 +'px');
          break;
      }
    }
    else
    {
      switch(input.get('type'))
      {
        case 'checkbox':
          trigger.setStyle('background-position','0 -'+ this.options.checkbox.height +'px');
          break;
        case 'radio':
          trigger.setStyle('background-position','0 -'+ this.options.radio.height +'px');
          break;
      }
    }
  },
  
  /**
   * Handle a mouseup event on a checkbox or radio button. 'trigger' is the
   * span, input is the actual form widget
   **/
  widgetMouseUp: function (trigger,input)
  {
    if(input.checked)
    {
      switch(input.get('type'))
      {
        case 'checkbox':
          trigger.setStyle('background-position','0 0');
          input.set('checked',false);
          break;
        case 'radio':
          trigger.setStyle('background-position','0 -'+ this.options.radio.height*3 +'px');
          break;
      }
    }
    else
    {
      switch(input.get('type'))
      {
        case 'checkbox':
          trigger.setStyle('background-position','0 -'+ this.options.checkbox.height*2 +'px');
          break;
        // Radio buttons are more complex as they exist as part of a group
        case 'radio':
          group = input.get('name');
          $$('input[name='+ group +']').each(
            function (grouped_input)
            {
              if(grouped_input == input) return; // don't action the clicked one
              grouped_input.getPrevious('span.radio').setStyle('background-position','0 0');
            }
          );
          break;
      }
      input.set('checked','true');
    }
  },
  
  widgetClear:    function (ev)
  {
    $$('input[type=checkbox].styled, input[type=radio].styled').each(
      function (input)
      {
        trigger = input.getPrevious('span.'+input.get('type'));
        if(input.checked)
        {
          switch(input.get('type'))
          {
            case 'checkbox':
              trigger.setStyle('background-position','0 -'+ this.options.checkbox.height*2 + 'px');
              break;
            case 'radio':
              trigger.setStyle('background-position','0 -'+ this.options.radio.height*2 + 'px');
              break;
          }
        }
        else
        {
          trigger.setStyle('background-position','0 0');
        }
      }
    )
  }
});