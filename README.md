![moonwalker](http://i.imgur.com/TA5YRfs.png)

# Moonworker


### Usage
```
var MoonWorker = require('moonworker');

var config = {
	step : function (job, worker){
		console.log("runned");
		job.next();
	},
	interval : 1000 // miliseconds
};

var simpleWorker = new MoonWorker(config);

simpleWorker.run();
```

