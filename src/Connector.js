import React, { Component } from 'react';
import {
  PanResponder,
  View,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

export const CONNECTOR_TOP_LEFT = 'tl';
export const CONNECTOR_TOP_MIDDLE = 'tm';
export const CONNECTOR_TOP_RIGHT = 'tr';
export const CONNECTOR_MIDDLE_RIGHT = 'mr';
export const CONNECTOR_BOTTOM_RIGHT = 'br';
export const CONNECTOR_BOTTOM_MIDDLE = 'bm';
export const CONNECTOR_BOTTOM_LEFT = 'bl';
export const CONNECTOR_MIDDLE_LEFT = 'ml';
export const CONNECTOR_CENTER = 'c';

/**
 * Connector component for handle touch events.
 */
export class Connector extends Component {

  constructor(props) {
    super(props);

    this.position = {
      x: 0,
      y: 0,
    };

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

      onPanResponderGrant: (event, gestureState) => {


        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        const {
          onStart
        } = this.props;

        this.position = {
          x: 0,
          y: 0,
        };

        onStart([
          0,
          0,
        ]);
      },
      onPanResponderMove: (event, gestureState) => {

        const {
          onMove
        } = this.props;

        onMove([
          gestureState.dx - this.position.x,
          gestureState.dy - this.position.y,
        ]);

        this.position = {
          x: gestureState.dx,
          y: gestureState.dy,
        };
      },
      onPanResponderTerminationRequest: (event, gestureState) => true,
      onPanResponderRelease: (event, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        const {
          onEnd
        } = this.props;

        // If don't move, consider that as a onPress event
        if(gestureState.moveX == 0 && gestureState.moveY == 0){
          this.props.onPress?.(event);
        }

        onEnd([
          gestureState.moveX,
          gestureState.moveY,
        ]);
      },
      onPanResponderTerminate: (event, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (event, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
  
    });
  }

  getVerticalHitSlot() {
    return this.props.h > 100 ? 15 : 5;
  }

  getHorizontalHitSlot() {
    return this.props.w > 100 ? 15 : 5;
  }

  render() {
    const {
      x,
      y,
      size,
      type,
    } = this.props;

    return (
      <View
        hitSlop={{
          top: this.getVerticalHitSlot(),
          bottom: this.getVerticalHitSlot(),
          right: this.getHorizontalHitSlot(),
          left: this.getHorizontalHitSlot(),
        }}
        style={{
          position: 'absolute',
          left: type === 'c' ? 6 : x ,
          top: type === 'c' ? 6 : y ,
          width: type === 'c' ? '100%' : size,
          height: type === 'c' ? '100%' : size,
          borderWidth: 1,
          borderRadius: type === 'c' ? 0 : 100,
          borderColor: 'black',
          opacity: type == 'c' ? 0 : 1,
          backgroundColor: 'white',
          zIndex: type === 'c' ? 0 : 10,
        }}
        {...this._panResponder.panHandlers}
      >
      </View>
    );
  }
}

Connector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  size: PropTypes.number,
  onStart: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
};
