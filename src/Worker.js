'use strict';

var Job = require('./Job')

var Worker = function(){
	return this.constructor.apply(this,arguments)
};

Worker.prototype.constructor = function(params){
	this.action = params.step;
	this.interval = params.interval || 0;
	this.originalInterval = params.interval;
	this.autoplay = params.autoPlay || false;
	this.debug = params.debug || false;
	this.parallel = params.parallel || Infinity;
	this.autoDelay = params.autoDelay || false;
	this.timesRunned = 0
	this.stopped = false;
	this.concurrentExecutions = 0;
	this.executionTimes = [];

	(function tryToRun(){
		if (this.autoplay)
			this.run();
	}.bind(this))()

	return this
};

Worker.prototype.argumentsToArray = function(){
	var returnArray = [];
	for(var arg in arguments){
		returnArray.push(arguments[arg])
	}

	return returnArray;
};

Worker.prototype.log = function(){
	if (this.debug){
		var array = this.argumentsToArray(arguments);
		array.reverse()
		array.push('[MOONWORKER] :');
		array.reverse()
		console.log.apply(this,array)
	}
};

Worker.prototype.autoDelayDown = function(){
	this.log('shutting autoDelay DOWN');
	this.autoDelay = false;
	this.interval = this.originalInterval;
};

Worker.prototype.autoDelayUp = function(){
	this.log('shutting autoDelay UP');
	this.autoDelay = true;
};

Worker.prototype.run = function() {
	setTimeout(function(){
		if (!this.stopped && this.concurrentExecutions < this.parallel){
			this.concurrentExecutions ++;
			new Job(this.action,this)
		}
		return this.run()
	}.bind(this),this.interval)
};

Worker.prototype.average = function(executionTime){
	if (this.executionTimes.length > 5){
		this.executionTimes = this.executionTimes.splice(-5)
	}
	this.executionTimes.push(executionTime)
	var averageExecutionTime = eval('('+this.executionTimes.join('+')+')/'+this.executionTimes.length);
	if (this.autoDelay){
		this.interval = averageExecutionTime/this.parallel;
		this.log('interval :'+parseInt(this.interval)+'ms')
	}
	this.log('averageExecutionTime :'+parseInt(averageExecutionTime)+'ms')
	
	return averageExecutionTime
};

Worker.prototype.next = function(job){
	this.log('concurrentExecutions :'+this.concurrentExecutions)
	this.average(job.executionTime)
	this.concurrentExecutions--;
	this.timesRunned++;
};

Worker.prototype.stop = function() {
	this.stopped = true;
};


module.exports = Worker