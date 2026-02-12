function AnimationController() {
  this.isPaused = false;
  this.timerId = null;
  this.currentIndex = 0;
  this.totalFrames = 0;
  this.speed = 0;
  this.phase = "idle";
  this.onFrame = null;
  this.onComplete = null;
}

AnimationController.prototype.start = function (totalFrames, speed, onFrame, onComplete, phaseLabel) {
  this.stop();
  this.totalFrames = totalFrames;
  this.speed = speed;
  this.currentIndex = 0;
  this.isPaused = false;
  this.phase = phaseLabel || "exploring";
  this.onFrame = onFrame;
  this.onComplete = onComplete;
  this._scheduleNext();
};

AnimationController.prototype.pause = function () {
  if (this.phase === "idle" || this.phase === "done") return;
  this.isPaused = true;
  if (this.timerId) {
    clearTimeout(this.timerId);
    this.timerId = null;
  }
};

AnimationController.prototype.resume = function () {
  if (!this.isPaused) return;
  this.isPaused = false;
  this._scheduleNext();
};

AnimationController.prototype.stepForward = function () {
  if (this.phase === "idle" || this.phase === "done") return;
  this.isPaused = true;
  if (this.timerId) {
    clearTimeout(this.timerId);
    this.timerId = null;
  }
  if (this.currentIndex <= this.totalFrames) {
    if (this.onFrame) this.onFrame(this.currentIndex);
    this.currentIndex++;
  }
  if (this.currentIndex > this.totalFrames) {
    this.phase = "done";
    if (this.onComplete) this.onComplete();
  }
};

AnimationController.prototype.stop = function () {
  if (this.timerId) {
    clearTimeout(this.timerId);
    this.timerId = null;
  }
  this.isPaused = false;
  this.currentIndex = 0;
  this.totalFrames = 0;
  this.phase = "idle";
  this.onFrame = null;
  this.onComplete = null;
};

AnimationController.prototype._scheduleNext = function () {
  if (this.isPaused) return;
  if (this.currentIndex > this.totalFrames) {
    this.phase = "done";
    if (this.onComplete) this.onComplete();
    return;
  }
  var self = this;
  this.timerId = setTimeout(function () {
    if (self.isPaused) return;
    if (self.onFrame) self.onFrame(self.currentIndex);
    self.currentIndex++;
    self._scheduleNext();
  }, this.speed);
};

module.exports = AnimationController;
