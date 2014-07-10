/*
 * Copyright (c) 2014 Gloey Apps
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define*/

/**
 * BkImageSurface adds support for sizing-strategies such as AspectFit and AspectFill for displaying images with famo.us.
 * It uses a 'div' with a background-image rather than a 'img' tag.
 *
 * Can be used as a drop-in replacement for ImageSurface, in case the the size of the div is not derived
 * from the image.
 *
 * @module
 */
define(function(require, exports, module) {
    'use strict';

    // import dependencies
    var Surface = require('famous/core/Surface');

    /**
     * @enum
     * @alias module:BkImageSurface.SizeMode
     */
    var SizeMode = {
        AUTO: 'auto',
        FILL: '100% 100%',
        ASPECTFILL: 'cover',
        ASPECTFIT: 'contain'
    };

    /**
     * @enum
     * @alias module:BkImageSurface.PositionMode
     */
    var PositionMode = {
        CENTER: 'center center',
        LEFT: 'left center',
        RIGHT: 'right center',
        TOP: 'center top',
        BOTTOM: 'center bottom',
        TOPLEFT: 'left top',
        TOPRIGHT: 'right top',
        BOTTOMLEFT: 'left bottom',
        BOTTOMRIGHT: 'right bottom'
    };

    /**
     * @enum
     * @alias module:BkImageSurface.RepeatMode
     */
    var RepeatMode = {
        NONE: 'no-repeat',
        VERTICAL: 'repeat-x',
        HORIZONTAL: 'repeat-y',
        BOTH: 'repeat'
    };

    /**
     * @class
     * @param {Object} options Options.
     * @param {String} [options.content] Image-url.
     * @param {SizeMode|String} [options.sizeMode] Size-mode to use.
     * @param {PositionMode|String} [options.positionMode] Position-mode to use.
     * @param {RepeatMode|String} [options.repeatMode] Repeat-mode to use.
     * @alias module:BkImageSurface
     */
    var BkImageSurface = function(options) {
        Surface.apply(this, arguments);
        this.content = undefined;
        this._imageUrl = options ? options.content : undefined;
        this._sizeMode = (options && options.sizeMode) ? options.sizeMode : SizeMode.FILL;
        this._positionMode = (options && options.positionMode) ? options.positionMode : PositionMode.CENTER;
        this._repeatMode = (options && options.repeatMode) ? options.repeatMode : RepeatMode.NONE;

        this._updateProperties();
    };
    BkImageSurface.prototype = Object.create(Surface.prototype);
    BkImageSurface.prototype.constructor = BkImageSurface;
    BkImageSurface.prototype.elementType = 'div';
    BkImageSurface.prototype.elementClass = 'famous-surface';
    BkImageSurface.SizeMode = SizeMode;
    BkImageSurface.PositionMode = PositionMode;
    BkImageSurface.RepeatMode = RepeatMode;

    /**
     * Update the css-styles on the div.
     *
     * @private
     */
    BkImageSurface.prototype._updateProperties = function() {
        var props = this.getProperties();
        if (this._imageUrl) {
            props.backgroundImage = 'url(' + this._imageUrl + ')';
        } else {
            props.backgroundImage = '';
        }
        props.backgroundSize = this._sizeMode;
        props.backgroundPosition = this._positionMode;
        props.backgroundRepeat = this._repeatMode;
        this.setProperties(props);
    };

    /**
     * @param {String} imageUrl Image-url, when set will cause re-rendering
     */
    BkImageSurface.prototype.setContent = function(imageUrl) {
        this._imageUrl = imageUrl;
        this._updateProperties();
    };

    /**
     * @return {String} Image-url
     */
    BkImageSurface.prototype.getContent = function() {
        return this._imageUrl;
    };

    /**
     * @param {SizeMode|String} sizeMode Sizing-mode, when set will cause re-rendering
     */
    BkImageSurface.prototype.setSizeMode = function(sizeMode) {
        this._sizeMode = sizeMode;
        this._updateProperties();
    };

    /**
     * @return {SizeMode|String} Size-mode
     */
    BkImageSurface.prototype.getSizeMode = function() {
        return this._sizeMode;
    };

    /**
     * @param {PositionMode|String} positionMode Position-mode, when set will cause re-rendering
     */
    BkImageSurface.prototype.setPositionMode = function(positionMode) {
        this._positionMode = positionMode;
        this._updateProperties();
    };

    /**
     * @return {RepeatMode|String} Position-mode
     */
    BkImageSurface.prototype.getPositionMode = function() {
        return this._positionMode;
    };

    /**
     * @param {RepeatMode|String} repeatMode Repeat-mode, when set will cause re-rendering
     */
    BkImageSurface.prototype.setRepeatMode = function(repeatMode) {
        this._repeatMode = repeatMode;
        this._updateProperties();
    };

    /**
     * @return {RepeatMode|String} Repeat-mode
     */
    BkImageSurface.prototype.getRepeatMode = function() {
        return this._repeatMode;
    };

    /**
     * Place the document element that this component manages into the document.
     *
     * NOTE: deploy and recall were added because famo.us removed the background-image
     * after the surface was removed/re-added from the DOM.
     *
     * @private
     * @param {Node} target document parent of this container
     */
    BkImageSurface.prototype.deploy = function deploy(target) {
        if (this._imageUrl) {
            target.style.backgroundImage = 'url(' + this._imageUrl + ')';
        }
    };

    /**
     * Remove this component and contained content from the document
     *
     * NOTE: deploy and recall were added because famo.us removed the background-image
     * after the surface was removed/re-added from the DOM.
     *
     * @private
     * @param {Node} target node to which the component was deployed
     */
    BkImageSurface.prototype.recall = function recall(target) {
        target.style.backgroundImage = '';
    };

    module.exports = BkImageSurface;
});
