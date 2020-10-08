'use strict';

function galleryDefault() {
  largeImg.setAttribute('src', thumbs.children[0].getAttribute('href'));
  largeImg.setAttribute('alt', thumbs.children[0].getAttribute('title'));
};

function gallerySort(event) {
  var target = event.target;

  function selectedImg(select, alt) {
    largeImg.setAttribute('src', select);
    largeImg.setAttribute('alt', alt);
    event.preventDefault();
  };

  while (target != this) {

    if (target.nodeName == 'A') {
      var select = target.getAttribute('href');
      var alt = target.getAttribute('title');
      return selectedImg(select, alt);
    };

    target = target.parentNode;
  };

};

var gallery = document.querySelector('#gallery');
var largeImg = gallery.querySelector('#largeImg');
var thumbs = gallery.querySelector('#thumbs');

galleryDefault();

gallery.addEventListener('click', gallerySort);
