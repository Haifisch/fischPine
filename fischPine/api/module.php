<?php namespace pineapple;

putenv('LD_LIBRARY_PATH='.getenv('LD_LIBRARY_PATH').':/sd/lib:/sd/usr/lib');
putenv('PATH='.getenv('PATH').':/sd/usr/bin:/sd/usr/sbin');

class fischPine extends Module
{
	public function route()
	{
		switch ($this->request->action) {
			case 'startPortScan':
				$this->startPortScan();
				break;
			case 'refreshOutput':
				$this->refreshOutput();
				break;
			case 'pingAddress':
				$this->pingAddress();
				break;
			break;
		}
	}

	private function pingAddress() {
		$modulePingIPAddress = $this->request->modulePingIPAddress;
		exec("/bin/ping -c 5 " . $modulePingIPAddress, $ping_time);
		if (count($ping_time) == 0) {
			$this->response = "no response";
		} else {
			$this->response = $ping_time;
		}
		
	}

	private function refreshOutput()
	{
		if (file_exists("/tmp/nmap.scan")) {
			$output = file_get_contents("/tmp/nmap.scan");
			if (!empty($output)) {
				$this->response = $output;
			}
		} 
	}

	private function startPortScan() 
	{
		$moduleIPAddress = $this->request->moduleIPAddress;
		$modulePorts = $this->request->modulePorts;
		if ($this->checkRunning("nmap")) {
			shell_exec("killall nmap");
		}
		$full_cmd = "/usr/bin/nmap -p ".$modulePorts." ".$moduleIPAddress." > /tmp/nmap.scan";
		shell_exec($full_cmd);
		$this->response = array('success' => true);
	}
}




