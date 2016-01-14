var Worker = require('../src/Worker');
var Job = require('../src/Job');
var chai = require('chai');
var sinon = require('sinon');

describe('Worker', function() {
	describe('run', function() {
		it('should run 5 cycles and create job 5 times', function() {
			//Given
			var jobSpy = sinon.spy(Job.prototype, "constructor");
			var config = {
				step : function(){},
				interval : 100 // miliseconds
			};
			var simpleWorker = new Worker(config);
			clock = sinon.useFakeTimers();

			//When
			simpleWorker.run();
			clock.tick(500);

			//Then
			chai.expect(jobSpy.callCount).to.be.equal(5);

			clock.restore();
			simpleWorker.stop();
			jobSpy.restore();
			
		});
	});
});