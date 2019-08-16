registerController('PabloFiController', ['$api', '$scope', function($api, $scope) {
	$scope.moduleIPAddress = "";
	$scope.modulePorts = "";
	$scope.outputContent = "";
	$scope.pingOutputContent = "";
	$scope.moduleVersion = "1.0.0";
	var refreshInterval = null;
	var intervalCount = 0;

	$scope.startPing = (function() {
		console.log("startPing() "+$scope.modulePingIPAddress);
		$scope.pingOutputContent = "Starting ping...";
		$api.request({
			module: "fischPine",
			action: "pingAddress",
			modulePingIPAddress: $scope.modulePingIPAddress
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
		$scope.outputContent = "Starting scan...";
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
				$scope.refreshOutput();
				if (intervalCount >= 60) {
					intervalCount = 0;
					clearInterval(refreshInterval);
				} else {
					intervalCount += 1;
				}
			}, 1000);
		})
	});

	$scope.refreshOutput = (function() {
		$api.request({
			module: "fischPine",
			action: "refreshOutput"
		}, function(response) {
			console.log("refreshOutput => "+response);
			$scope.outputContent = response.trim();
		})
	});

}]);
