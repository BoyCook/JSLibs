/*
 A Javascript timer object
 */
function Timer(params) {
    //Defaults to countdown
    if (params) {
        this.pid = undefined;
        this.element = params.element;
        this.cnt = params.cnt;
        this.target = params.target;
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
}

Timer.prototype.start = function() {
    var context = this;
    this.pid = setInterval(function() {
        context.count();
    }, this.interval);
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
Timer.prototype.countUp = function() {
    this.cnt += this.cntBy;
    this.next();
};
Timer.prototype.countDown = function() {
    this.cnt -= this.cntBy;
    this.next();
};
Timer.prototype.next = function() {
    this.setValue();
    if (this.cnt == this.target) {
        if (this.finished) {
            this.finished();
        }
        clearInterval(this.pid);
    }
};

function CountDown(params) {
    Timer.call(this, params);
}
CountDown.prototype = new Timer();
CountDown.prototype.constructor = CountDown;
CountDown.prototype.count = function() {
    this.countDown();
};

function CountUp(params) {
    Timer.call(this, params);
}
CountUp.prototype = new Timer();
CountUp.prototype.constructor = CountDown;
CountUp.prototype.count = function() {
    this.countUp();
};
