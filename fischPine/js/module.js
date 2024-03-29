registerController('PabloFiController', ['$api', '$scope', function($api, $scope) {
	$scope.moduleIPAddress = "";
	$scope.modulePingCount = "";
	$scope.modulePorts = "";
	$scope.outputContent = "";
	$scope.pingOutputContent = "";
	$scope.tracerouteOutputContent = "";
	$scope.moduleVersion = "1.0.0";
	var refreshInterval = null;
	var tracerouteInterval = null;
	var intervalCount = 0;
	var tracerouteIntervalCount = 0;

	$scope.startPing = (function() {
		console.log("startPing() "+$scope.modulePingIPAddress);
		$scope.pingOutputContent = "running ping...";
		$api.request({
			module: "fischPine",
			action: "pingAddress",
			modulePingIPAddress: $scope.modulePingIPAddress,
			modulePingCount: $scope.modulePingCount
		}, function(response) {
			console.log("pingAddress => "+JSON.stringify(response));
			var finalStr = "";
			for (var i = 0; i < response.length; i++) {
				finalStr += response[i] + '\n';
			}
			$scope.pingOutputContent = finalStr;
		});
	});

	$scope.startPortScan = (function() {
		console.log("startPortScan() "+$scope.moduleIPAddress);
		$scope.outputContent = "running nmap on "+$scope.moduleIPAddress+":"+$scope.modulePorts;
		$api.request({
			module: "fischPine",
			action: "startPortScan",
			moduleIPAddress: $scope.moduleIPAddress,
			modulePorts: $scope.modulePorts
		}, function(response) {
			console.log(response);
			if (refreshInterval) {
				clearInterval(refreshInterval);
			}
			refreshInterval = setInterval(function() {
				if (intervalCount >= 120) {
					intervalCount = 0;
					clearInterval(refreshInterval);
					refreshInterval = null;
				} else {
					$scope.outputContent = $scope.outputContent+".";
					intervalCount += 1;
				}
				$scope.refreshOutput();
			}, 1000);
		})
	});

	$scope.refreshOutput = (function() {
		$api.request({
			module: "fischPine",
			action: "refreshOutput"
		}, function(response) {
			const regex = /^(Starting Nmap)\s(\d.\d\d)\s\((.*?)\)[\w\W](.*)(\r\n)?$/gm;
			console.log("refreshOutput => "+response.replace(regex, '').trim());
			$scope.outputContent = response.replace(regex, '').trim();			
			if (response.includes("Nmap done:") && refreshInterval) {
				clearInterval(refreshInterval);
				refreshInterval = null;
			}
		})
	});

	// moduleTracerouteAddress
	$scope.startTraceroute = (function() {
		$scope.tracerouteOutputContent = "running traceroute on "+$scope.moduleTracerouteAddress;
		$api.request({
			module: "fischPine",
			action: "tracerouteAddress",
			moduleTracerouteAddress: $scope.moduleTracerouteAddress
		}, function(response) {
			console.log("tracerouteAddress => "+JSON.stringify(response));
		})
		if (tracerouteInterval) {
			clearInterval(tracerouteInterval);
			tracerouteInterval = null;
		}
		tracerouteInterval = setInterval(function() {
			$api.request({
				module: "fischPine",
				action: "refreshTracerouteOutput"
			}, function (response) {
				console.log("refreshTracerouteOutput => "+JSON.stringify(response));
				$scope.tracerouteOutputContent = response;
				if (tracerouteInterval && tracerouteIntervalCount >= 160) {
					clearInterval(tracerouteInterval);
					tracerouteInterval = null;
				} else {
					tracerouteIntervalCount += 1;
				}
			});	
		}, 1000);
	});

}]);
