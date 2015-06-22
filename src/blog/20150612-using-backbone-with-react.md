---
title: Using Backbone Models and Collections with React
description: How to use Backbone Models and Collections with React JS
date: 2015-06-19
template: post.html
tags:
    - Javascript
    - BackboneJS
    - ReactJS
---

[React JS](http://facebook.github.io/react/) unlike some of the other popular Javascript libraries isn't a fully fledged MV*/application structure framework. It is more the equivalent to a [Backbone](http://backbonejs.org/) view.  If it's just the equivalent of a view in Backbone, you might be thinking, how can you use Backbone models and collections with a React view?

React uses props and state to store view data and render/update the view when these change. If a Backbone model or collection is set in a React views props or state, React won't know how to listen to the Backbone event system to know when data has changed. So how do we teach React how to understand the Backbone event system. The key to adding new behaviour to React is to understand the React component lifecycle. 

More details on React's component lifecycle methods can be found on the [React documentation page.](https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)

The two methods needed to hook in Backbone's event system are componentDidMount and componentWillUnMount. 

Inside the componentDidMount method we listen to the events of the model (i.e. change) or collection (i.e. add, remove, reset, sort) as you normally would in a full Backbone application. 

Inside the componentWillUnMount method we unsubscribe from the events we earlier listened to in componentDidMount.

    var MyComponent = React.createClass({
        componentDidMount: function( prevProps, prevState ) {
            if ( this.props.model ) {
                this.props.model.on( 'change', function() {
                    if ( this.isMounted() ) {
                        this.forceUpdate();
                    }
                }, this );
            }

            if ( this.props.collection ) {
                this.props.collection.on( 'add remove reset sort', function() {
                    if ( this.isMounted() ) {
                        this.forceUpdate();
                    }
                }, this );
            }
        },

        componentWillUnMount: function() {
            if ( this.props.model ) {
                this.props.model.off( null, null, this );
            }

            if ( this.props.collection ) {
                this.props.collection.off( null, null, this );
            }
        },

        render: function() {
            // Render code here...
        } 
    });

This is then used by passing either a model or collection prop attribute (or both) to your component. For convention, models are passed to the component under the prop name model where as collections are passed as collection.

    React.render(
        <MyComponent model={Backbone.Model} collection={Backbone.Collection} />,
        document.getElementById( 'DOMNode ID' )
    );

The callback for each event has the important method that forces React's Virtual DOM to update even though it is unaware of any data change.

Putting these lifecycle methods in every React component that uses Backbone data structures isn't very DRY (Don't Repeat Yourself) and means the developer has to copy them over each time.

Luckily React components allow for the inclusion of mixins, through the mixins key with the value of an array of mixins to include in the component. So instead of the above we can extract the lifecycle methods into it's own object and add it to our components mixin array.

    var BackboneMixin = {
        componentDidMount: function( prevProps, prevState ) {
            if ( this.props.model ) {
                this.props.model.on( 'change', function() {
                    if ( this.isMounted() ) {
                        this.forceUpdate();
                    }
                }, this );
            }

            if ( this.props.collection ) {
                this.props.collection.on( 'add remove reset sort', function() {
                    if ( this.isMounted() ) {
                        this.forceUpdate();
                    }
                }, this );
            }
        },

        componentWillUnMount: function() {
            if ( this.props.model ) {
                this.props.model.off( null, null, this );
            }

            if ( this.props.collection ) {
                this.props.collection.off( null, null, this );
            }
        }
    };

    var MyComponent = React.createClass({
        mixins: [ BackboneMixin ],

        render: function() {
            // Render code here...
        } 
    });

Now these lifecycle methods can be reused in any React component, allowing the performance of React's Virtual DOM for view rendering and updating and the structure and utility methods of Backbone's data structures for keeping the application data and state. 

To tidy up the code and make it more DRY, the callback could be extracted into a function that could be reused in both event definitions as both callbacks are identical.

### Conclusion

If you use Backbone and React together in  your applications, let us know how you integrate the two in the comments. 

### References

[React JS](http://facebook.github.io/react/)  
[React JS Component Lifecycle Documentation](https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)  
[Backbone JS](http://backbonejs.org/)  

