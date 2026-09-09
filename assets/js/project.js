/* =========================================================
   project.js — shared behaviour for all projects/*.html
   Progressive enhancement: with JS disabled, thumbnails are
   ordinary links to the full-size media and the page still
   reads top to bottom.

   No innerHTML is used anywhere. All media paths come from
   the page's own markup, never from user input or the URL.
   ========================================================= */
(function () {
  "use strict";

  var screenEl = document.querySelector(".screen");
  var stripEl  = document.querySelector(".strip");
  if (!screenEl || !stripEl) return;

  var videoEl = screenEl.querySelector("video");
  var imgEl   = screenEl.querySelector("img");
  var srcName = document.querySelector(".bar .src");
  var thumbs  = Array.prototype.slice.call(stripEl.querySelectorAll(".thumb"));

  /* ---------- source selection ---------- */
  function select(thumb) {
    var isVideo = thumb.getAttribute("data-type") === "video";
    var label   = thumb.getAttribute("data-label") || "";
    var full    = thumb.getAttribute("href") || "";

    thumbs.forEach(function (t) {
      t.setAttribute("aria-current", t === thumb ? "true" : "false");
    });
    if (srcName) srcName.textContent = label;

    if (isVideo) {
      if (imgEl) imgEl.hidden = true;
      if (videoEl) {
        videoEl.hidden = false;
        try { videoEl.play(); } catch (e) { /* autoplay may be blocked; controls remain */ }
      }
    } else {
      if (videoEl) {
        videoEl.pause();
        videoEl.hidden = true;
      }
      if (imgEl) {
        imgEl.hidden = false;
        imgEl.setAttribute("src", full);
        imgEl.setAttribute("alt", label);
      }
      screenEl.classList.remove("live");
    }
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function (ev) {
      ev.preventDefault();
      select(thumb);
    });
  });

  /* ---------- tally follows playback ---------- */
  if (videoEl) {
    videoEl.addEventListener("play",  function () { screenEl.classList.add("live"); });
    videoEl.addEventListener("pause", function () { screenEl.classList.remove("live"); });
    videoEl.addEventListener("ended", function () { screenEl.classList.remove("live"); });
  }

  /* ---------- lightbox for stills ---------- */
  var lb      = document.querySelector(".lb");
  var lbImg   = lb && lb.querySelector("img");
  var lbClose = lb && lb.querySelector(".lb-close");
  var lastFocus = null;

  function openLb(src, alt) {
    if (!lb || !lbImg) return;
    lastFocus = document.activeElement;
    lbImg.setAttribute("src", src);
    lbImg.setAttribute("alt", alt || "");
    lb.hidden = false;
    if (lbClose) lbClose.focus();
  }
  function closeLb() {
    if (!lb) return;
    lb.hidden = true;
    lbImg.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (imgEl) {
    imgEl.addEventListener("click", function () {
      if (!imgEl.hidden) openLb(imgEl.getAttribute("src"), imgEl.getAttribute("alt"));
    });
  }
  if (lbClose) lbClose.addEventListener("click", closeLb);
  if (lb) {
    lb.addEventListener("click", function (ev) {
      if (ev.target === lb) closeLb();
    });
  }
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && lb && !lb.hidden) closeLb();
  });

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
