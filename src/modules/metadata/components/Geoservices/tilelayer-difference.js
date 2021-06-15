/* eslint-disable */
import L from 'leaflet';

/**
 * Attempt to implement a Difference Layer.
 * The pixel manipulation can be achieved by converting the pixels to canvas.
 * The remaining problem is, how to load the two layers and gain access to them in a single method.
 * Code for how to solve this could potentially be found in the Leaflet TileLayer.GL plugin.
 */


L.TileLayer.Difference = L.TileLayer.extend({

  initialize: function (url, options) {
    options = options || {}
    options.crossOrigin = true;
    L.TileLayer.prototype.initialize.call(this, url, options);

    this.on('tileload', function(e) {
      this._makeGrayscale(e.tile);
    });
  },

  _createTile: function () {
    var tile = L.TileLayer.prototype._createTile.call(this);
    tile.crossOrigin = "Anonymous";
    return tile;
  },
  _makeGrayscale: function (img) {
    if (img.getAttribute('data-grayscaled'))
      return;

    img.crossOrigin = '';
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;
    for (var i = 0, n = pix.length; i < n; i += 4) {
      pix[i] = pix[i + 1] = pix[i + 2] = (this.options.quotaRed * pix[i] + this.options.quotaGreen * pix[i + 1] + this.options.quotaBlue * pix[i + 2]) / this.options.quotaDivider();
    }
    ctx.putImageData(imgd, 0, 0);
    img.setAttribute('data-grayscaled', true);
    img.src = canvas.toDataURL();
  }
});

L.tileLayer.difference = function (layers, options) {
  return new L.TileLayer.Difference(layers, options);
};
