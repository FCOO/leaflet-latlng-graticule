/****************************************************************************
	leaflet-latlng-graticule.js,

	(c) 2018, FCOO

	https://github.com/FCOO/leaflet-latlng-graticule
	https://github.com/FCOO

****************************************************************************/
(function ($, L, window, document, undefined) {
	"use strict";

    /*
    window.latLngFormat.setFormat( window.latLngFormat.LATLNGFORMAT_DMM );
    window.latLngFormat.LATLNGFORMAT_DMSS = 0, //Degrees Minutes Seconds Decimal Seconds: N65d30'15.3"  d='degree sign'
    window.latLngFormat.LATLNGFORMAT_DMM  = 1, //Degrees Decimal minutes                : N65d30.258'
    window.latLngFormat.LATLNGFORMAT_DD   = 2; //Decimal degrees                        : N41.1234d
    */

    //Create ns L.latLngGraticuleType with values for types
    var ns = L.latLngGraticuleType = {};
    var TYPE_MAJOR_LINE = ns.TYPE_MAJOR_LINE = 1,
        TYPE_MAJOR_TICK = ns.TYPE_MAJOR_TICK = 2,
        TYPE_MINOR_LINE = ns.TYPE_MINOR_LINE = 4,
        TYPE_MINOR_TICK = ns.TYPE_MINOR_TICK = 8,
        TYPE_MAJOR_ANY  = TYPE_MAJOR_LINE + TYPE_MAJOR_TICK,
        TYPE_MINOR_ANY  = TYPE_MINOR_LINE + TYPE_MINOR_TICK,
        TYPE_TICK_ANY   = TYPE_MAJOR_TICK + TYPE_MINOR_TICK;



    L.LatLngGraticule = L.Layer.extend({
        includes: L.Evented,
        options: {
//            type     : TYPE_MAJOR_LINE + TYPE_MINOR_TICK,
            type     : TYPE_MAJOR_LINE + TYPE_MINOR_LINE,

            showLabel: true,
            weight: 2,
            color: 'rgba(0,0,0,.6)',//'#aaa',

            shadowWidth: 1, //On each side of the line
            shadowColor: 'rgba(255,255,255,.28)',

            miniorOptions: {
                weight: 1,
                color: 'rgba(80,80,80,.6)',//'#aaa',
            },
            fontSize  : 10,
            fontFamily: "Verdana",
            fontColor : 'black',

            textBackgroundColor: "rgba(255,255,255,.6)",

            lngLineCurved: 0,
            latLineCurved: 0,

            /*
            latitude, longitude = [] of {
                start               : Number //Min zoom
                end                 : Number //Max zoom
                interval            : Number or [Number, Number] where [0] is applied when lat-lng-format is decimal and [1] is applied when lat-ng-format is with minutes
                minorInterval       : Number or [Number, Number] where [0] is applied when lat-lng-format is decimal and [1] is applied when lat-ng-format is with minutes
                minorIntervalDivider: Number or [Number, Number] where [0] is applied when lat-lng-format is decimal and [1] is applied when lat-ng-format is with minutes
            }

            interval = lat/lng space between major ticks/lines
            minorInterval = lat/lng space between major ticks/lines
            if minorInterval isn't given => minorInterval = inerval / minorIntervalDivider
            */

            zoomInterval: {
                latitude: [
                    <!-- {start:  1, end:  1, interval: 180,   minorIntervalDivider: 3}, -->
                    {start:  1, end:  1, interval:  90,   minorIntervalDivider: 3},
                    {start:  2, end:  2, interval:  45,   minorIntervalDivider: 3},
                    {start:  3, end:  3, interval:  20,   minorIntervalDivider: 2},
                    {start:  4, end:  4, interval:  10,   minorIntervalDivider: 2},
                    {start:  5, end:  5, interval:   6,   minorIntervalDivider: 3},
                    {start:  6, end:  6, interval:   3,   minorIntervalDivider: 3},
                    {start:  7, end:  7, interval:   2,   minorIntervalDivider: 4},
                    {start:  8, end:  8, interval:   1,   minorIntervalDivider: 4},
                    {start:  9, end:  9, interval:   .5,  minorIntervalDivider: [2, 3]},
                    {start: 10, end: 10, interval:   .25, minorIntervalDivider: [1, 2]},
                    {start: 11, end: 11, interval:   .1,  minorIntervalDivider: [1, 2]},
                    {start: 12, end: 12, interval: [.05,  4 /60], minorIntervalDivider: [ 1,  2]},
                    {start: 13, end: 13, interval: [.025, 2 /60], minorIntervalDivider: [ 1,  2]},
                    {start: 14, end: 14, interval: [.01,  1 /60], minorIntervalDivider: [ 2,  4]},
                    {start: 15, end: 15, interval: [.01,  1 /60], minorIntervalDivider: [ 4,  8]},
                    {start: 16, end: 16, interval: [.01,  1 /60], minorIntervalDivider: [ 8, 16]},
                    {start: 17, end: 17, interval: [.01,  1 /60], minorIntervalDivider: [16, 32]},
                    {start: 18, end: 18, interval: [.01,  1 /60], minorIntervalDivider: [32, 64]},
                    {start: 19, end: 20, interval: [.01,  1 /60], minorIntervalDivider: [64,128]},
                ],
                longitude: [
                    {start:  1, end:  1, interval: 180,   minorIntervalDivider: 3},
                    {start:  2, end:  2, interval:  90,   minorIntervalDivider: 3},
                    {start:  3, end:  3, interval:  45,   minorIntervalDivider: 3},
                    {start:  4, end:  4, interval:  20,   minorIntervalDivider: 2},
                    {start:  5, end:  5, interval:  10,   minorIntervalDivider: 2},
                    {start:  6, end:  6, interval:   6,   minorIntervalDivider: 3},
                    {start:  7, end:  7, interval:   3,   minorIntervalDivider: 3},
                    {start:  8, end:  8, interval:   2,   minorIntervalDivider: 4},
                    {start:  9, end:  9, interval:   1,   minorIntervalDivider: 4},
                    {start: 10, end: 10, interval:   .5,  minorIntervalDivider: [2, 3]},
                    {start: 11, end: 11, interval:   .25, minorIntervalDivider: [1, 2]},
                    {start: 12, end: 12, interval:   .1,  minorIntervalDivider: [1, 2]},
                    {start: 13, end: 13, interval: [.05,  4 /60], minorIntervalDivider: [ 1,  2]},
                    {start: 14, end: 14, interval: [.025, 2 /60], minorIntervalDivider: [ 1,  2]},
                    {start: 15, end: 15, interval: [.01,  1 /60], minorIntervalDivider: [ 2,  4]},
                    {start: 16, end: 16, interval: [.01,  1 /60], minorIntervalDivider: [ 4,  8]},
                    {start: 17, end: 17, interval: [.01,  1 /60], minorIntervalDivider: [ 8, 16]},
                    {start: 18, end: 18, interval: [.01,  1 /60], minorIntervalDivider: [16, 32]},
                    {start: 19, end: 19, interval: [.01,  1 /60], minorIntervalDivider: [32, 64]},
                    {start: 20, end: 20, interval: [.01,  1 /60], minorIntervalDivider: [64,128]},
                ]

            }
        },


        //**********************************************************
        initialize: function (options) {
            L.setOptions(this, options);

            this._changeLatLngFormat( window.latLngFormat.options.formatId );

            window.latLngFormat.onChange( this._changeLatLngFormat, this );

            if (!this.options.zoomInterval.latitude)
                this.options.zoomInterval.latitude = this.options.zoomInterval.longitude;
            if (!this.options.zoomInterval.longitude)
                this.options.zoomInterval.longitude = this.options.zoomInterval.latitude;

            if (!this.options.fontColor)
                this.options.fontColor = this.options.color;

            if (this.options.zoomInterval.latitude) {
                this.options.latInterval = this.options.zoomInterval.latitude;
                if (!this.options.zoomInterval.longitude)
                   this.options.lngInterval = this.options.zoomInterval.latitude;
            }
            if (this.options.zoomInterval.longitude) {
                this.options.lngInterval = this.options.zoomInterval.longitude;
                if (!this.options.zoomInterval.latitude)
                    this.options.latInterval = this.options.zoomInterval.longitude;
            }
            if (!this.options.latInterval)
                this.options.latInterval = this.options.zoomInterval;
            if (!this.options.lngInterval)
                this.options.lngInterval = this.options.zoomInterval;
        },

        //**********************************************************
        onAdd: function (map) {
            this._map = map;

            if (!this._container){
                this._container = L.DomUtil.create('div', 'leaflet-image-layer');
                this._canvas = L.DomUtil.create('canvas', '');
                if (this._map.options.zoomAnimation && L.Browser.any3d)
                    L.DomUtil.addClass(this._canvas, 'leaflet-zoom-animated');
                else
                    L.DomUtil.addClass(this._canvas, 'leaflet-zoom-hide');
                this._container.appendChild(this._canvas);
                L.extend(this._canvas, {
                    onselectstart: L.Util.falseFn,
                    onmousemove  : L.Util.falseFn,
                    onload       : L.bind(this._onCanvasLoad, this)
                });

            }

            map._panes.overlayPane.appendChild(this._container);

            map.on('viewreset', this._reset, this);
            map.on('move',      this._reset, this);
            map.on('moveend',   this._reset, this);

            this._reset();
        },

        //**********************************************************
        onRemove: function (map) {
            map.getPanes().overlayPane.removeChild(this._container);

            map.off('viewreset', this._reset, this);
            map.off('move',      this._reset, this);
            map.off('moveend',   this._reset, this);
        },

        //**********************************************************
        addTo: function (map) {
            map.addLayer(this);
            return this;
        },

        //**********************************************************
        bringToFront: function () {
            if (this._canvas)
                this._map._panes.overlayPane.appendChild(this._canvas);
            return this;
        },

        //**********************************************************
        bringToBack: function () {
            var pane = this._map._panes.overlayPane;
            if (this._canvas)
                pane.insertBefore(this._canvas, pane.firstChild);
            return this;
        },

        //**********************************************************
        setType: function(type){
            this.options.type = type;
            this._draw();
        },

        //**********************************************************
        _reset: function () {
            var container = this._container,
                canvas = this._canvas,
                size = this._map.getSize(),
                lt = this._map.containerPointToLayerPoint([0, 0]);

            L.DomUtil.setPosition(container, lt);

            container.style.width = size.x + 'px';
            container.style.height = size.y + 'px';

            canvas.width  = size.x;
            canvas.height = size.y;
            canvas.style.width  = size.x + 'px';
            canvas.style.height = size.y + 'px';

            this._calcInterval();

            this._draw();
        },

        //**********************************************************
        _onCanvasLoad: function () {
            this.fire('load');
        },

        //**********************************************************
        _changeLatLngFormat: function( newFormatId ){
            var oldFormatId = this.options.latLngFormatId;
            this.options.latLngFormatId = newFormatId > window.latLngFormat.LATLNGFORMAT_DD ? window.latLngFormat.LATLNGFORMAT_DMM : newFormatId;
            this.options.isDecimal = this.options.latLngFormatId == window.latLngFormat.LATLNGFORMAT_DD;

            if (oldFormatId != this.options.latLngFormatId)
                this._draw( true );
        },

        //**********************************************************
        _calcInterval: function() {
            var currIntervals,
                intervalIndex = this.options.isDecimal ? 0 : 1,
                zoom = this._map.getZoom();
            if (this._currZoom != zoom) {
                this._currLngInterval             = 0;
                this._currLngMinorInterval        = 0;
                this._currLngMinorIntervalDivider = 1;

                this._currLatInterval             = 0;
                this._currLatMinorInterval        = 0;
                this._currLatMinorIntervalDivider = 1;

                this._currZoom = zoom;
            }

            function getCurrentIntervals( intervalArray ){
                var result = {};
                $.each( intervalArray, function(index, dict ){
                    if (dict.start <= zoom && dict.end && dict.end >= zoom) {
                        result.interval      = $.isArray(dict.interval) ? dict.interval[intervalIndex] : dict.interval;
                        result.minorInterval = $.isArray(dict.minorInterval) ? dict.minorInterval[intervalIndex] : dict.minorInterval;
                        if (result.minorInterval)
                            result.minorIntervalDivider = Math.round(result.interval / result.minorInterval);
                        else {
                            result.minorIntervalDivider = ($.isArray(dict.minorIntervalDivider) ? dict.minorIntervalDivider[intervalIndex] : dict.minorIntervalDivider) || 1;
                            result.minorInterval = result.interval / result.minorIntervalDivider;
                        }
                        return false;
                    }
                });
                return result;
            }

            if (!this._currLngInterval){
                currIntervals = getCurrentIntervals( this.options.lngInterval );
                this._currLngInterval             = currIntervals.interval;
                this._currLngMinorInterval        = currIntervals.minorInterval;
                this._currLngMinorIntervalDivider = currIntervals.minorIntervalDivider;
            }
            if (!this._currLatInterval){
                currIntervals = getCurrentIntervals( this.options.latInterval );
                this._currLatInterval             = currIntervals.interval;
                this._currLatMinorInterval        = currIntervals.minorInterval;
                this._currLatMinorIntervalDivider = currIntervals.minorIntervalDivider;
            }
        },

        //**********************************************************
        _draw: function( forceCalc ) {
            var _this = this,
                canvas = this._canvas,
                map = this._map,
                lineNo;

            this.options.lngLineCurved = this.options.lngLineCurved || 0;
            this.options.latLineCurved = this.options.latLineCurved || 0;

            this.options.majorTickLength = 2*this.options.fontSize;
            this.options.minorTickLength = 1*this.options.fontSize;

            if (!L.Browser.canvas || !map)
                return;

            if (forceCalc)
                this._currZoom = -1;

            if (forceCalc || !this._currLngInterval || !this._currLatInterval)
                this._calcInterval();

            var hasMinor    = this.options.type & TYPE_MINOR_ANY,

                latInterval      = this._currLatInterval,
                latMinorInterval = hasMinor ? this._currLatMinorInterval : this._currLatInterval,
                latDivider       = hasMinor ? this._currLatMinorIntervalDivider : 1,

                lngInterval      = this._currLngInterval,
                lngMinorInterval = hasMinor ? this._currLngMinorInterval : this._currLngInterval,
                lngDivider       = hasMinor ? this._currLngMinorIntervalDivider : 1;



            var ctx = this.ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Turn anti-alias "off"
            ctx.translate(0.5, 0.5);

            ctx.fillStyle = this.options.fontColor;
            ctx.font = this.options.fontSize+'px ' + this.options.fontFamily;

            var canvasWidth  = this.canvasWidth  = canvas.width,
                canvasHeight = this.canvasHeight = canvas.height,

                lt = map.containerPointToLatLng(L.point(0, 0)),
                rt = map.containerPointToLatLng(L.point(canvasWidth, 0)),
                rb = map.containerPointToLatLng(L.point(canvasWidth, canvasHeight)),

                latBottom = rb.lat,
                latTop    = lt.lat,
                lngLeft   = lt.lng,
                lngRight  = rt.lng,

                pointPerLat = (latTop - latBottom) / (canvasHeight * 0.2);

            if (isNaN(pointPerLat))
                return;

            if (pointPerLat < 1)
                pointPerLat = 1;
            if (latBottom < -90)
                latBottom = -90;
            else
                latBottom = parseInt(latBottom - pointPerLat, 10);

            if (latTop > 90)
                latTop = 90;
            else
                latTop = parseInt(latTop + pointPerLat, 10);

            var pointPerLng = (lngRight - lngLeft) / (canvasWidth * 0.2);

            if (pointPerLng < 1) { pointPerLng = 1; }
            if (lngLeft > 0 && lngRight < 0) {
                lngRight += 360;
            }
            lngRight = parseInt(lngRight + pointPerLng, 10);
            lngLeft = parseInt(lngLeft - pointPerLng, 10);


            this.latBottom = latBottom;
            this.latTop = latTop;
            this.lngLeft = lngLeft;
            this.lngRight = lngRight;
            this.pointPerLat = pointPerLat;
            this.pointPerLng = pointPerLng;

            this.drawing = true;

            //Draw ticks or lines and save position for labels
            var lngLabelList = [],
                latLabelList = [];
            function drawLngLine(lng){
                var isMinor = lineNo % lngDivider;
                _this._drawLngLine(lng, isMinor );
                if (!isMinor)
                    lngLabelList.push(lng);
            }
            function drawLatLine(lat){
                var isMinor = lineNo % latDivider;
                _this._drawLatLine(lat, isMinor );
                if (!isMinor)
                    latLabelList.push(lat);
            }

            if (lngInterval > 0) {
                lineNo = 0;
                for (var lng=lngInterval; lng<=lngRight; lng+=lngMinorInterval){
                    if (lng >= lngLeft)
                        drawLngLine(lng);
                    lineNo++;
                }

                lineNo = 0;
                for (lng=lngInterval; lng>=lngLeft; lng-=lngMinorInterval){
                    if (lng <= lngRight)
                        drawLngLine(lng);
                    lineNo++;
                }
            }

            //Draw major and minor lat-ticks/lines
            if (latInterval > 0) {
                lineNo = 0;
                for (var lat=latInterval; lat<=latTop; lat+=latMinorInterval){
                    if (lat >= latBottom)
                        drawLatLine(lat);
                    lineNo++;
                }

                lineNo = 0;
                for (lat=latInterval; lat>=latBottom; lat-=latMinorInterval){
                    if (lat <= latTop)
                        drawLatLine(lat);
                    lineNo++;
                }
            }

            if (this.options.showLabel){
                //Draw lng labels
                for (var i=0; i<lngLabelList.length; i++)
                    this._drawLngLine(lngLabelList[i], false, true);

                //Draw lat labels
                for (i=0; i<latLabelList.length; i++)
                    this._drawLatLine(latLabelList[i], false, true);
            }

            this.drawing = false;

        },

        //**********************************************************
        _setLineStyle: function (options, shadow){
            options = options || this.options;
            this.ctx.lineWidth = options.weight + (shadow ? 2*this.options.shadowWidth : 0);
            this.ctx.strokeStyle = shadow ? this.options.shadowColor : options.color;
        },

        //**********************************************************
        _getLabel: function( lat, lng ){
            var saveFormatId = window.latLngFormat.options.formatId;
            if (saveFormatId > window.latLngFormat.LATLNGFORMAT_DD)
                window.latLngFormat.setTempFormat( this.options.latLngFormatId );

            var result = window.latLngFormat( lat || 0, lng || 0 ).formatTrunc({asArray: true})[lat === undefined ? 1 : 0];

            if (saveFormatId > window.latLngFormat.LATLNGFORMAT_DD)
                window.latLngFormat.setTempFormat( saveFormatId );
            return result;
        },

        //**********************************************************
        _drawLabel: function( label, lowerLeft, lowerTop, textWidth, textHeight){
            textHeight = textHeight || this.options.fontSize;

            //Clear the rect where the label is inserted
            this.ctx.fillStyle = this.options.textBackgroundColor;
            this.ctx.clearRect(lowerLeft - 2, lowerTop - textHeight - 1, textWidth + 4, textHeight + 4);
            this.ctx.fillRect(lowerLeft - 2, lowerTop - textHeight - 1, textWidth + 4, textHeight + 4);

            //Write the label
/* TODO: Find style to give white text-shadow a la:
            this.ctx.shadowColor = 'rgba(0,0,0,0.28)';
            this.ctx.shadowBlur = 4;
*/
            this.ctx.fillStyle = this.options.fontColor;
            this.ctx.fillText(label, lowerLeft, lowerTop);
//            this.ctx.shadowBlur = 0;

        },

        //**********************************************************
        _drawAnyLine: function(linePartMethodName, value, isMinor, onlyLabel) {
            var options = isMinor ? this.options.miniorOptions : this.options,
                type  = this.options.type & (isMinor ? TYPE_MINOR_ANY : TYPE_MAJOR_ANY),
                drawOptions = {
                    isTick    : type & TYPE_TICK_ANY,
                    isMinor   : isMinor,
                    tickLength: isMinor ? this.options.minorTickLength : this.options.majorTickLength,
                    onlyLabel : onlyLabel
                };

            if (!onlyLabel){
            //Draw shadow with extra shadow-length for ticks and without label
                this._setLineStyle(options, true);
                drawOptions.tickLength += this.options.shadowWidth;
                this[linePartMethodName](value, drawOptions);
                drawOptions.tickLength -= this.options.shadowWidth;
            }

            //Draw line
            this._setLineStyle(options);
            this[linePartMethodName](value, drawOptions);
        },

        //**********************************************************
        _drawLatLine: function(lat, isMinor, onlyLabel) {
            this._drawAnyLine('_drawLatLinePart', lat, isMinor, onlyLabel);
        },

        //**********************************************************
        _drawLatLinePart: function(lat, drawOptions) {
            var lngLeft,
                lngRight,
                ll = this._latLngToCanvasPoint(L.latLng(lat, this.lngLeft));

            if (!this.options.isDecimal)
                //Round to hole minutes
                lat = Math.round(lat*60)/60;

            var latStr   = drawOptions.onlyLabel ? this._getLabel(lat, undefined) : '',
                txtWidth = drawOptions.onlyLabel ? this.ctx.measureText(latStr).width : 0,

                tickWidth = drawOptions.isMinor ? drawOptions.tickLength : txtWidth + this.options.minorTickLength,

                prevP = null,
                rr, s, y;

            if (this.options.latLineCurved) {
                var lngDelta = this.options.latLineCurved || 0.5;
                lngLeft = this.lngLeft;
                lngRight = this.lngRight;

                if (ll.x > 0) {
                    lngLeft = this.map.containerPointToLatLng(L.point(0, ll.y)).lng - this.pointPerLng;
                    ll.x = 0;
                }
                rr = this._latLngToCanvasPoint(L.latLng(lat, lngRight));
                if (rr.x < this.canvasWidth) {
                    lngRight = this.map.containerPointToLatLng(L.point(this.canvasWidth, rr.y)).lng + this.pointPerLng;
                    if (lngLeft > 0 && lngRight < 0)
                        lngRight += 360;
                }

                if (!drawOptions.onlyLabel){
                    this.ctx.beginPath();
                    this.ctx.moveTo(ll.x, ll.y);

                    for (var lng = lngLeft; lng <= lngRight; lng += lngDelta) {
                        rr = this._latLngToCanvasPoint(L.latLng(lat, lng));
                        this.ctx.lineTo(rr.x, rr.y);

                        if (this.options.showLabel && prevP != null) {
                            if (prevP.x < 0 && rr.x >= 0) {
                                s = (rr.x - 0) / (rr.x - prevP.x);
                                y = rr.y - ((rr.y - prevP.y) * s);
                                this.ctx.fillText(latStr, 0, y + (this.options.fontSize/2));
                            }
                            else
                                if (prevP.x <= (this.canvasWidth - txtWidth) && rr.x > (this.canvasWidth - txtWidth)) {
                                    s = (rr.x - this.canvasWidth) / (rr.x - prevP.x);
                                    y = rr.y - ((rr.y - prevP.y) * s);
                                    this.ctx.fillText(latStr, this.canvasWidth - txtWidth, y + (this.options.fontSize/2)-2);
                                }
                        }
                        prevP = {x:rr.x, y:rr.y, lng:lng, lat:lat};
                    }
                    this.ctx.stroke();
                }
            }
            else {
                lngRight = this.lngRight;
                rr = this._latLngToCanvasPoint(L.latLng(lat, lngRight));
                if (this.options.lngLineCurved) {
                    lngRight = this.map.containerPointToLatLng(L.point(0, rr.y)).lng;
                    rr = this._latLngToCanvasPoint(L.latLng(lat, lngRight));

                    lngLeft = this.map.containerPointToLatLng(L.point(this.canvasWidth, rr.y)).lng;
                    ll = this._latLngToCanvasPoint(L.latLng(lat, lngLeft));
                }
                else
                    rr.y = ll.y;

                if (!drawOptions.onlyLabel){
                    this.ctx.beginPath();

                    if (drawOptions.isTick){
                        this.ctx.moveTo(0, ll.y);
                        this.ctx.lineTo(tickWidth, ll.y);

                        this.ctx.moveTo(this.canvasWidth, ll.y);
                        this.ctx.lineTo(this.canvasWidth - tickWidth, ll.y);
                    }
                    else {
                        this.ctx.moveTo(ll.x, ll.y);
                        this.ctx.lineTo(rr.x, rr.y);
                    }

                    this.ctx.stroke();
                }
            }

            if (drawOptions.onlyLabel) {
                var adjustTop = this.options.fontSize/2 - 2;
                this._drawLabel( latStr, 0, ll.y + adjustTop, txtWidth);
                this._drawLabel( latStr, this.canvasWidth - txtWidth - 2, rr.y + adjustTop, txtWidth);
            }
        },

        //**********************************************************
        _drawLngLine: function(lng, isMinor, onlyLabel) {
            this._drawAnyLine('_drawLngLinePart', lng, isMinor, onlyLabel);
        },

        //**********************************************************
        _drawLngLinePart: function(lng, drawOptions) {
            var tt,
                prevP = null,
                bb = this._latLngToCanvasPoint(L.latLng(this.latBottom, lng)),
                //Bug fix: leaflet (1.4.0) wrap have rounding-error.
                lngWrap = lng == 180 ? 180 : lng - Math.floor((lng + 180) / 360) * 360;


            if (!this.options.isDecimal)
                //Round to hole minutes
                lngWrap = Math.round(lngWrap*60)/60;

            var lngStr   = drawOptions.onlyLabel ? this._getLabel(undefined, lngWrap) : '',
                txtWidth = drawOptions.onlyLabel ? this.ctx.measureText(lngStr).width : 0;

            if (this.options.lngLineCurved) {
                this.ctx.beginPath();
                this.ctx.moveTo(bb.x, bb.y);
                for (var lat=this.latBottom; lat<this.latTop; lat += this.options.lngLineCurved) {
                    tt = this._latLngToCanvasPoint(L.latLng(lat, lng));
                    this.ctx.lineTo(tt.x, tt.y);

                    if (drawOptions.onlyLabel && prevP != null) {
                        if (prevP.y > 8 && tt.y <= 8)
                            this.ctx.fillText(lngStr, tt.x - (txtWidth/2), this.options.fontSize);
                        else
                            if (prevP.y >= this.canvasHeight && tt.y < this.canvasHeight)
                                this.ctx.fillText(lngStr, tt.x - (txtWidth/2), this.canvasHeight-2);
                    }

                    prevP = {x:tt.x, y:tt.y, lng:lng, lat:lat};
                }
                this.ctx.stroke();
            }
            else {
                var latTop = this.latTop;
                    tt = this._latLngToCanvasPoint(L.latLng(latTop, lng));

                if (this.options.latLineCurved) {
                    latTop = this.map.containerPointToLatLng(L.point(tt.x, 0)).lat;
                    if (latTop > 90)
                        latTop = 90;
                    tt = this._latLngToCanvasPoint(L.latLng(latTop, lng));

                    var latBottom = this.map.containerPointToLatLng(L.point(bb.x, this.canvasHeight)).lat;
                    if (latBottom < -90)
                        latBottom = -90;
                    bb = this._latLngToCanvasPoint(L.latLng(latBottom, lng));
                }
                else
                    bb.x = tt.x;

                if (!drawOptions.onlyLabel){
                    this.ctx.beginPath();

                    if (drawOptions.isTick){
                        this.ctx.moveTo(tt.x, 0);
                        this.ctx.lineTo(tt.x, drawOptions.tickLength);

                        this.ctx.moveTo(tt.x, this.canvasHeight);
                        this.ctx.lineTo(tt.x, this.canvasHeight - drawOptions.tickLength);
                    }
                    else {
                        this.ctx.moveTo(tt.x, tt.y);
                        this.ctx.lineTo(bb.x, bb.y);
                    }
                    this.ctx.stroke();
                }
            }

            if (drawOptions.onlyLabel) {
                var adjustLeft = -txtWidth/2;
                this._drawLabel( lngStr, tt.x + adjustLeft, this.options.fontSize-1, txtWidth);
                this._drawLabel( lngStr, bb.x + adjustLeft, this.canvasHeight-3,     txtWidth);
            }
        },

        //**********************************************************
        _latLngToCanvasPoint: function(latlng) {
            var map = this._map,
                projectedPoint = map.project(L.latLng(latlng));
            projectedPoint._subtract(map.getPixelOrigin());
            return L.point(projectedPoint).add(map._getMapPanePos());
        }

    });

    L.latlngGraticule = function (options) {
        return new L.LatLngGraticule(options);
    };
}(jQuery, L, this, document));



