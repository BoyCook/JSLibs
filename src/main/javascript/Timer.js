/*
    A Javascript timer object
 */
function Timer(params) {
    //Defaults to countdown
    this.element = params.element;
    this.pid = undefined;
    this.cnt = undefined;
    this.target = undefined;
    this.cntUp = params.cntUp;
    this.cntBy = 1000;
    this.interval = 1000;
    this.finished = params.finished;

    if (params.cntBy) {
        this.cntBy = params.cntBy;
    }
    if (params.interval) {
        this.interval = params.interval;
    }

    if (params.setValue) {
        this.setValue = params.setValue;
    } else {
        this.setValue = function() {
            document.getElementById(this.element).value = (this.cnt / 1000);
        };
    }
}

Timer.prototype.start = function(cnt) {
    var context = this;
    if (this.cntUp) {
        this.target = cnt;
        this.cnt = 0;
        this.pid = setInterval(function() {
            context.countUp();
        }, this.interval);
    } else {
        this.target = 0;
        this.cnt = cnt;
        this.pid = setInterval(function() {
            context.countDown();
        }, this.interval);
    }
};
Timer.prototype.stop = function() {
    clearInterval(this.pid);
};
Timer.prototype.pause = function() {
    clearInterval(this.pid);
};
Timer.prototype.resume = function() {
    this.start(this.cnt);
};
Timer.prototype.countUp= function() {
    this.cnt += this.cntBy;
    this.count();
};
Timer.prototype.countDown= function() {
    this.cnt -= this.cntBy;
    this.count();
};
Timer.prototype.count = function() {
    this.setValue();
    if (this.cnt == this.target) {
        if (this.finished) {
            this.finished();
        }
        clearInterval(this.pid);
    }
};

function StopWatch(params) {
    Timer.call(this, params);
}
StopWatch.prototype = new Timer();
StopWatch.prototype.constructor = StopWatch;

function CountDown(params) {
    Timer.call(this, params);
}
CountDown.prototype = new Timer();
CountDown.prototype.constructor = CountDown;


