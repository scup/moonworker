'use strict';

function Job(){
	return this.constructor.apply(this,arguments)
};

Job.prototype.constructor = function(action,worker){
	this.action = action
	this.worker = worker
	return this.start()
};

Job.prototype.start = function(){
	this.startTime = new Date().getTime();
	this.action(this,this.worker);;
};

Job.prototype.next = function(){
	this.executionTime = new Date().getTime() - this.startTime;
	this.worker.next(this);
};


module.exports = Job;
